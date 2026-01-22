import React from 'react';
import {
  Bookmark,
  CheckCircle2,
  Languages,
  LineChart,
  Star,
  Terminal,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { AgentListItem } from '@/lib/agents';

const formatUsd = (value: number) =>
  value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export function AgentCard({ agent }: { agent: AgentListItem }) {
  const totalCalls = agent.totalCalls ?? 0;
  const totalRevenue = Number(agent.totalRevenue ?? 0);
  const avgCallFee = totalCalls > 0 ? totalRevenue / totalCalls : 0;
  const rating = Math.min(5, 4 + (totalCalls % 10) / 10).toFixed(1);
  const initials = agent.name
    .split(' ')
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();
  const category = agent.category ?? 'Productivity';

  const iconMap: Record<string, typeof LineChart> = {
    Oracle: LineChart,
    'Oracle Services': LineChart,
    Analytics: LineChart,
    'Dev Tools': Terminal,
    Productivity: CheckCircle2,
    Utility: Languages,
  };

  const colorMap: Record<string, string> = {
    Oracle: 'bg-indigo-100 text-indigo-600',
    'Oracle Services': 'bg-indigo-100 text-indigo-600',
    Analytics: 'bg-indigo-100 text-indigo-600',
    'Dev Tools': 'bg-emerald-100 text-emerald-600',
    Productivity: 'bg-purple-100 text-purple-600',
    Utility: 'bg-amber-100 text-amber-600',
  };

  const Icon = iconMap[category] ?? LineChart;
  const colorClass = colorMap[category] ?? 'bg-indigo-100 text-indigo-600';

  return (
    <article className="group relative flex h-full flex-col rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl dark:border-slate-700 dark:bg-slate-800">
      <div className="absolute right-4 top-4 text-slate-300 transition-colors group-hover:text-primary">
        <Bookmark className="h-5 w-5" />
      </div>
      <div className="mb-6 flex items-start gap-4">
        <div
          className={`agent-icon flex h-14 w-14 items-center justify-center rounded-2xl ${colorClass} dark:bg-opacity-20`}
        >
          <Icon className="h-7 w-7" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-900 transition-colors group-hover:text-primary dark:text-slate-100">
            {agent.name}
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            by {agent.owner?.name ?? `@${initials}`}
          </p>
          <div className="mt-1 flex items-center gap-1">
            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
            <span className="text-xs font-bold">{rating}</span>
            <span className="text-xs text-slate-400">({totalCalls || 0})</span>
          </div>
        </div>
      </div>
      <p className="mb-6 text-sm text-slate-600 dark:text-slate-300">
        {agent.description ?? 'High-impact agent for mission critical workflows.'}
      </p>
      <div className="mb-6 grid grid-cols-2 gap-4 rounded-xl bg-slate-50 p-3 text-xs dark:bg-slate-900/50">
        <div>
          <p className="text-[10px] font-bold uppercase text-slate-400">Weekly Revenue</p>
          <p className="font-bold text-primary">{formatUsd(totalRevenue)} USDT</p>
        </div>
        <div>
          <p className="text-[10px] font-bold uppercase text-slate-400">Avg. Call Fee</p>
          <p className="font-bold">{formatUsd(avgCallFee)} USDT</p>
        </div>
      </div>
      <div className="mt-auto flex items-center justify-between">
        <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
          {category}
        </span>
        <Button size="sm" className="rounded-xl px-5 font-bold shadow-md hover:shadow-lg">
          View Details
        </Button>
      </div>
    </article>
  );
}
