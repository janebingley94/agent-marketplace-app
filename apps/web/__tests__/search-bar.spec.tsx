import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';

import { SearchBar } from '@/components/marketplace/SearchBar';

describe('SearchBar', () => {
  it('debounces search input', () => {
    vi.useFakeTimers();
    const onSearch = vi.fn();

    render(<SearchBar onSearch={onSearch} initialValue="" />);

    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'agent' } });

    expect(onSearch).not.toHaveBeenCalled();

    vi.advanceTimersByTime(400);

    expect(onSearch).toHaveBeenCalledWith('agent');
    vi.useRealTimers();
  });
});
