import { INestApplication, ValidationPipe, CanActivate, ExecutionContext } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import type { Request } from 'express';
import * as request from 'supertest';

import { AppModule } from '../src/app.module';
import { AuthService } from '../src/auth/auth.service';
import { AgentsService } from '../src/agents/agents.service';
import { JwtAuthGuard } from '../src/auth/jwt-auth.guard';
import { NotFoundException } from '@nestjs/common';

class MockJwtAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest<Request>();
    req.user = { userId: 'user_test' } as Request['user'];
    return true;
  }
}

class MockAuthService {
  async createNonce() {
    return { nonce: 'test-nonce', expiresAt: new Date().toISOString() };
  }

  async verifySignature() {
    return {
      accessToken: 'test-token',
      expiresIn: 3600,
      user: {
        id: 'user_test',
        address: '0xabc',
        name: null,
        avatarUrl: null,
      },
    };
  }

  async getMe(userId: string) {
    return {
      id: userId,
      email: null,
      name: null,
      avatarUrl: null,
      wallets: [],
      createdAt: new Date('2026-01-01T00:00:00Z'),
    };
  }
}

class MockAgentsService {
  private agents: any[] = [];

  async listAgents() {
    return {
      data: this.agents,
      pagination: { page: 1, limit: 20, total: this.agents.length, totalPages: 1 },
    };
  }

  async getAgentBySlug(slug: string) {
    const agent = this.agents.find((item) => item.slug === slug);
    if (!agent) throw new NotFoundException('Agent not found');
    return agent;
  }

  async createAgent(payload: any, userId: string) {
    const id = `agent_${this.agents.length + 1}`;
    const slug = payload.slug ?? payload.name.toLowerCase().replace(/\s+/g, '-');
    const agent = {
      id,
      name: payload.name,
      slug,
      description: payload.description ?? null,
      category: payload.category ?? null,
      tags: payload.tags ?? [],
      iconUrl: payload.iconUrl ?? null,
      status: payload.status ?? 'PUBLISHED',
      totalCalls: 0,
      totalRevenue: '0.00',
      owner: { id: userId, name: null, avatarUrl: null },
      plans: [],
      createdAt: new Date().toISOString(),
    };
    this.agents.push(agent);

    return {
      id: agent.id,
      name: agent.name,
      slug: agent.slug,
      description: agent.description,
      category: agent.category,
      tags: agent.tags,
      iconUrl: agent.iconUrl,
      isPrivate: false,
      status: agent.status,
      createdAt: agent.createdAt,
      updatedAt: agent.createdAt,
    };
  }

  async updateAgent(agentId: string, payload: any) {
    const agent = this.agents.find((item) => item.id === agentId);
    if (!agent) throw new NotFoundException('Agent not found');
    Object.assign(agent, payload);

    return {
      id: agent.id,
      name: agent.name,
      slug: agent.slug,
      description: agent.description,
      category: agent.category,
      tags: agent.tags,
      iconUrl: agent.iconUrl,
      isPrivate: false,
      status: agent.status,
      createdAt: agent.createdAt,
      updatedAt: new Date().toISOString(),
    };
  }

  async deleteAgent(agentId: string) {
    const index = this.agents.findIndex((item) => item.id === agentId);
    if (index === -1) throw new NotFoundException('Agent not found');
    this.agents.splice(index, 1);
    return { success: true };
  }

  async getLeaderboard() {
    return { data: [] };
  }
}

describe('Auth & Agents (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(AuthService)
      .useClass(MockAuthService)
      .overrideProvider(AgentsService)
      .useClass(MockAgentsService)
      .overrideGuard(JwtAuthGuard)
      .useClass(MockJwtAuthGuard)
      .compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      })
    );
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('POST /auth/nonce returns nonce', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/nonce')
      .send({ address: '0xabc', chainId: 1 })
      .expect(201);

    expect(response.body.nonce).toBe('test-nonce');
  });

  it('POST /auth/verify returns access token', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/verify')
      .send({
        message: 'Sign in to Agent Marketplace\nNonce: test-nonce',
        signature: '0xsignature',
        address: '0xabc',
        chainId: 1,
      })
      .expect(201);

    expect(response.body.accessToken).toBe('test-token');
  });

  it('GET /auth/me returns user', async () => {
    const response = await request(app.getHttpServer())
      .get('/auth/me')
      .set('Authorization', 'Bearer test-token')
      .expect(200);

    expect(response.body.id).toBe('user_test');
  });

  it('supports Agents CRUD', async () => {
    const createResponse = await request(app.getHttpServer())
      .post('/agents')
      .set('Authorization', 'Bearer test-token')
      .send({ name: 'Data Analyst', category: 'Analytics', tags: ['data'] })
      .expect(201);

    const agentId = createResponse.body.id;

    const listResponse = await request(app.getHttpServer())
      .get('/agents')
      .expect(200);

    expect(listResponse.body.data).toHaveLength(1);

    const detailResponse = await request(app.getHttpServer())
      .get(`/agents/${createResponse.body.slug}`)
      .expect(200);

    expect(detailResponse.body.id).toBe(agentId);

    const updateResponse = await request(app.getHttpServer())
      .patch(`/agents/${agentId}`)
      .set('Authorization', 'Bearer test-token')
      .send({ name: 'Data Analyst Pro' })
      .expect(200);

    expect(updateResponse.body.name).toBe('Data Analyst Pro');

    await request(app.getHttpServer())
      .delete(`/agents/${agentId}`)
      .set('Authorization', 'Bearer test-token')
      .expect(200);
  });
});
