import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { AgentStatus, Prisma } from '@prisma/client';
import { PrismaService } from '../database/prisma.service';
import { generateSlug } from '@agent-marketplace/shared';
import { AgentQueryDto } from './dto/agent-query.dto';
import { CreateAgentDto } from './dto/create-agent.dto';
import { UpdateAgentDto } from './dto/update-agent.dto';
import { LeaderboardQueryDto } from './dto/leaderboard-query.dto';

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 20;
const DEFAULT_SORT = 'createdAt';
const DEFAULT_ORDER: 'asc' | 'desc' = 'desc';
const ALLOWED_SORT_FIELDS = ['createdAt', 'totalRevenue', 'totalCalls'];

type AgentOwnerSummary = {
  id: string;
  name: string | null;
  avatarUrl: string | null;
};

type AgentPlanSummary = {
  id: string;
  type: string;
  name: string;
  price: string;
  period: string | null;
};

type AgentListItem = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  category: string | null;
  tags: string[];
  iconUrl: string | null;
  status: AgentStatus;
  totalCalls: number;
  totalRevenue: string;
  owner: AgentOwnerSummary;
  plans: AgentPlanSummary[];
  createdAt: string;
};

type AgentListResponse = {
  data: AgentListItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

type AgentDetailResponse = AgentListItem;

type AgentMutationResponse = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  category: string | null;
  tags: string[];
  iconUrl: string | null;
  isPrivate: boolean;
  status: AgentStatus;
  createdAt: string;
  updatedAt: string;
};

type LeaderboardItem = {
  agent: {
    id: string;
    name: string;
    iconUrl: string | null;
  };
  revenue: string;
  calls: number;
  percentage: number;
  status: AgentStatus;
};

type LeaderboardResponse = {
  data: LeaderboardItem[];
};

const formatDecimal = (value: Prisma.Decimal | number): string => {
  if (typeof value === 'number') return value.toFixed(2);
  return value.toString();
};

@Injectable()
export class AgentsService {
  constructor(private readonly prisma: PrismaService) {}

  async listAgents(query: AgentQueryDto): Promise<AgentListResponse> {
    const page = query.page ?? DEFAULT_PAGE;
    const limit = query.limit ?? DEFAULT_LIMIT;
    const sort = ALLOWED_SORT_FIELDS.includes(query.sort ?? '') ? query.sort : DEFAULT_SORT;
    const order = query.order ?? DEFAULT_ORDER;
    const orderBy: Prisma.AgentOrderByWithRelationInput = {
      [sort as string]: order,
    };

    const where: Record<string, unknown> = {};

    if (query.status) {
      where.status = query.status;
    } else {
      where.status = AgentStatus.PUBLISHED;
    }

    if (query.category) {
      where.category = query.category;
    }

    if (query.tags && query.tags.length > 0) {
      where.tags = { hasSome: query.tags };
    }

    if (query.q) {
      where.OR = [
        { name: { contains: query.q, mode: 'insensitive' } },
        { description: { contains: query.q, mode: 'insensitive' } },
      ];
    }

    const [total, agents] = await Promise.all([
      this.prisma.agent.count({ where }),
      this.prisma.agent.findMany({
        where,
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
        include: {
          owner: {
            select: {
              id: true,
              name: true,
              avatarUrl: true,
            },
          },
          plans: {
            select: {
              id: true,
              type: true,
              name: true,
              price: true,
              period: true,
            },
          },
        },
      }),
    ]);

    return {
      data: agents.map((agent) => ({
        id: agent.id,
        name: agent.name,
        slug: agent.slug,
        description: agent.description,
        category: agent.category,
        tags: agent.tags,
        iconUrl: agent.iconUrl,
        status: agent.status,
        totalCalls: agent.totalCalls,
        totalRevenue: formatDecimal(agent.totalRevenue),
        owner: agent.owner,
        plans: agent.plans.map((plan) => ({
          id: plan.id,
          type: plan.type,
          name: plan.name,
          price: formatDecimal(plan.price),
          period: plan.period ?? null,
        })),
        createdAt: agent.createdAt.toISOString(),
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getAgentBySlug(slug: string): Promise<AgentDetailResponse> {
    const agent = await this.prisma.agent.findFirst({
      where: {
        slug,
        status: AgentStatus.PUBLISHED,
      },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
          },
        },
        plans: {
          where: {
            isActive: true,
          },
          select: {
            id: true,
            type: true,
            name: true,
            price: true,
            period: true,
          },
        },
      },
    });

    if (!agent) {
      throw new NotFoundException('Agent not found');
    }

    return {
      id: agent.id,
      name: agent.name,
      slug: agent.slug,
      description: agent.description,
      category: agent.category,
      tags: agent.tags,
      iconUrl: agent.iconUrl,
      status: agent.status,
      totalCalls: agent.totalCalls,
      totalRevenue: formatDecimal(agent.totalRevenue),
      owner: agent.owner,
      plans: agent.plans.map((plan) => ({
        id: plan.id,
        type: plan.type,
        name: plan.name,
        price: formatDecimal(plan.price),
        period: plan.period ?? null,
      })),
      createdAt: agent.createdAt.toISOString(),
    };
  }

  async createAgent(payload: CreateAgentDto, userId: string): Promise<AgentMutationResponse> {
    const slug = (payload.slug ?? generateSlug(payload.name)).toLowerCase();

    if (!slug) {
      throw new BadRequestException('Slug is required');
    }

    const agent = await this.prisma.agent.create({
      data: {
        ownerUserId: userId,
        name: payload.name,
        slug,
        description: payload.description,
        category: payload.category,
        tags: payload.tags ?? [],
        iconUrl: payload.iconUrl,
        isPrivate: payload.isPrivate ?? false,
        status: payload.status ?? AgentStatus.DRAFT,
      },
    });

    return {
      id: agent.id,
      name: agent.name,
      slug: agent.slug,
      description: agent.description,
      category: agent.category,
      tags: agent.tags,
      iconUrl: agent.iconUrl,
      isPrivate: agent.isPrivate,
      status: agent.status,
      createdAt: agent.createdAt.toISOString(),
      updatedAt: agent.updatedAt.toISOString(),
    };
  }

  async updateAgent(
    agentId: string,
    payload: UpdateAgentDto,
    userId: string
  ): Promise<AgentMutationResponse> {
    const agent = await this.prisma.agent.findUnique({
      where: { id: agentId },
    });

    if (!agent) {
      throw new NotFoundException('Agent not found');
    }

    if (agent.ownerUserId !== userId) {
      throw new ForbiddenException('Permission denied');
    }

    const slug = payload.slug ? payload.slug.toLowerCase() : undefined;

    const updated = await this.prisma.agent.update({
      where: { id: agentId },
      data: {
        name: payload.name,
        slug,
        description: payload.description,
        category: payload.category,
        tags: payload.tags,
        iconUrl: payload.iconUrl,
        isPrivate: payload.isPrivate,
        status: payload.status,
      },
    });

    return {
      id: updated.id,
      name: updated.name,
      slug: updated.slug,
      description: updated.description,
      category: updated.category,
      tags: updated.tags,
      iconUrl: updated.iconUrl,
      isPrivate: updated.isPrivate,
      status: updated.status,
      createdAt: updated.createdAt.toISOString(),
      updatedAt: updated.updatedAt.toISOString(),
    };
  }

  async deleteAgent(agentId: string, userId: string): Promise<{ success: true }> {
    const agent = await this.prisma.agent.findUnique({
      where: { id: agentId },
    });

    if (!agent) {
      throw new NotFoundException('Agent not found');
    }

    if (agent.ownerUserId !== userId) {
      throw new ForbiddenException('Permission denied');
    }

    await this.prisma.agent.delete({
      where: { id: agentId },
    });

    return { success: true };
  }

  async getLeaderboard(query: LeaderboardQueryDto): Promise<LeaderboardResponse> {
    const metric = query.metric ?? 'revenue';
    const limit = query.limit ?? 10;
    const orderBy: Prisma.AgentOrderByWithRelationInput =
      metric === 'revenue'
        ? { totalRevenue: Prisma.SortOrder.desc }
        : { totalCalls: Prisma.SortOrder.desc };

    const aggregate = await this.prisma.agent.aggregate({
      where: {
        status: AgentStatus.PUBLISHED,
      },
      _sum: {
        totalRevenue: true,
        totalCalls: true,
      },
    });

    const totalValue =
      metric === 'revenue'
        ? Number(aggregate._sum.totalRevenue ?? 0)
        : Number(aggregate._sum.totalCalls ?? 0);

    const agents = await this.prisma.agent.findMany({
      where: {
        status: AgentStatus.PUBLISHED,
      },
      orderBy,
      take: limit,
      select: {
        id: true,
        name: true,
        iconUrl: true,
        totalRevenue: true,
        totalCalls: true,
        status: true,
      },
    });

    return {
      data: agents.map((agent) => ({
        agent: {
          id: agent.id,
          name: agent.name,
          iconUrl: agent.iconUrl,
        },
        revenue: formatDecimal(agent.totalRevenue),
        calls: agent.totalCalls,
        percentage: totalValue
          ? Number(
              metric === 'revenue'
                ? (Number(agent.totalRevenue) / totalValue) * 100
                : (Number(agent.totalCalls) / totalValue) * 100
            )
          : 0,
        status: agent.status,
      })),
    };
  }
}
