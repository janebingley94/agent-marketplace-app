'use client';

import React, { useState } from 'react';
import { Moon, Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const stats = [
  { label: 'Total Disputes', value: '3', accent: 'bg-purple-100 text-purple-600' },
  { label: 'Active Voting', value: '1', accent: 'bg-blue-100 text-blue-600' },
  { label: 'Resolved', value: '1', accent: 'bg-emerald-100 text-emerald-600' },
  { label: 'My Tokens', value: '1500', accent: 'bg-slate-100 text-slate-600' },
];

const disputes = [
  {
    title: 'AI Data Analysis Report Generation',
    type: 'Quality',
    status: 'Voting',
    amount: '$500',
    agent: 'DataMaster AI',
    evidence: '2 Evidence',
    progress: '7/10',
    reward: '50',
  },
  {
    title: 'Smart Contract Code Audit',
    type: 'Deadline',
    status: 'Pending',
    amount: '$1200',
    agent: 'SecurityBot Pro',
    evidence: '2 Evidence',
    progress: 'Pending',
    reward: '120',
  },
  {
    title: 'Marketing Strategy Development',
    type: 'Scope',
    status: 'Resolved',
    amount: '$800',
    agent: 'MarketingGuru',
    evidence: '4 Evidence',
    progress: 'Resolved',
    reward: '80',
  },
];

export default function DaoPage() {
  const [isDark, setIsDark] = useState(false);
  const [showModal, setShowModal] = useState(false);

  return (
    <main className="min-h-screen bg-background text-slate-900 dark:text-slate-100">
      <header className="sticky top-0 z-50 h-20 border-b border-slate-200 bg-white/80 px-6 backdrop-blur-md dark:border-slate-700 dark:bg-slate-800/80 lg:px-10">
        <div className="mx-auto flex h-full max-w-7xl items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white">✦</div>
            <span className="text-xl font-bold tracking-tight">ALADDINPROTOCOL</span>
          </div>
          <nav className="hidden items-center gap-6 md:flex">
            {['Marketplace', 'Agent', 'Wallet', 'Dashboard', 'Bills', 'DAO'].map((item) => (
              <span
                key={item}
                className={
                  item === 'DAO'
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
              0x71C...492
            </div>
          </div>
        </div>
      </header>

      <div className="bg-primary py-16 text-white">
        <div className="mx-auto max-w-7xl px-6 text-center lg:px-10">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-white/10">⚖️</div>
          <h1 className="mt-4 text-3xl font-bold">DAO Dispute Resolution</h1>
          <p className="mt-2 text-sm text-white/70">
            Fair, Transparent, Decentralized Dispute Resolution for the AI Marketplace.
          </p>
          <div className="mt-6 inline-flex items-center gap-3 rounded-full bg-white/10 px-4 py-2 text-xs font-semibold">
            <span>1500 LALAMPA</span>
            <span className="rounded-full bg-emerald-400 px-2 py-0.5 text-[10px] text-white">
              Eligible to Vote
            </span>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 pb-12 pt-8 lg:px-10">
        <div className="grid gap-4 md:grid-cols-4">
          {stats.map((item) => (
            <div
              key={item.label}
              className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800"
            >
              <p className="text-xs text-slate-400">{item.label}</p>
              <div className="mt-2 flex items-center justify-between">
                <p className="text-xl font-bold">{item.value}</p>
                <span className={`rounded-full px-2 py-1 text-xs font-semibold ${item.accent}`}>●</span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-3 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm dark:border-slate-700 dark:bg-slate-800">
            <Search className="h-4 w-4 text-slate-400" />
            Search dispute cases...
          </div>
          <select className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm dark:border-slate-700 dark:bg-slate-800">
            <option>All Status</option>
          </select>
          <select className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm dark:border-slate-700 dark:bg-slate-800">
            <option>All Types</option>
          </select>
          <Button className="ml-auto rounded-full" onClick={() => setShowModal(true)}>
            Create Proposal
          </Button>
        </div>

        <section className="mt-6 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold">Dispute Cases</h3>
            <span className="text-xs text-slate-400">{disputes.length} cases</span>
          </div>
          <div className="mt-4 overflow-hidden rounded-2xl border border-slate-100 dark:border-slate-700">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-xs font-semibold text-slate-400 dark:bg-slate-900/40">
                <tr>
                  <th className="p-4 text-left">Dispute Info</th>
                  <th className="p-4 text-left">Type/Status</th>
                  <th className="p-4 text-left">Amount/Agent</th>
                  <th className="p-4 text-left">Voting Progress</th>
                  <th className="p-4 text-left">Reward Pool</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {disputes.map((item) => (
                  <tr key={item.title} className="border-t border-slate-100 dark:border-slate-700">
                    <td className="p-4">
                      <p className="font-semibold">{item.title}</p>
                      <p className="text-xs text-slate-400">2025/1/1</p>
                    </td>
                    <td className="p-4">
                      <p className="text-xs uppercase text-slate-400">{item.type}</p>
                      <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-[10px] font-bold text-indigo-600">
                        {item.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <p className="font-semibold">{item.amount}</p>
                      <p className="text-xs text-slate-400">{item.agent}</p>
                    </td>
                    <td className="p-4">
                      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-500">
                        {item.progress}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="text-sm font-semibold">{item.reward}</span>
                    </td>
                    <td className="p-4 text-right">
                      <Button size="sm" className="rounded-full">
                        Vote
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      {showModal ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-xl rounded-3xl bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold">Create Governance Proposal</h3>
                <p className="text-xs text-slate-400">Initiate a community vote.</p>
              </div>
              <button type="button" onClick={() => setShowModal(false)}>
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="mt-4 space-y-4">
              <input
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm"
                placeholder="Enter a concise title"
              />
              <div className="grid grid-cols-3 gap-3 text-xs">
                {['Dispute', 'Treasury', 'Protocol Update'].map((label) => (
                  <button
                    key={label}
                    className="rounded-xl border border-slate-200 px-3 py-2 font-semibold text-slate-500"
                  >
                    {label}
                  </button>
                ))}
              </div>
              <textarea
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm"
                rows={4}
                placeholder="Provide a detailed explanation..."
              />
              <div className="rounded-2xl border border-dashed border-slate-200 px-6 py-10 text-center text-xs text-slate-400">
                Drop files here or click to upload
              </div>
              <div className="rounded-2xl bg-amber-50 px-4 py-3 text-xs text-amber-700">
                Staking requirement: minimum of 500 LALAMPA locked until vote concludes.
              </div>
              <Button className="w-full rounded-xl">Submit Proposal</Button>
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
}
