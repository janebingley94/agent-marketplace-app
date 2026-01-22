import React from 'react';
import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import StudioPage from '@/app/studio/page';

vi.mock('@tanstack/react-query', () => ({
  useQuery: () => ({ data: null, isLoading: false, isError: false }),
}));

describe('StudioPage', () => {
  it('renders studio header and cards', () => {
    render(<StudioPage />);

    expect(screen.getByText('My Agents')).toBeInTheDocument();
    expect(screen.getByText('OracleInsights V4')).toBeInTheDocument();
    expect(screen.getByText('Fleet Performance')).toBeInTheDocument();
  });
});
