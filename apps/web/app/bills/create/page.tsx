'use client';

import React, { useState } from 'react';
import { Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function CreateInvoicePage() {
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
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 pb-12 pt-8 lg:px-10">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400">Billing • Create Invoice</p>
            <h1 className="text-2xl font-bold">Create Service Invoice</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Generate a professional on-chain billing record for agent services.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="rounded-xl">Save Draft</Button>
            <Button className="rounded-xl">Send & Log</Button>
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-12">
          <section className="space-y-6 lg:col-span-7">
            <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
              <h3 className="font-semibold">General Details</h3>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <input className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm" placeholder="Wallet Address (0x...) or User ID" />
                <select className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm">
                  <option>WeatherAgent Pro (Owned)</option>
                </select>
                <input className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm" placeholder="Oct 1 - Oct 31, 2023" />
                <select className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm">
                  <option>Due on Receipt</option>
                </select>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Service Line Items</h3>
                <button className="text-sm font-semibold text-primary">Add Item</button>
              </div>
              <div className="mt-4 space-y-4">
                <div className="grid gap-3 md:grid-cols-5">
                  <input className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm md:col-span-2" placeholder="API Endpoint Consumption - Tier 1" />
                  <input className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm" placeholder="1" />
                  <input className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm" placeholder="250.00" />
                  <div className="flex items-center justify-end text-sm font-semibold">$250.00</div>
                </div>
                <div className="grid gap-3 md:grid-cols-5">
                  <input className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm md:col-span-2" placeholder="Premium Support Bundle (Monthly)" />
                  <input className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm" placeholder="1" />
                  <input className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm" placeholder="50.00" />
                  <div className="flex items-center justify-end text-sm font-semibold">$50.00</div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
              <h3 className="font-semibold">Tax & Compliance</h3>
              <div className="mt-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Tax / VAT (15%)</p>
                  <p className="text-xs text-slate-400">Metadata will be hashed and stored on the protocol.</p>
                </div>
                <div className="h-6 w-11 rounded-full bg-primary" />
              </div>
            </div>
          </section>

          <aside className="lg:col-span-5">
            <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
              <h3 className="font-semibold">Live Preview</h3>
              <div className="mt-4 rounded-2xl border border-slate-200 p-4 text-xs text-slate-500">
                Invoice preview placeholder
              </div>
              <div className="mt-4 flex gap-3">
                <Button variant="outline" className="flex-1 rounded-xl">
                  Print PDF
                </Button>
                <Button variant="outline" className="flex-1 rounded-xl">
                  Share Link
                </Button>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
