import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import { FilterBar } from '@/components/marketplace/FilterBar';

const onCategoryChange = vi.fn();
const onSortChange = vi.fn();
const onReset = vi.fn();

describe('FilterBar', () => {
  it('fires callbacks on changes', () => {
    render(
      <FilterBar
        category={null}
        sort="createdAt"
        onCategoryChange={onCategoryChange}
        onSortChange={onSortChange}
        onReset={onReset}
      />
    );

    fireEvent.change(screen.getAllByRole('combobox')[0], {
      target: { value: 'Oracle Services' },
    });

    fireEvent.change(screen.getAllByRole('combobox')[1], {
      target: { value: 'totalRevenue' },
    });

    fireEvent.click(screen.getByRole('button', { name: /clear filters/i }));

    expect(onCategoryChange).toHaveBeenCalledWith('Oracle Services');
    expect(onSortChange).toHaveBeenCalledWith('totalRevenue');
    expect(onReset).toHaveBeenCalled();
  });
});
