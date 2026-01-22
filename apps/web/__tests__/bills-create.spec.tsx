import React from 'react';
import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import CreateInvoicePage from '@/app/bills/create/page';

vi.mock('@tanstack/react-query', () => ({
  useQuery: () => ({ data: null, isLoading: false, isError: false }),
}));

describe('CreateInvoicePage', () => {
  it('renders create invoice heading', () => {
    render(<CreateInvoicePage />);
    expect(screen.getByText('Create Service Invoice')).toBeInTheDocument();
  });
});
