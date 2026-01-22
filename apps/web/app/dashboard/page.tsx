'use client';

import React, { useState } from 'react';
import { Moon, Plus, Zap } from 'lucide-react';

const statusCards = [
  { label: 'Contracting', name: 'Agent A', color: 'bg-orange-100 text-orange-600', value: '52%' },
  { label: 'Active', name: 'WeatherAgent', color: 'bg-emerald-100 text-emerald-600', value: '75%' },
  { label: 'Disputed', name: 'Agent C', color: 'bg-red-100 text-red-600', value: '12%' },
];

export default function DashboardPage() {
  const [isDark, setIsDark] = useState(false);

  return (
    <main className="min-h-screen bg-background text-slate-900 dark:text-slate-100">
      <header className="sticky top-0 z-50 h-20 border-b border-slate-200 bg-white/80 px-6 backdrop-blur-md dark:border-slate-700 dark:bg-slate-800/80 lg:px-10">
        <div className="mx-auto flex h-full max-w-7xl items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white">✦</div>
            <span className="text-xl font-bold tracking-tight">Aladdin Protocol</span>
          </div>
          <nav className="hidden items-center gap-6 md:flex">
            {['Marketplace', 'Agent', 'Wallet', 'Dashboard', 'Bills', 'DAO'].map((item) => (
              <span
                key={item}
                className={
                  item === 'Dashboard'
                    ? 'relative px-4 py-2 font-semibold text-primary after:absolute after:-bottom-5 after:left-0 after:right-0 after:h-0.5 after:bg-primary'
                    : 'px-4 py-2 font-medium text-slate-500 transition-all hover:text-primary dark:text-slate-400'
                }
              >
                {item}
              </span>
            ))}
          </nav>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => {
                document.documentElement.classList.toggle('dark');
                setIsDark((prev) => !prev);
              }}
              aria-pressed={isDark}
              className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-700"
            >
              <Moon className="h-5 w-5" />
            </button>
            <div className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-500 dark:border-slate-700 dark:text-slate-300">
              0x71...4F2d
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 pb-12 pt-8 lg:px-10">
        <div className="grid gap-4 md:grid-cols-3">
          {statusCards.map((card) => (
            <div
              key={card.label}
              className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800"
            >
              <div className="flex items-center gap-3">
                <span className={`rounded-full px-2 py-1 text-xs font-bold ${card.color}`}>
                  {card.label}
                </span>
                <span className="text-sm font-semibold">{card.name}</span>
              </div>
              <div className="mt-4 h-1 w-full rounded-full bg-slate-100 dark:bg-slate-700">
                <div className="h-full w-1/2 rounded-full bg-primary" />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-12">
          <section className="lg:col-span-8">
            <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold">Agent Workflow</h3>
                </div>
                <button className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-500">
                  <Plus className="h-3 w-3" /> Add Agent
                </button>
              </div>
              <div className="mt-6 h-[520px] rounded-2xl border border-dashed border-slate-200 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] bg-[length:24px_24px] dark:border-slate-700" />
            </div>
          </section>

          <aside className="lg:col-span-4">
            <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/10" />
                <div>
                  <p className="text-sm font-semibold">Aladdin Workflow</p>
                  <p className="text-xs text-slate-400">System Online</p>
                </div>
              </div>
              <div className="mt-6 space-y-4 text-sm">
                <div className="rounded-xl bg-slate-100 p-3 text-slate-600 dark:bg-slate-900/50">
                  Hello! I am your entry agent. Shall I trigger the Weather Agent for you?
                </div>
                <div className="rounded-xl bg-primary/10 p-3 text-primary">
                  Yes, please. I’m planning a trip for tomorrow.
                </div>
                <div className="rounded-xl bg-slate-100 p-3 text-slate-600 dark:bg-slate-900/50">
                  Weather Agent calling... forecast shows light rain with a high of 18°C.
                </div>
              </div>
              <div className="mt-6 flex items-center gap-2 rounded-2xl border border-slate-200 px-4 py-3 text-xs text-slate-400 dark:border-slate-700">
                <span className="h-6 w-6 rounded-full bg-slate-100 dark:bg-slate-700" />
                Type a message...
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
