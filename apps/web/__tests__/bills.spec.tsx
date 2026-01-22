import React from 'react';
import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import BillsPage from '@/app/bills/page';

vi.mock('@tanstack/react-query', () => ({
  useQuery: () => ({ data: null, isLoading: false, isError: false }),
}));

describe('BillsPage', () => {
  it('renders billing table', () => {
    render(<BillsPage />);
    expect(screen.getByText('Billing & Transactions')).toBeInTheDocument();
    expect(screen.getByText('Transaction Details')).toBeInTheDocument();
  });
});
