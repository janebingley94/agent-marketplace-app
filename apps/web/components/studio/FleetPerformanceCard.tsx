import React from 'react';
import { TrendingUp } from 'lucide-react';

export function FleetPerformanceCard() {
  return (
    <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
      <h3 className="mb-6 flex items-center gap-2 text-lg font-bold">
        <TrendingUp className="h-5 w-5 text-primary" /> Fleet Performance
      </h3>
      <div className="space-y-4">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs font-bold uppercase text-slate-400">Daily Inquiries</p>
            <p className="text-2xl font-bold">14.2k</p>
          </div>
          <span className="flex items-center text-xs font-bold text-emerald-500">
            <TrendingUp className="mr-1 h-4 w-4" /> +18%
          </span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700">
          <div className="h-full w-[65%] bg-primary" />
        </div>
        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs font-bold uppercase text-slate-400">Uptime Avg</p>
            <p className="text-2xl font-bold">99.98%</p>
          </div>
          <span className="text-xs font-bold text-emerald-500">Stable</span>
        </div>
      </div>
    </section>
  );
}
