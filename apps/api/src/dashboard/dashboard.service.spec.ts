import { AgentStatus, BillStatus } from '@prisma/client';
import { DashboardService } from './dashboard.service';
import { PrismaService } from '../database/prisma.service';

const mockPrisma = () => ({
  bill: {
    aggregate: jest.fn(),
    findMany: jest.fn(),
  },
  agent: {
    count: jest.fn(),
    findMany: jest.fn(),
  },
  run: {
    count: jest.fn(),
    findMany: jest.fn(),
  },
});

describe('DashboardService', () => {
  let service: DashboardService;
  let prisma: ReturnType<typeof mockPrisma>;

  beforeEach(() => {
    jest.useFakeTimers().setSystemTime(new Date('2026-01-21T12:00:00Z'));
    prisma = mockPrisma();
    service = new DashboardService(prisma as unknown as PrismaService);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('returns overview metrics with formatted values', async () => {
    prisma.bill.aggregate
      .mockResolvedValueOnce({ _sum: { total: 15000 } })
      .mockResolvedValueOnce({ _sum: { total: 500 } })
      .mockResolvedValueOnce({ _sum: { total: 400 } });
    prisma.agent.count.mockResolvedValue(3);
    prisma.run.count.mockResolvedValueOnce(20).mockResolvedValueOnce(10);

    const result = await service.getOverview('user_1', { range: '7d' });

    expect(prisma.bill.aggregate).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { payeeUserId: 'user_1', status: BillStatus.PAID },
      })
    );
    expect(result.totalBalance).toBe('15000.00');
    expect(result.activeAgents).toBe(3);
    expect(result.revenueChange).toBe('+25.0%');
    expect(result.callsChange).toBe('+100.0%');
  });

  it('builds earnings buckets with defaults', async () => {
    prisma.bill.findMany.mockResolvedValue([
      { createdAt: new Date('2026-01-20T00:00:00Z'), total: 200 },
    ]);
    prisma.run.findMany.mockResolvedValue([
      { startedAt: new Date('2026-01-20T05:00:00Z') },
      { startedAt: new Date('2026-01-20T12:00:00Z') },
    ]);

    const result = await service.getEarnings('user_1', { range: '7d', groupBy: 'day' });

    expect(result.data.length).toBe(7);
    expect(result.summary.totalCalls).toBe(2);
    expect(result.summary.totalRevenue).toBe('200.00');
  });

  it('returns agent distribution percentages', async () => {
    prisma.agent.findMany.mockResolvedValue([
      {
        id: 'agent_1',
        name: 'Agent One',
        iconUrl: null,
        totalRevenue: 200,
        totalCalls: 10,
        status: AgentStatus.PUBLISHED,
      },
      {
        id: 'agent_2',
        name: 'Agent Two',
        iconUrl: null,
        totalRevenue: 800,
        totalCalls: 20,
        status: AgentStatus.PUBLISHED,
      },
    ]);

    const result = await service.getAgentDistribution('user_1');

    expect(result.data[0].percentage).toBeCloseTo(20);
    expect(result.data[1].percentage).toBeCloseTo(80);
  });
});
