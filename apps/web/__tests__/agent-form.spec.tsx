import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { AgentForm } from '@/components/studio/AgentForm';

describe('AgentForm', () => {
  it('updates preview when typing name', () => {
    render(<AgentForm mode="create" />);

    fireEvent.change(screen.getByPlaceholderText('e.g. DataOracle-V1'), {
      target: { value: 'DataOracle-V1' },
    });

    expect(screen.getByText('DataOracle-V1')).toBeInTheDocument();
  });
});
