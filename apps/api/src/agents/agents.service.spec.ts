import { AgentStatus } from '@prisma/client';
import { AgentsService } from './agents.service';
import { PrismaService } from '../database/prisma.service';

const mockPrisma = () => ({
  agent: {
    count: jest.fn(),
    findMany: jest.fn(),
    findFirst: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
});

describe('AgentsService', () => {
  let service: AgentsService;
  let prisma: ReturnType<typeof mockPrisma>;

  beforeEach(() => {
    prisma = mockPrisma();
    service = new AgentsService(prisma as unknown as PrismaService);
  });

  it('defaults list filters to published and paginated response', async () => {
    prisma.agent.count.mockResolvedValue(1);
    prisma.agent.findMany.mockResolvedValue([
      {
        id: 'agent_1',
        name: 'Agent One',
        slug: 'agent-one',
        description: null,
        category: null,
        tags: [],
        iconUrl: null,
        status: AgentStatus.PUBLISHED,
        totalCalls: 0,
        totalRevenue: 0,
        owner: { id: 'user_1', name: null, avatarUrl: null },
        plans: [],
        createdAt: new Date('2026-01-21T00:00:00Z'),
      },
    ]);

    const result = await service.listAgents({});

    expect(prisma.agent.count).toHaveBeenCalledWith({
      where: { status: AgentStatus.PUBLISHED },
    });
    expect(result.pagination.total).toBe(1);
  });

  it('creates agent with generated slug and owner', async () => {
    prisma.agent.create.mockResolvedValue({
      id: 'agent_1',
      name: 'My Agent',
      slug: 'my-agent',
      description: null,
      category: null,
      tags: [],
      iconUrl: null,
      isPrivate: false,
      status: AgentStatus.DRAFT,
      createdAt: new Date('2026-01-21T00:00:00Z'),
      updatedAt: new Date('2026-01-21T00:00:00Z'),
    });

    const result = await service.createAgent(
      {
        name: 'My Agent',
      },
      'user_1'
    );

    expect(prisma.agent.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          ownerUserId: 'user_1',
          slug: 'my-agent',
        }),
      })
    );
    expect(result).toEqual(
      expect.objectContaining({
        id: 'agent_1',
        slug: 'my-agent',
        status: AgentStatus.DRAFT,
      })
    );
  });
});
