import React from 'react';
import { render, screen } from '@testing-library/react';
import { Providers } from '@/components/providers';

describe('Providers', () => {
  it('renders children', () => {
    render(
      <Providers>
        <span>Ready</span>
      </Providers>
    );

    expect(screen.getByText('Ready')).toBeInTheDocument();
  });
});
