import { Brain, PlugZap, ShieldCheck, TrendingDown, TrendingUp, Trophy } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { LeaderboardItem } from '@/lib/agents';

export function Leaderboard({ data }: { data: LeaderboardItem[] }) {
  const deltas = ['+12%', '+5%', '-2%'];
  const icons = [Brain, ShieldCheck, PlugZap];

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
      <div className="flex items-center gap-2 text-lg font-bold text-slate-900 dark:text-slate-100">
        <Trophy className="h-5 w-5 text-primary" />
        Leaderboard
      </div>
      <div className="mt-6 space-y-6">
        {data.slice(0, 3).map((item, index) => {
          const Icon = icons[index] ?? Brain;
          const delta = deltas[index] ?? '+0%';
          const isDown = delta.startsWith('-');
          return (
            <div key={item.agent.id} className="flex items-center gap-4 group">
              <div className="relative">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-primary dark:bg-slate-700">
                  <Icon className="h-5 w-5" />
                </div>
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white">
                  {index + 1}
                </span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-slate-900 transition-colors group-hover:text-primary dark:text-slate-100">
                  {item.agent.name}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Revenue: {item.revenue} USDT
                </p>
              </div>
              <span
                className={cn(
                  'flex items-center gap-1 text-xs font-bold',
                  isDown ? 'text-rose-500' : 'text-emerald-500'
                )}
              >
                {isDown ? <TrendingDown className="h-4 w-4" /> : <TrendingUp className="h-4 w-4" />}
                {delta.replace('-', '')}
              </span>
            </div>
          );
        })}
      </div>
      <button
        type="button"
        className="mt-6 w-full rounded-xl border border-slate-200 py-3 text-sm font-bold hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-700"
      >
        View Full Leaderboard
      </button>
    </div>
  );
}
