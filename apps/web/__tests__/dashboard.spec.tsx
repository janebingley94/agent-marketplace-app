import React from 'react';
import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import DashboardPage from '@/app/dashboard/page';

vi.mock('@tanstack/react-query', () => ({
  useQuery: () => ({ data: null, isLoading: false, isError: false }),
}));

describe('DashboardPage', () => {
  it('renders workflow section', () => {
    render(<DashboardPage />);
    expect(screen.getByText('Agent Workflow')).toBeInTheDocument();
  });
});
