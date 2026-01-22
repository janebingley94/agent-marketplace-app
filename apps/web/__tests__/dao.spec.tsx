import React from 'react';
import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import DaoPage from '@/app/dao/page';

vi.mock('@tanstack/react-query', () => ({
  useQuery: () => ({ data: null, isLoading: false, isError: false }),
}));

describe('DaoPage', () => {
  it('renders DAO heading', () => {
    render(<DaoPage />);
    expect(screen.getByText('DAO Dispute Resolution')).toBeInTheDocument();
  });
});
