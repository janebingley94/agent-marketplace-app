'use client';

import React from 'react';

import { Button } from '@/components/ui/button';

type FilterBarProps = {
  category: string | null;
  sort: string;
  onCategoryChange: (value: string | null) => void;
  onSortChange: (value: string) => void;
  onReset: () => void;
};

const sortOptions = [
  { value: 'totalRevenue', label: 'Sort: Trending' },
  { value: 'createdAt', label: 'Sort: Newest' },
  { value: 'totalCalls', label: 'Sort: Most Used' },
];

export function FilterBar({
  category,
  sort,
  onCategoryChange,
  onSortChange,
  onReset,
}: FilterBarProps) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <select
        className="min-w-[140px] rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-primary focus:ring-primary dark:border-slate-700 dark:bg-slate-800"
        value={category ?? ''}
        onChange={(event) => onCategoryChange(event.target.value || null)}
      >
        <option value="">All Categories</option>
        <option value="Oracle Services">Oracle Services</option>
        <option value="Dev Tools">Dev Tools</option>
        <option value="Productivity">Productivity</option>
        <option value="Security">Security</option>
      </select>
      <select
        className="min-w-[140px] rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-primary focus:ring-primary dark:border-slate-700 dark:bg-slate-800"
        value={sort}
        onChange={(event) => onSortChange(event.target.value)}
      >
        {sortOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <Button variant="outline" size="sm" className="rounded-2xl" onClick={onReset}>
        Clear filters
      </Button>
    </div>
  );
}
