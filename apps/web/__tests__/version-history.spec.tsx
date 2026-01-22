import React from 'react';
import { render, screen } from '@testing-library/react';
import { VersionHistory } from '@/components/agent/VersionHistory';

const versions = [
  {
    id: 'v1',
    version: '1.0.0',
    publishedAt: 'Jan 1, 2026',
    notes: 'Initial release.',
  },
];

describe('VersionHistory', () => {
  it('renders version entries', () => {
    render(<VersionHistory versions={versions} />);

    expect(screen.getByText('v1.0.0')).toBeInTheDocument();
    expect(screen.getByText('Initial release.')).toBeInTheDocument();
  });
});
