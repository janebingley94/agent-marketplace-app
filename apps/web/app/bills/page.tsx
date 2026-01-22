'use client';

import React, { useState } from 'react';
import { Moon, Search, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';

const transactions = [
  {
    id: 'TXN-94021-X',
    date: '2023-10-24 14:32',
    agent: 'WeatherAgent Pro',
    status: 'No Dispute',
    amount: '5.20 USDT',
    fee: 'VAT Paid',
  },
  {
    id: 'TXN-82711-A',
    date: '2023-10-22 09:15',
    agent: 'GPT-4 Turbo Node',
    status: 'In Mediation',
    amount: '12.80 USDT',
    fee: 'Tax Pending',
  },
  {
    id: 'TXN-11029-B',
    date: '2023-10-21 18:45',
    agent: 'TradingBot Alpha',
    status: 'No Dispute',
    amount: '45.00 USDT',
    fee: 'Exempt',
  },
];

export default function BillsPage() {
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
                  item === 'Bills'
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
            <div className="h-10 w-10 rounded-full bg-slate-200 dark:bg-slate-700" />
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 pb-12 pt-8 lg:px-10">
        <header className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold">Billing & Transactions</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Manage your AI agent service payments, invoices, and on-chain records.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="rounded-xl">
              <Upload className="mr-2 h-4 w-4" /> Export CSV
            </Button>
            <Button className="rounded-xl">Create Invoice</Button>
          </div>
        </header>

        <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex gap-2">
              <Button variant="outline" className="rounded-full px-4">
                As Payee
              </Button>
              <Button variant="outline" className="rounded-full px-4">
                As Payer
              </Button>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  className="rounded-full border border-slate-200 bg-white py-2 pl-10 pr-4 text-sm dark:border-slate-700 dark:bg-slate-800"
                  placeholder="Search by Agent or ID..."
                />
              </div>
              <select className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm dark:border-slate-700 dark:bg-slate-800">
                <option>All Status</option>
                <option>No Dispute</option>
                <option>In Mediation</option>
              </select>
            </div>
          </div>

          <div className="mt-6 overflow-hidden rounded-2xl border border-slate-100 dark:border-slate-700">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-left text-xs font-semibold text-slate-400 dark:bg-slate-900/40">
                <tr>
                  <th className="p-4">Transaction Details</th>
                  <th className="p-4">Agent Entity</th>
                  <th className="p-4">Dispute Status</th>
                  <th className="p-4">Tax / Fees</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((txn) => (
                  <tr key={txn.id} className="border-t border-slate-100 dark:border-slate-700">
                    <td className="p-4">
                      <p className="font-semibold">{txn.date}</p>
                      <p className="text-xs text-slate-400">ID: {txn.id}</p>
                    </td>
                    <td className="p-4">
                      <p className="font-semibold">{txn.agent}</p>
                      <p className="text-xs text-slate-400">Contract-based</p>
                    </td>
                    <td className="p-4">
                      <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-bold text-emerald-600">
                        {txn.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <p className="font-semibold">{txn.amount}</p>
                      <p className="text-xs text-slate-400">{txn.fee}</p>
                    </td>
                    <td className="p-4 text-right">
                      <Button variant="outline" size="sm" className="rounded-full">
                        Details
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex items-center justify-between text-xs text-slate-400">
            <span>Showing 1 to 10 of 42 transactions</span>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="rounded-full">
                1
              </Button>
              <Button variant="outline" size="sm" className="rounded-full">
                2
              </Button>
              <Button variant="outline" size="sm" className="rounded-full">
                3
              </Button>
            </div>
          </div>
        </section>

        <div className="mt-8 grid gap-6 lg:grid-cols-12">
          <section className="lg:col-span-8">
            <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
              <h3 className="font-semibold">Monthly Volume Analysis</h3>
              <div className="mt-6 grid grid-cols-6 gap-4">
                {[
                  { month: 'May', height: 'h-16' },
                  { month: 'Jun', height: 'h-16' },
                  { month: 'Jul', height: 'h-20' },
                  { month: 'Aug', height: 'h-24' },
                  { month: 'Sep', height: 'h-16' },
                  { month: 'Oct', height: 'h-16' },
                ].map((item) => (
                  <div key={item.month} className="text-center">
                    <div className={`mx-auto w-full rounded-xl bg-primary/20 ${item.height}`} />
                    <p className="mt-2 text-xs text-slate-400">{item.month}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
          <aside className="lg:col-span-4">
            <div className="rounded-2xl bg-primary p-6 text-white shadow-lg shadow-primary/30">
              <p className="text-xs uppercase text-white/70">Pending Payouts</p>
              <p className="mt-2 text-2xl font-bold">1,284.50</p>
              <p className="text-xs text-white/70">Next distribution scheduled for Friday, Oct 27th.</p>
              <Button className="mt-6 w-full rounded-xl bg-white text-slate-900">
                Request Early Withdrawal
              </Button>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
