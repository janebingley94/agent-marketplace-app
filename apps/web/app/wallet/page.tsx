'use client';

import React, { useState } from 'react';
import { CalendarDays, ChevronDown, Moon, Plus, Wallet } from 'lucide-react';
import { Button } from '@/components/ui/button';

const summaryCards = [
  {
    label: 'Total Balance',
    value: '$42,905.12',
    caption: '+12.5% from last month',
    icon: Wallet,
  },
  {
    label: 'Daily Revenue',
    value: '$1,280.40',
    caption: 'Expected by 11:59 PM',
    icon: CalendarDays,
  },
  {
    label: 'Active Agents',
    value: '14',
    caption: '2 currently in dispute',
    icon: Plus,
  },
  {
    label: 'Staked Assets',
    value: '12,500 ALD',
    caption: 'APY: 8.4%',
    icon: Wallet,
  },
];

const agentIncome = [
  {
    name: 'Agent A (Contract-based)',
    role: 'Arbitrage Trading Specialist',
    value: '$840.00',
    status: 'Disputing',
    color: 'bg-red-100 text-red-600',
  },
  {
    name: 'Agent B (Algorithm-Enhanced)',
    role: 'Liquidity Provision Bot',
    value: '$1,420.50',
    status: 'Settled',
    color: 'bg-emerald-100 text-emerald-600',
  },
  {
    name: 'Agent C (Multi-Chain)',
    role: 'Yield Aggregator',
    value: '$310.20',
    status: 'Pending',
    color: 'bg-indigo-100 text-indigo-600',
  },
];

export default function WalletPage() {
  const [isDark, setIsDark] = useState(false);

  return (
    <main className="min-h-screen bg-background text-slate-900 dark:text-slate-100">
      <header className="sticky top-0 z-50 h-20 border-b border-slate-200 bg-white/80 px-6 backdrop-blur-md dark:border-slate-700 dark:bg-slate-800/80 lg:px-10">
        <div className="mx-auto flex h-full max-w-7xl items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white">
              ✦
            </div>
            <span className="text-xl font-bold tracking-tight">Aladdin Protocol</span>
          </div>
          <nav className="hidden items-center gap-6 md:flex">
            {['Agent', 'Wallet', 'Dashboard', 'Bills', 'DAO'].map((item) => (
              <span
                key={item}
                className={
                  item === 'Wallet'
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
              0x71...3f2b
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 pb-12 pt-8 lg:px-10">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {summaryCards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.label}
                className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800"
              >
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold text-slate-400">{card.label}</p>
                  <Icon className="h-4 w-4 text-primary" />
                </div>
                <p className="mt-2 text-lg font-bold">{card.value}</p>
                <p className="mt-1 text-xs text-slate-400">{card.caption}</p>
              </div>
            );
          })}
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Earnings Overview</h3>
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
                  <span className="rounded-full bg-slate-100 px-2 py-1 text-primary dark:bg-slate-700">30D</span>
                  <span className="px-2">7D</span>
                  <span className="px-2">1Y</span>
                </div>
              </div>
              <div className="mt-6 h-40 rounded-2xl bg-gradient-to-br from-primary/10 to-transparent" />
            </div>

            <div className="mt-6 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
              <h3 className="mb-4 font-semibold">Agent Income Stats</h3>
              <div className="space-y-3">
                {agentIncome.map((agent) => (
                  <div
                    key={agent.name}
                    className="flex items-center justify-between rounded-xl bg-slate-50 p-4 dark:bg-slate-900/40"
                  >
                    <div>
                      <p className="text-sm font-semibold">{agent.name}</p>
                      <p className="text-xs text-slate-400">{agent.role}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold">{agent.value}</p>
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${agent.color}`}>
                        {agent.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6 lg:col-span-4">
            <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Daily Revenue Date</h3>
                <ChevronDown className="h-4 w-4 text-slate-400" />
              </div>
              <div className="mt-4 rounded-xl bg-slate-50 p-4 text-xs text-slate-400 dark:bg-slate-900/40">
                December 2025 calendar placeholder
              </div>
              <div className="mt-4 flex gap-3">
                <Button variant="outline" className="flex-1 rounded-xl">
                  Cancel
                </Button>
                <Button className="flex-1 rounded-xl">OK</Button>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
              <h3 className="font-semibold">Revenue Distribution</h3>
              <div className="mt-6 flex items-center gap-4">
                <div className="h-20 w-20 rounded-full bg-[conic-gradient(#6366f1_0_120deg,#22c55e_120deg_280deg,#e5e7eb_280deg_360deg)]" />
                <div className="text-sm">
                  <p className="font-semibold">Total</p>
                  <p className="text-lg font-bold">$2.5k</p>
                </div>
              </div>
              <div className="mt-4 space-y-2 text-xs text-slate-400">
                <div className="flex justify-between">
                  <span>Agent A</span>
                  <span>33%</span>
                </div>
                <div className="flex justify-between">
                  <span>Agent B</span>
                  <span>55%</span>
                </div>
                <div className="flex justify-between">
                  <span>Agent C</span>
                  <span>12%</span>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button className="flex-1 rounded-xl">Withdraw</Button>
              <Button variant="outline" className="flex-1 rounded-xl">
                History
              </Button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
