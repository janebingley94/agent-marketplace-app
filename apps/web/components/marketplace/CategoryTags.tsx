'use client';

import React from 'react';
import { X } from 'lucide-react';

import { cn } from '@/lib/utils';

const DEFAULT_TAGS = ['LLM Integration', 'Open-Source'];

type CategoryTagsProps = {
  selected: string[];
  onToggle: (tag: string) => void;
};

export function CategoryTags({ selected, onToggle }: CategoryTagsProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {DEFAULT_TAGS.map((tag) => {
        const isActive = selected.includes(tag);
        return (
          <button
            key={tag}
            type="button"
            onClick={() => onToggle(tag)}
            className={cn(
              'flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-semibold transition',
              isActive
                ? 'border-primary/20 bg-primary/10 text-primary'
                : 'border-slate-200 bg-slate-100 text-slate-500 hover:border-primary/30 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400'
            )}
          >
            {tag}
            {isActive ? <X className="h-3 w-3" /> : null}
          </button>
        );
      })}
    </div>
  );
}
