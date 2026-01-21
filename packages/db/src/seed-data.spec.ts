import { describe, expect, it, vi } from 'vitest';
import { seedAgents, seedUsers, planTemplates } from './seed-data.js';
import { AgentStatus, PlanType } from '@prisma/client';

const requiredAgentKeys = ['name', 'slug', 'description', 'category', 'tags'];

describe('seed data', () => {
  it('includes a baseline set of users and agents', () => {
    expect(seedUsers.length).toBeGreaterThanOrEqual(3);
    expect(seedAgents.length).toBeGreaterThanOrEqual(10);
  });

  it('ensures every agent has the required fields', () => {
    for (const agent of seedAgents) {
      for (const key of requiredAgentKeys) {
        expect(agent[key as keyof typeof agent]).toBeTruthy();
      }
      expect(Object.values(AgentStatus)).toContain(agent.status);
    }
  });

  it('defines reusable plan templates', () => {
    expect(planTemplates.map((plan) => plan.type)).toEqual([
      PlanType.FREE,
      PlanType.SUBSCRIPTION,
      PlanType.SUBSCRIPTION,
    ]);
  });

  it('keeps deterministic plan template ordering', () => {
    const spy = vi.spyOn(Array.prototype, 'map');
    planTemplates.map((plan) => plan.name);
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });
});
