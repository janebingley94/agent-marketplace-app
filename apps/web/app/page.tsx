'use client';

import React, { Suspense, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  parseAsArrayOf,
  parseAsInteger,
  parseAsString,
  useQueryStates,
} from 'nuqs';
import { LayoutGrid, List, Moon } from 'lucide-react';

import { AgentGrid } from '@/components/marketplace/AgentGrid';
import { CategoryTags } from '@/components/marketplace/CategoryTags';
import { FilterBar } from '@/components/marketplace/FilterBar';
import { Leaderboard } from '@/components/marketplace/Leaderboard';
import { SearchBar } from '@/components/marketplace/SearchBar';
import { getAgents, getLeaderboard } from '@/lib/agents';
import { queryKeys } from '@/lib/query-keys';
import { Button } from '@/components/ui/button';

const filtersParser = {
  q: parseAsString,
  category: parseAsString,
  tags: parseAsArrayOf(parseAsString).withDefault([]),
  sort: parseAsString.withDefault('totalRevenue'),
  order: parseAsString.withDefault('desc'),
  page: parseAsInteger.withDefault(1),
  limit: parseAsInteger.withDefault(9),
};

function MarketplaceClient() {
  const [filters, setFilters] = useQueryStates(filtersParser, { history: 'replace' });
  const [isDark, setIsDark] = useState(false);

  const agentQuery = useQuery({
    queryKey: queryKeys.agents.list(filters),
    queryFn: () =>
      getAgents({
        q: filters.q ?? undefined,
        category: filters.category ?? undefined,
        tags: filters.tags,
        sort: filters.sort,
        order: filters.order,
        page: filters.page,
        limit: filters.limit,
      }),
  });

  const leaderboardQuery = useQuery({
    queryKey: queryKeys.agents.leaderboard({ metric: 'revenue', limit: 5 }),
    queryFn: () => getLeaderboard({ metric: 'revenue', limit: 5 }),
  });

  const pagination = agentQuery.data?.pagination;
  const totalPages = pagination?.totalPages ?? 1;
  const currentPage = filters.page ?? 1;

  const selectedTags = useMemo(() => filters.tags ?? [], [filters.tags]);

  const handleToggleTag = (tag: string) => {
    const nextTags = selectedTags.includes(tag)
      ? selectedTags.filter((value) => value !== tag)
      : [...selectedTags, tag];
    setFilters({ tags: nextTags, page: 1 });
  };

  const handleReset = () => {
    setFilters({
      q: null,
      category: null,
      tags: [],
      sort: 'totalRevenue',
      order: 'desc',
      page: 1,
      limit: filters.limit,
    });
  };

  const handleToggleTheme = () => {
    document.documentElement.classList.toggle('dark');
    setIsDark((prev) => !prev);
  };

  const pageButtons = Array.from({ length: Math.min(totalPages, 5) }, (_, index) => index + 1);

  return (
    <main className="min-h-screen bg-background text-slate-900 dark:text-slate-100">
      <header className="fixed inset-x-0 top-0 z-50 h-20 border-b border-slate-200 bg-white/80 px-6 backdrop-blur-md dark:border-slate-700 dark:bg-slate-800/80 lg:px-10">
        <div className="mx-auto flex h-full max-w-7xl items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white">
              ✦
            </div>
            <span className="text-xl font-bold tracking-tight">Aladdin</span>
          </div>
          <nav className="hidden items-center gap-4 md:flex">
            {['Marketplace', 'Agent', 'Wallet', 'Dashboard', 'Bills', 'DAO'].map((item) => (
              <span
                key={item}
                className={
                  item === 'Marketplace'
                    ? 'relative px-4 py-2 font-semibold text-primary after:absolute after:-bottom-5 after:left-0 after:right-0 after:h-0.5 after:bg-primary'
                    : 'px-4 py-2 font-medium text-slate-500 transition-all hover:text-primary dark:text-slate-400 dark:hover:text-primary'
                }
              >
                {item}
              </span>
            ))}
          </nav>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={handleToggleTheme}
              aria-pressed={isDark}
              className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-700"
            >
              <Moon className="h-5 w-5" />
            </button>
            <div className="h-10 w-10 overflow-hidden rounded-full border-2 border-primary/20 bg-slate-200 dark:bg-slate-700" />
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 pb-12 pt-28 lg:px-10">
        <header className="mb-10 flex flex-col gap-6">
          <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
            <div>
              <h1 className="text-3xl font-bold">Explore Agents</h1>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Discover, lease, and integrate the world’s most powerful AI Agents.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                className="rounded-xl border-slate-200 bg-white px-4 py-2 dark:border-slate-700 dark:bg-slate-800"
              >
                Filters
              </Button>
              <div className="flex overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
                <button type="button" className="bg-slate-100 px-3 py-2 dark:bg-slate-700">
                  <LayoutGrid className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  className="px-3 py-2 text-slate-400 transition-colors hover:text-slate-600"
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4 lg:flex-row">
            <div className="relative flex-1">
              <SearchBar
                initialValue={filters.q}
                onSearch={(value) => setFilters({ q: value || null, page: 1 })}
                placeholder="Search by agent name, creator, or keyword..."
              />
            </div>
            <div className="flex gap-4 overflow-x-auto pb-2 lg:pb-0">
              <FilterBar
                category={filters.category ?? null}
                sort={filters.sort}
                onCategoryChange={(value) => setFilters({ category: value, page: 1 })}
                onSortChange={(value) => setFilters({ sort: value, order: 'desc', page: 1 })}
                onReset={handleReset}
              />
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <CategoryTags selected={selectedTags} onToggle={handleToggleTag} />
            <button
              type="button"
              className="text-xs font-medium text-primary hover:underline"
              onClick={handleReset}
            >
              Clear all filters
            </button>
          </div>
        </header>

        <section className="grid gap-8 xl:grid-cols-12">
          <div className="xl:col-span-8">
            <AgentGrid
              agents={agentQuery.data?.data ?? []}
              isLoading={agentQuery.isLoading}
              isError={Boolean(agentQuery.error)}
              onRetry={() => agentQuery.refetch()}
            />
            <div className="mt-12 flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => setFilters({ page: Math.max(currentPage - 1, 1) })}
                disabled={currentPage <= 1}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 transition-colors hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:hover:bg-slate-800"
              >
                ‹
              </button>
              {pageButtons.map((page) => (
                <button
                  key={page}
                  type="button"
                  onClick={() => setFilters({ page })}
                  className={`h-10 w-10 rounded-xl text-sm font-bold ${
                    currentPage === page
                      ? 'bg-primary text-white'
                      : 'border border-slate-200 text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800'
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setFilters({ page: Math.min(currentPage + 1, totalPages) })}
                disabled={currentPage >= totalPages}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 transition-colors hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:hover:bg-slate-800"
              >
                ›
              </button>
            </div>
          </div>
          <aside className="space-y-8 xl:col-span-4">
            <Leaderboard data={leaderboardQuery.data?.data ?? []} />
            <div className="rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 to-transparent p-6">
              <h4 className="mb-2 font-bold">Want to earn?</h4>
              <p className="mb-4 text-sm text-slate-600 dark:text-slate-400">
                Deploy your own agent to the marketplace and start earning protocol rewards and
                fees.
              </p>
              <Button className="w-full rounded-xl font-bold shadow-lg shadow-primary/20">
                Deploy New Agent
              </Button>
            </div>
            <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
              <h4 className="mb-6 text-sm font-bold uppercase tracking-widest text-slate-400">
                Popular Categories
              </h4>
              <div className="space-y-3 text-sm font-medium">
                {['Oracle Services', 'Dev Tools', 'Productivity'].map((item, index) => (
                  <div key={item} className="flex items-center hover:text-primary">
                    <span
                      className={`mr-2 h-2 w-2 rounded-full ${
                        index === 0
                          ? 'bg-blue-400'
                          : index === 1
                            ? 'bg-emerald-400'
                            : 'bg-purple-400'
                      }`}
                    />
                    {item}
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
              <h4 className="mb-6 text-sm font-bold uppercase tracking-widest text-slate-400">
                Popular Tags
              </h4>
              <div className="flex flex-wrap gap-2">
                {['#Solana', '#ETHRollup', '#LLAMA3', '#Privacy', '#Yield', '#Automation'].map(
                  (tag) => (
                    <span
                      key={tag}
                      className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:bg-primary hover:text-white dark:bg-slate-700 dark:text-slate-300"
                    >
                      {tag}
                    </span>
                  )
                )}
              </div>
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}

export default function MarketplacePage() {
  return (
    <Suspense
      fallback={<div className="min-h-screen bg-background px-6 py-12 text-sm text-muted-foreground">Loading marketplace...</div>}
    >
      <MarketplaceClient />
    </Suspense>
  );
}
