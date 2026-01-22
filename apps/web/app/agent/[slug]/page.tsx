'use client';

import React, { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Moon, TrendingUp, Verified } from 'lucide-react';

import { AgentDetail } from '@/components/agent/AgentDetail';
import { PricingCard, type PricingOption } from '@/components/agent/PricingCard';
import { VersionHistory, type VersionEntry } from '@/components/agent/VersionHistory';
import { getAgentBySlug } from '@/lib/agents';
import { queryKeys } from '@/lib/query-keys';

export default function AgentDetailPage({ params }: { params: { slug: string } }) {
  const [activeTab, setActiveTab] = useState<'overview' | 'performance' | 'technical'>('overview');
  const [selectedPricing, setSelectedPricing] = useState('payg');
  const [isDark, setIsDark] = useState(false);

  const agentQuery = useQuery({
    queryKey: queryKeys.agents.detail(params.slug),
    queryFn: () => getAgentBySlug(params.slug),
  });

  const agent = agentQuery.data;

  const pricingOptions: PricingOption[] = useMemo(
    () => [
      {
        id: 'payg',
        name: 'Pay-as-you-go',
        price: '0.45',
        unit: 'USDT / call',
        description: 'No minimum commitment. Discounts for volume usage.',
      },
      {
        id: 'monthly',
        name: 'Monthly Bundle',
        price: '199',
        unit: 'USDT / month',
        description: 'Includes 100k calls and priority support.',
      },
    ],
    []
  );

  const capabilities = [
    {
      title: 'Real-time Liquidity Monitoring',
      description: 'Tracks depth across 50+ DEXs simultaneously.',
    },
    {
      title: 'Predictive Volatility Modeling',
      description: 'Forecasts short-term price movements with 88% accuracy.',
    },
    {
      title: 'MEV Protection Strategy',
      description: 'Suggests optimal gas and routing to avoid front-running.',
    },
    {
      title: 'API Webhook Integration',
      description: 'Seamlessly push data to your trading bots or dashboards.',
    },
  ];

  const reviews = [
    {
      name: 'Alex.eth',
      rating: 5,
      time: '2 days ago',
      content:
        'The latency on V4 is incredible. We integrated it into our arbitrage bot on Base and ROI increased by 15% in the first week.',
    },
    {
      name: 'CryptoLabs_AI',
      rating: 4,
      time: '1 week ago',
      content:
        'Solid oracle service. Documentation could be a bit better for custom chain integrations, but the data quality is top-notch.',
    },
  ];

  const versions: VersionEntry[] = [
    {
      id: 'v1',
      version: '4.1.0',
      publishedAt: 'Jan 12, 2026',
      notes: 'Improved latency and added cross-chain routing safeguards.',
    },
    {
      id: 'v2',
      version: '4.0.0',
      publishedAt: 'Dec 21, 2025',
      notes: 'Major upgrade with predictive liquidity modeling improvements.',
    },
  ];

  const performanceMetrics = [
    { label: 'Daily Inquiries', value: '14.2k', delta: '+18%' },
    { label: 'Avg. Latency', value: '240ms', delta: '-6%' },
    { label: 'Success Rate', value: '99.3%' },
  ];

  const technicalSpecs = [
    { label: 'Provider', value: 'Aladdin Core' },
    { label: 'Model', value: 'OracleInsights V4' },
    { label: 'Runtime', value: 'Solana / EVM' },
    { label: 'Availability', value: '99.98% uptime' },
  ];

  if (agentQuery.isLoading) {
    return (
      <div className="min-h-screen bg-background px-6 py-12 text-sm text-slate-500">
        Loading agent details...
      </div>
    );
  }

  if (agentQuery.isError || !agent) {
    return (
      <div className="min-h-screen bg-background px-6 py-12 text-sm text-slate-500">
        Failed to load agent details.
      </div>
    );
  }

  const handleToggleTheme = () => {
    document.documentElement.classList.toggle('dark');
    setIsDark((prev) => !prev);
  };

  return (
    <main className="min-h-screen bg-background text-slate-900 dark:text-slate-100">
      <header className="fixed inset-x-0 top-0 z-50 h-20 border-b border-slate-200 bg-white/80 px-6 backdrop-blur-md dark:border-slate-700 dark:bg-slate-800/80 lg:px-10">
        <div className="mx-auto flex h-full max-w-7xl items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white">
              ✦
            </div>
            <span className="text-xl font-bold tracking-tight">Aladdin</span>
          </div>
          <nav className="hidden items-center gap-2 md:flex">
            {['Marketplace', 'Agent', 'Wallet', 'Dashboard', 'Bills', 'DAO'].map((item) => (
              <span
                key={item}
                className={
                  item === 'Marketplace'
                    ? 'relative px-4 py-2 font-semibold text-primary after:absolute after:-bottom-5 after:left-0 after:right-0 after:h-0.5 after:bg-primary'
                    : 'px-4 py-2 font-medium text-slate-500 transition-all hover:text-primary dark:text-slate-400 dark:hover:text-primary'
                }
              >
                {item}
              </span>
            ))}
          </nav>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={handleToggleTheme}
              aria-pressed={isDark}
              className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-700"
            >
              <Moon className="h-5 w-5" />
            </button>
            <div className="h-10 w-10 overflow-hidden rounded-full border-2 border-primary/20 bg-slate-200 dark:bg-slate-700" />
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 pb-12 pt-28 lg:px-10">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <AgentDetail
              agent={agent}
              rating={4.9}
              reviewCount={1248}
              weeklyCallsLabel="12k+ Calls this week"
              capabilities={capabilities}
              reviews={reviews}
              performanceMetrics={performanceMetrics}
              technicalSpecs={technicalSpecs}
              activeTab={activeTab}
              onTabChange={setActiveTab}
              onLease={() => setSelectedPricing('payg')}
            />
          </div>
          <aside className="space-y-6 lg:col-span-4">
            <PricingCard
              options={pricingOptions}
              selectedId={selectedPricing}
              onSelect={setSelectedPricing}
              onPurchase={() => setSelectedPricing('payg')}
            />
            <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
              <h3 className="mb-6 text-xs font-bold uppercase tracking-widest text-slate-400">
                Revenue Stats
              </h3>
              <div className="space-y-4">
                <div>
                  <p className="mb-1 text-xs text-slate-500">Weekly Revenue</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold">12,450 USDT</span>
                    <span className="flex items-center text-xs font-bold text-emerald-500">
                      <TrendingUp className="mr-1 h-4 w-4" /> 14%
                    </span>
                  </div>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700">
                  <div className="h-full w-[72%] bg-primary" />
                </div>
                <div className="flex justify-between text-[10px] font-bold uppercase text-slate-400">
                  <span>Market Avg: 4.2k</span>
                  <span>Rank: #12</span>
                </div>
              </div>
            </section>
            <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
              <h3 className="mb-6 text-xs font-bold uppercase tracking-widest text-slate-400">
                Trust Score
              </h3>
              <div className="flex items-center gap-6">
                <div className="relative h-20 w-20">
                  <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
                    <circle
                      className="text-slate-100 dark:text-slate-700"
                      cx="50"
                      cy="50"
                      r="40"
                      fill="transparent"
                      stroke="currentColor"
                      strokeWidth="8"
                    />
                    <circle
                      className="text-emerald-500"
                      cx="50"
                      cy="50"
                      r="40"
                      fill="transparent"
                      stroke="currentColor"
                      strokeDasharray="251.2"
                      strokeDashoffset="12.5"
                      strokeLinecap="round"
                      strokeWidth="8"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center text-lg font-bold">
                    95
                  </div>
                </div>
                <div>
                  <div className="mb-1 flex items-center gap-1 text-emerald-500">
                    <Verified className="h-4 w-4" />
                    <span className="font-bold">High Integrity</span>
                  </div>
                  <p className="text-xs text-slate-500">
                    Audited by Aladdin Core Team. Stable uptime of 99.98% over last 30 days.
                  </p>
                </div>
              </div>
            </section>
            <VersionHistory versions={versions} />
          </aside>
        </div>
      </div>
    </main>
  );
}
