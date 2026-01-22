import React from 'react';
import { render, screen } from '@testing-library/react';
import { AgentCard } from '@/components/marketplace/AgentCard';

const agent = {
  id: 'agent_1',
  name: 'Data Analyst',
  slug: 'data-analyst',
  description: 'AI-powered data analysis',
  category: 'Analytics',
  tags: ['data', 'analysis'],
  iconUrl: null,
  status: 'PUBLISHED',
  totalCalls: 120,
  totalRevenue: '1200.00',
  owner: { id: 'user_1', name: 'Alice', avatarUrl: null },
  plans: [{ id: 'plan_1', type: 'SUBSCRIPTION', name: 'Pro', price: '29.00', period: 'month' }],
  createdAt: '2026-01-21T00:00:00Z',
};

describe('AgentCard', () => {
  it('renders agent name and plan', () => {
    render(<AgentCard agent={agent} />);

    expect(screen.getByText('Data Analyst')).toBeInTheDocument();
    expect(screen.getByText('View Details')).toBeInTheDocument();
    expect(screen.getByText(/Weekly Revenue/i)).toBeInTheDocument();
  });
});
