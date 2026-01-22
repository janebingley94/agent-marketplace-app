import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import { AgentDetail } from '@/components/agent/AgentDetail';

const agent = {
  id: 'agent_1',
  name: 'OracleInsights V4',
  slug: 'oracleinsights-v4',
  description: 'Agent description',
  category: 'Oracle',
  tags: ['oracle'],
  iconUrl: null,
  status: 'PUBLISHED',
  totalCalls: 1200,
  totalRevenue: '12000',
  owner: { id: 'user_1', name: 'ChainNexus', avatarUrl: null },
  plans: [],
  createdAt: '2026-01-21T00:00:00Z',
};

describe('AgentDetail', () => {
  it('renders tabs and triggers tab change', () => {
    const onTabChange = vi.fn();

    render(
      <AgentDetail
        agent={agent}
        rating={4.9}
        reviewCount={120}
        weeklyCallsLabel="12k+ Calls this week"
        capabilities={[]}
        reviews={[]}
        activeTab="overview"
        onTabChange={onTabChange}
      />
    );

    fireEvent.click(screen.getByText('Performance'));
    expect(onTabChange).toHaveBeenCalledWith('performance');
  });
});
