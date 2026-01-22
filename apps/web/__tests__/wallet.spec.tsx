import React from 'react';
import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import WalletPage from '@/app/wallet/page';

vi.mock('@tanstack/react-query', () => ({
  useQuery: () => ({ data: null, isLoading: false, isError: false }),
}));

describe('WalletPage', () => {
  it('renders wallet summary', () => {
    render(<WalletPage />);
    expect(screen.getByText('Total Balance')).toBeInTheDocument();
    expect(screen.getByText('Earnings Overview')).toBeInTheDocument();
  });
});
