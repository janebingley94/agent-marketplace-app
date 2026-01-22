import React from 'react';
import { Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';

export type StudioAgent = {
  id: string;
  name: string;
  status: 'active' | 'paused';
  deployedAt: string;
  totalRevenue: string;
  totalCalls: string;
  accent: 'indigo' | 'emerald';
};

const statusStyles: Record<StudioAgent['status'], string> = {
  active: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400',
  paused: 'bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400',
};

const accentStyles: Record<StudioAgent['accent'], string> = {
  indigo: 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400',
  emerald: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400',
};

export function StudioAgentCard({ agent }: { agent: StudioAgent }) {
  return (
    <article
      className={`group relative rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition-all hover:shadow-xl dark:border-slate-700 dark:bg-slate-800 ${
        agent.status === 'active' ? 'border-l-4 border-l-primary' : ''
      }`}
    >
      <div className="absolute right-4 top-4">
        <span
          className={`rounded px-2 py-1 text-[10px] font-bold uppercase ${statusStyles[agent.status]}`}
        >
          {agent.status}
        </span>
      </div>
      <div className="mb-6 flex items-start gap-4">
        <div
          className={`flex h-14 w-14 items-center justify-center rounded-2xl ${
            accentStyles[agent.accent]
          }`}
        >
          ✦
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-900 transition-colors group-hover:text-primary dark:text-slate-100">
            {agent.name}
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Deployed {agent.deployedAt}
          </p>
        </div>
      </div>
      <div className="mb-6 grid grid-cols-2 gap-4 rounded-xl bg-slate-50 p-3 dark:bg-slate-900/50">
        <div>
          <p className="text-[10px] font-bold uppercase text-slate-400">Total Revenue</p>
          <p className="font-bold text-primary">{agent.totalRevenue}</p>
        </div>
        <div>
          <p className="text-[10px] font-bold uppercase text-slate-400">Total Calls</p>
          <p className="font-bold text-slate-900 dark:text-slate-100">{agent.totalCalls}</p>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex -space-x-2">
          <div className="h-6 w-6 rounded-full border border-white bg-slate-200 dark:border-slate-800 dark:bg-slate-600" />
          <div className="h-6 w-6 rounded-full border border-white bg-slate-300 dark:border-slate-800 dark:bg-slate-500" />
        </div>
        <div className="flex gap-2">
          <button className="p-2 text-slate-400 transition-colors hover:text-primary" type="button">
            <Settings className="h-4 w-4" />
          </button>
          <Button
            size="sm"
            className="rounded-xl bg-slate-100 px-4 font-bold text-slate-900 hover:bg-slate-200 dark:bg-slate-700 dark:text-white"
          >
            {agent.status === 'active' ? 'Analytics' : 'Resume'}
          </Button>
        </div>
      </div>
    </article>
  );
}
