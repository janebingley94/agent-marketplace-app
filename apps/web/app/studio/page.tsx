'use client';

import React, { useState } from 'react';
import { Moon, Plus } from 'lucide-react';

import { StudioAgentCard, type StudioAgent } from '@/components/studio/StudioAgentCard';
import { FleetPerformanceCard } from '@/components/studio/FleetPerformanceCard';
import { DeveloperApiCard } from '@/components/studio/DeveloperApiCard';
import { RecentActivity } from '@/components/studio/RecentActivity';

const agents: StudioAgent[] = [
  {
    id: 'agent-1',
    name: 'OracleInsights V4',
    status: 'active',
    deployedAt: '12 days ago',
    totalRevenue: '12,450 USDT',
    totalCalls: '28,412',
    accent: 'indigo',
  },
  {
    id: 'agent-2',
    name: 'CodeWhisper DAO',
    status: 'paused',
    deployedAt: '2 months ago',
    totalRevenue: '8,120 USDT',
    totalCalls: '1,624',
    accent: 'emerald',
  },
];

export default function StudioPage() {
  const [isDark, setIsDark] = useState(false);

  const handleToggleTheme = () => {
    document.documentElement.classList.toggle('dark');
    setIsDark((prev) => !prev);
  };

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
                  item === 'Agent'
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
        <header className="mb-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold">My Agents</h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Manage, monitor, and optimize your deployed AI Agent fleet.
            </p>
          </div>
          <button className="flex items-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-primary/20">
            <Plus className="h-4 w-4" /> Deploy New Agent
          </button>
        </header>

        <div className="grid grid-cols-1 gap-8 xl:grid-cols-12">
          <div className="xl:col-span-8">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {agents.map((agent) => (
                <StudioAgentCard key={agent.id} agent={agent} />
              ))}
            </div>

            <div className="mt-8 flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 px-6 py-10 text-center dark:border-slate-700">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
                <Plus className="h-6 w-6 text-slate-400" />
              </div>
              <h3 className="text-lg font-bold">Scale your fleet</h3>
              <p className="mb-6 mt-1 max-w-xs text-sm text-slate-500">
                You have 8 empty slots remaining in your current tier. Deploy more agents to
                maximize revenue.
              </p>
              <button className="text-sm font-bold text-primary hover:underline" type="button">
                Compare Subscription Plans
              </button>
            </div>
          </div>
          <aside className="space-y-8 xl:col-span-4">
            <FleetPerformanceCard />
            <DeveloperApiCard />
            <RecentActivity />
          </aside>
        </div>
      </div>
    </main>
  );
}
