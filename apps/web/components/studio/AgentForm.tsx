'use client';

import React, { useMemo, useState } from 'react';
import { Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';

export type AgentFormMode = 'create' | 'edit';

export type AgentFormValues = {
  name: string;
  address: string;
  description: string;
  pricingMode: 'result' | 'algorithmic';
  verificationEnabled: boolean;
  privateMode: boolean;
  humanRewards: boolean;
  daoIntervention: boolean;
  callFee: string;
  marginDeposit: number;
  collectionAddress: string;
  includeTax: boolean;
  taxRegion: string;
};

type AgentFormProps = {
  mode: AgentFormMode;
  initialValues?: Partial<AgentFormValues>;
  onSubmit?: (values: AgentFormValues) => void;
};

const defaultValues: AgentFormValues = {
  name: 'New Agent Project',
  address: '',
  description: '',
  pricingMode: 'result',
  verificationEnabled: true,
  privateMode: false,
  humanRewards: true,
  daoIntervention: true,
  callFee: '3.50',
  marginDeposit: 200,
  collectionAddress: '',
  includeTax: false,
  taxRegion: '',
};

export function AgentForm({ mode, initialValues, onSubmit }: AgentFormProps) {
  const [isDark, setIsDark] = useState(false);
  const [values, setValues] = useState<AgentFormValues>({
    ...defaultValues,
    ...initialValues,
  });

  const previewDescription = values.description || 'Enter description to see preview...';

  const title = mode === 'create' ? 'Agent Deployment' : 'Edit Agent';
  const subtitle =
    mode === 'create'
      ? 'Configure and launch your AI Agent to the marketplace.'
      : 'Update your deployed agent settings and execution parameters.';

  const primaryAction = mode === 'create' ? 'Deploy Agent' : 'Save Changes';

  const update = <K extends keyof AgentFormValues>(key: K, value: AgentFormValues[K]) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = () => {
    onSubmit?.(values);
  };

  const callFeeDisplay = useMemo(() => Number(values.callFee || 0).toFixed(2), [values.callFee]);

  return (
    <main className="min-h-screen bg-background text-slate-900 dark:text-slate-100">
      <header className="sticky top-0 z-50 h-20 border-b border-slate-200 bg-white/80 px-6 backdrop-blur-md dark:border-slate-700 dark:bg-slate-800/80 lg:px-10">
        <div className="mx-auto flex h-full max-w-7xl items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white">
              ✦
            </div>
            <span className="text-xl font-bold tracking-tight">Aladdin</span>
          </div>
          <nav className="hidden items-center gap-8 md:flex">
            {['Marketplace', 'Agent', 'Wallet', 'Dashboard', 'Bills', 'DAO'].map((item) => (
              <span
                key={item}
                className={
                  item === 'Agent'
                    ? 'relative h-20 font-bold text-primary after:absolute after:bottom-0 after:left-0 after:h-[3px] after:w-full after:bg-primary'
                    : 'text-sm font-semibold text-slate-500 transition-colors hover:text-primary dark:text-slate-400 dark:hover:text-primary'
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
            <div className="h-8 w-8 rounded-full bg-slate-200 dark:bg-slate-700" />
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-10">
        <header className="mb-10">
          <h1 className="text-3xl font-bold">{title}</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{subtitle}</p>
        </header>

        <div className="grid grid-cols-1 gap-8 xl:grid-cols-12">
          <div className="space-y-8 xl:col-span-7">
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary to-indigo-800 p-8 text-white">
              <div className="absolute -bottom-10 -right-10 rotate-12 text-[200px] opacity-20">🤖</div>
              <div className="relative flex items-center gap-6">
                <div className="flex h-24 w-24 items-center justify-center rounded-2xl border border-white/30 bg-white/20">
                  ✦
                </div>
                <div>
                  <span className="mb-2 inline-block rounded-full bg-white/20 px-3 py-1 text-xs font-semibold">
                    PREVIEW MODE
                  </span>
                  <h2 className="text-2xl font-bold">{values.name || 'New Agent Project'}</h2>
                  <p className="text-white/80">{previewDescription}</p>
                </div>
              </div>
            </div>

            <section className="rounded-2xl border border-slate-100 bg-white p-8 shadow-sm dark:border-slate-700 dark:bg-slate-800">
              <h3 className="mb-6 flex items-center gap-2 text-lg font-semibold">
                <span className="text-primary">ℹ️</span> Basic Information
              </h3>
              <div className="grid gap-6">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-600 dark:text-slate-400">
                    Agent Name
                  </label>
                  <input
                    className="w-full rounded-xl border-slate-200 bg-slate-50 focus:border-primary focus:ring-primary dark:border-slate-700 dark:bg-slate-900"
                    placeholder="e.g. DataOracle-V1"
                    value={values.name}
                    onChange={(event) => update('name', event.target.value)}
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-600 dark:text-slate-400">
                    Agent Address (Contract or API)
                  </label>
                  <input
                    className="w-full rounded-xl border-slate-200 bg-slate-50 focus:border-primary focus:ring-primary dark:border-slate-700 dark:bg-slate-900"
                    placeholder="0x... or https://api.agent.io"
                    value={values.address}
                    onChange={(event) => update('address', event.target.value)}
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-600 dark:text-slate-400">
                    Description
                  </label>
                  <textarea
                    className="w-full rounded-xl border-slate-200 bg-slate-50 focus:border-primary focus:ring-primary dark:border-slate-700 dark:bg-slate-900"
                    placeholder="Describe your agent's capabilities..."
                    rows={3}
                    value={values.description}
                    onChange={(event) => update('description', event.target.value)}
                  />
                </div>
              </div>
            </section>

            <section className="rounded-2xl border border-slate-100 bg-white p-8 shadow-sm dark:border-slate-700 dark:bg-slate-800">
              <h3 className="mb-6 flex items-center gap-2 text-lg font-semibold">
                <span className="text-primary">⚙️</span> Model & Execution
              </h3>
              <div className="mb-8 grid gap-6 md:grid-cols-2">
                <button
                  type="button"
                  className={`flex flex-col rounded-2xl border-2 p-5 text-left transition-all ${
                    values.pricingMode === 'result'
                      ? 'border-primary bg-primary/5'
                      : 'border-transparent bg-slate-50 hover:border-slate-300 dark:bg-slate-900'
                  }`}
                  onClick={() => update('pricingMode', 'result')}
                >
                  <span className="mb-3 text-primary">✅</span>
                  <span className="font-bold">Result-based Contract</span>
                  <span className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    Payment released upon verified output.
                  </span>
                </button>
                <button
                  type="button"
                  className={`flex flex-col rounded-2xl border-2 p-5 text-left transition-all ${
                    values.pricingMode === 'algorithmic'
                      ? 'border-primary bg-primary/5'
                      : 'border-transparent bg-slate-50 hover:border-slate-300 dark:bg-slate-900'
                  }`}
                  onClick={() => update('pricingMode', 'algorithmic')}
                >
                  <span className="mb-3 text-slate-400">🧮</span>
                  <span className="font-bold">Algorithmic-based</span>
                  <span className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    Fee calculated by computational cycles.
                  </span>
                </button>
              </div>
              <div className="flex items-center justify-between rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900">
                <div className="flex items-center gap-3">
                  <span className="text-primary">✅</span>
                  <span className="text-sm">Third-party verification for automated settlement</span>
                </div>
                <label className="relative inline-flex cursor-pointer items-center">
                  <input
                    className="peer sr-only"
                    type="checkbox"
                    checked={values.verificationEnabled}
                    onChange={(event) => update('verificationEnabled', event.target.checked)}
                  />
                  <div className="h-6 w-11 rounded-full bg-slate-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all peer-checked:bg-primary peer-checked:after:translate-x-full dark:bg-slate-700" />
                </label>
              </div>
            </section>
          </div>

          <div className="space-y-8 xl:col-span-5">
            <section className="rounded-2xl border border-slate-100 bg-white p-8 shadow-sm dark:border-slate-700 dark:bg-slate-800">
              <h3 className="mb-6 text-lg font-semibold">Execution & Privacy</h3>
              <div className="space-y-6">
                {[
                  {
                    key: 'privateMode',
                    label: 'Private Mode',
                    description: 'Requires pre-authorized payment accounts from counterparties.',
                  },
                  {
                    key: 'humanRewards',
                    label: 'Human Incentive Rewards',
                    description: 'Enable additional rewards for high-quality human verification.',
                  },
                  {
                    key: 'daoIntervention',
                    label: 'DAO Intervention',
                    description: 'Allow DAO to intervene in case of contract disputes.',
                  },
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{item.label}</p>
                      <p className="text-xs text-slate-500">{item.description}</p>
                    </div>
                    <label className="relative inline-flex cursor-pointer items-center">
                      <input
                        className="peer sr-only"
                        type="checkbox"
                        checked={values[item.key as keyof AgentFormValues] as boolean}
                        onChange={(event) =>
                          update(item.key as keyof AgentFormValues, event.target.checked as never)
                        }
                      />
                      <div className="h-6 w-11 rounded-full bg-slate-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all peer-checked:bg-primary dark:bg-slate-700" />
                    </label>
                  </div>
                ))}
              </div>
              <div className="mt-8 space-y-4">
                <label className="block text-sm font-medium text-slate-600 dark:text-slate-400">
                  Fixed Call Fee (USDT)
                </label>
                <div className="relative">
                  <input
                    className="w-full rounded-xl border-slate-200 bg-slate-50 py-3 pl-4 pr-12 dark:border-slate-700 dark:bg-slate-900"
                    type="number"
                    value={values.callFee}
                    onChange={(event) => update('callFee', event.target.value)}
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-slate-400">
                    USDT
                  </span>
                </div>
                <p className="text-xs text-slate-400">Current fee: {callFeeDisplay} USDT</p>
              </div>
            </section>

            <section className="rounded-2xl border border-slate-100 bg-white p-8 shadow-sm dark:border-slate-700 dark:bg-slate-800">
              <h3 className="mb-6 flex items-center gap-2 text-lg font-semibold">
                <span className="text-primary">🛡️</span> Financial Settings
              </h3>
              <div className="space-y-6">
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label className="text-sm font-medium">Margin Deposit (Collateral)</label>
                    <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs text-amber-600 dark:bg-amber-900/30 dark:text-amber-400">
                      Recommended
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <input
                      className="w-full accent-primary"
                      type="range"
                      min={0}
                      max={500}
                      value={values.marginDeposit}
                      onChange={(event) => update('marginDeposit', Number(event.target.value))}
                    />
                    <span className="whitespace-nowrap font-bold">{values.marginDeposit} USDT</span>
                  </div>
                </div>
                <div className="border-t border-slate-100 pt-4 dark:border-slate-700">
                  <label className="mb-3 block text-sm font-medium">Collection Address</label>
                  <input
                    className="w-full rounded-xl border-slate-200 bg-slate-50 text-sm dark:border-slate-700 dark:bg-slate-900"
                    placeholder="0x71C765...f44E"
                    value={values.collectionAddress}
                    onChange={(event) => update('collectionAddress', event.target.value)}
                  />
                </div>
                <div>
                  <label className="mb-3 block text-sm font-medium">Tax Configuration</label>
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2 text-sm">
                      <input
                        className="rounded border-slate-300 text-primary focus:ring-primary dark:border-slate-700"
                        type="checkbox"
                        checked={values.includeTax}
                        onChange={(event) => update('includeTax', event.target.checked)}
                      />
                      Include VAT/Tax
                    </label>
                    <select
                      className="flex-1 rounded-xl border-slate-200 bg-slate-50 text-sm dark:border-slate-700 dark:bg-slate-900"
                      value={values.taxRegion}
                      onChange={(event) => update('taxRegion', event.target.value)}
                    >
                      <option value="">Select Region...</option>
                      <option value="North America">North America</option>
                      <option value="European Union">European Union</option>
                      <option value="APAC">APAC</option>
                    </select>
                  </div>
                </div>
              </div>
            </section>

            <div className="flex gap-4">
              <button
                className="flex-1 rounded-2xl border border-slate-200 px-6 py-4 font-semibold transition-colors hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
                type="button"
              >
                Save Draft
              </button>
              <button
                className="flex-[2] rounded-2xl bg-primary px-6 py-4 font-bold text-white shadow-lg shadow-primary/30 transition-all hover:-translate-y-0.5 hover:shadow-primary/40"
                type="button"
                onClick={handleSubmit}
              >
                {primaryAction}
              </button>
            </div>
            <p className="text-center text-xs text-slate-500">
              By deploying, you agree to the{' '}
              <a className="text-primary hover:underline" href="#">
                Aladdin Protocol Terms of Service
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
