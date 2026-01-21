import { Injectable } from '@nestjs/common';
import { AgentStatus, BillStatus, Prisma } from '@prisma/client';
import { PrismaService } from '../database/prisma.service';
import { OverviewQueryDto } from './dto/overview-query.dto';
import { EarningsQueryDto } from './dto/earnings-query.dto';

const RANGE_DAYS: Record<string, number> = {
  '7d': 7,
  '30d': 30,
  '90d': 90,
};

const DEFAULT_RANGE = '7d';
const DEFAULT_EARNINGS_RANGE = '30d';
const DEFAULT_GROUP_BY = 'day';

const formatDecimal = (value: Prisma.Decimal | number): string => {
  if (typeof value === 'number') return value.toFixed(2);
  return value.toString();
};

const formatPercentage = (current: number, previous: number): string => {
  if (previous <= 0) return '+0.0%';
  const change = ((current - previous) / previous) * 100;
  const sign = change >= 0 ? '+' : '';
  return `${sign}${change.toFixed(1)}%`;
};

const getUtcDateKey = (date: Date): string => {
  return date.toISOString().slice(0, 10);
};

const getUtcStartOfDay = (date: Date): Date => {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
};

const addUtcDays = (date: Date, days: number): Date => {
  const next = new Date(date.getTime());
  next.setUTCDate(next.getUTCDate() + days);
  return next;
};

const getUtcWeekStart = (date: Date): Date => {
  const day = date.getUTCDay();
  const diff = (day + 6) % 7; // Monday start
  return addUtcDays(getUtcStartOfDay(date), -diff);
};

const getUtcMonthStart = (date: Date): Date => {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1));
};

const createBuckets = (start: Date, end: Date, groupBy: 'day' | 'week' | 'month') => {
  const buckets: { key: string; start: Date }[] = [];
  let cursor = new Date(start.getTime());

  while (cursor < end) {
    let bucketStart: Date;
    if (groupBy === 'week') {
      bucketStart = getUtcWeekStart(cursor);
    } else if (groupBy === 'month') {
      bucketStart = getUtcMonthStart(cursor);
    } else {
      bucketStart = getUtcStartOfDay(cursor);
    }

    const key = getUtcDateKey(bucketStart);
    if (!buckets.find((bucket) => bucket.key === key)) {
      buckets.push({ key, start: bucketStart });
    }

    if (groupBy === 'month') {
      cursor = new Date(Date.UTC(cursor.getUTCFullYear(), cursor.getUTCMonth() + 1, 1));
    } else if (groupBy === 'week') {
      cursor = addUtcDays(cursor, 7);
    } else {
      cursor = addUtcDays(cursor, 1);
    }
  }

  return buckets;
};

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getOverview(userId: string, query: OverviewQueryDto) {
    const range = query.range ?? DEFAULT_RANGE;
    const days = RANGE_DAYS[range] ?? RANGE_DAYS[DEFAULT_RANGE];
    const end = addUtcDays(getUtcStartOfDay(new Date()), 1);
    const start = addUtcDays(end, -days);
    const previousStart = addUtcDays(start, -days);
    const previousEnd = start;

    const [balanceAgg, activeAgents, revenueCurrentAgg, revenuePreviousAgg, callsCurrent, callsPrevious] =
      await Promise.all([
        this.prisma.bill.aggregate({
          where: {
            payeeUserId: userId,
            status: BillStatus.PAID,
          },
          _sum: { total: true },
        }),
        this.prisma.agent.count({
          where: {
            ownerUserId: userId,
            status: AgentStatus.PUBLISHED,
          },
        }),
        this.prisma.bill.aggregate({
          where: {
            payeeUserId: userId,
            createdAt: {
              gte: start,
              lt: end,
            },
          },
          _sum: { total: true },
        }),
        this.prisma.bill.aggregate({
          where: {
            payeeUserId: userId,
            createdAt: {
              gte: previousStart,
              lt: previousEnd,
            },
          },
          _sum: { total: true },
        }),
        this.prisma.run.count({
          where: {
            agent: {
              ownerUserId: userId,
            },
            startedAt: {
              gte: start,
              lt: end,
            },
          },
        }),
        this.prisma.run.count({
          where: {
            agent: {
              ownerUserId: userId,
            },
            startedAt: {
              gte: previousStart,
              lt: previousEnd,
            },
          },
        }),
      ]);

    const totalBalance = Number(balanceAgg._sum.total ?? 0);
    const revenueCurrent = Number(revenueCurrentAgg._sum.total ?? 0);
    const revenuePrevious = Number(revenuePreviousAgg._sum.total ?? 0);

    return {
      totalBalance: formatDecimal(totalBalance),
      dailyRevenue: formatDecimal(days ? revenueCurrent / days : 0),
      activeAgents,
      stakedAssets: formatDecimal(0),
      revenueChange: formatPercentage(revenueCurrent, revenuePrevious),
      callsChange: formatPercentage(callsCurrent, callsPrevious),
    };
  }

  async getEarnings(userId: string, query: EarningsQueryDto) {
    const range = query.range ?? DEFAULT_EARNINGS_RANGE;
    const days = RANGE_DAYS[range] ?? RANGE_DAYS[DEFAULT_EARNINGS_RANGE];
    const groupBy = query.groupBy ?? DEFAULT_GROUP_BY;
    const end = addUtcDays(getUtcStartOfDay(new Date()), 1);
    const start = addUtcDays(end, -days);

    const [bills, runs] = await Promise.all([
      this.prisma.bill.findMany({
        where: {
          payeeUserId: userId,
          createdAt: {
            gte: start,
            lt: end,
          },
        },
        select: {
          createdAt: true,
          total: true,
        },
      }),
      this.prisma.run.findMany({
        where: {
          agent: {
            ownerUserId: userId,
          },
          startedAt: {
            gte: start,
            lt: end,
          },
        },
        select: {
          startedAt: true,
        },
      }),
    ]);

    const buckets = createBuckets(start, end, groupBy);
    const revenueMap = new Map<string, number>();
    const callsMap = new Map<string, number>();

    for (const bucket of buckets) {
      revenueMap.set(bucket.key, 0);
      callsMap.set(bucket.key, 0);
    }

    for (const bill of bills) {
      const bucketKey =
        groupBy === 'month'
          ? getUtcDateKey(getUtcMonthStart(bill.createdAt))
          : groupBy === 'week'
          ? getUtcDateKey(getUtcWeekStart(bill.createdAt))
          : getUtcDateKey(getUtcStartOfDay(bill.createdAt));
      revenueMap.set(bucketKey, (revenueMap.get(bucketKey) ?? 0) + Number(bill.total));
    }

    for (const run of runs) {
      if (!run.startedAt) continue;
      const bucketKey =
        groupBy === 'month'
          ? getUtcDateKey(getUtcMonthStart(run.startedAt))
          : groupBy === 'week'
          ? getUtcDateKey(getUtcWeekStart(run.startedAt))
          : getUtcDateKey(getUtcStartOfDay(run.startedAt));
      callsMap.set(bucketKey, (callsMap.get(bucketKey) ?? 0) + 1);
    }

    const data = buckets.map((bucket) => ({
      date: bucket.key,
      revenue: formatDecimal(revenueMap.get(bucket.key) ?? 0),
      calls: callsMap.get(bucket.key) ?? 0,
    }));

    const totalRevenue = data.reduce((sum, entry) => sum + Number(entry.revenue), 0);
    const totalCalls = data.reduce((sum, entry) => sum + entry.calls, 0);

    return {
      data,
      summary: {
        totalRevenue: formatDecimal(totalRevenue),
        totalCalls,
        avgDailyRevenue: formatDecimal(days ? totalRevenue / days : 0),
      },
    };
  }

  async getAgentDistribution(userId: string) {
    const agents = await this.prisma.agent.findMany({
      where: {
        ownerUserId: userId,
      },
      select: {
        id: true,
        name: true,
        iconUrl: true,
        totalRevenue: true,
        totalCalls: true,
        status: true,
      },
    });

    const totalRevenue = agents.reduce((sum, agent) => sum + Number(agent.totalRevenue), 0);

    return {
      data: agents.map((agent) => ({
        agent: {
          id: agent.id,
          name: agent.name,
          iconUrl: agent.iconUrl,
        },
        revenue: formatDecimal(agent.totalRevenue),
        percentage: totalRevenue ? (Number(agent.totalRevenue) / totalRevenue) * 100 : 0,
        calls: agent.totalCalls,
        status: agent.status,
      })),
    };
  }
}
