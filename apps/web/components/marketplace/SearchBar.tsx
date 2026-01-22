'use client';

import React, { useEffect, useState } from 'react';
import { Search } from 'lucide-react';

import { cn } from '@/lib/utils';

type SearchBarProps = {
  initialValue?: string | null;
  placeholder?: string;
  onSearch: (value: string) => void;
};

export function SearchBar({ initialValue = '', placeholder, onSearch }: SearchBarProps) {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      onSearch((value ?? '').trim());
    }, 400);

    return () => window.clearTimeout(timer);
  }, [value, onSearch]);

  return (
    <div className="relative">
      <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
      <input
        className={cn(
          'w-full rounded-2xl border border-slate-200 bg-white px-12 py-3 text-sm text-slate-900 shadow-sm',
          'focus:outline-none focus:ring-2 focus:ring-primary/30 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100'
        )}
        placeholder={placeholder ?? 'Search agents...'}
        value={value ?? ''}
        onChange={(event) => setValue(event.target.value)}
      />
    </div>
  );
}
