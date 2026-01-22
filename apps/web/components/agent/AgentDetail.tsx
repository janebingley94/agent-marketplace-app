'use client';

import React from 'react';
import { ArrowLeft, Star } from 'lucide-react';
import type { AgentListItem } from '@/lib/agents';
import { Button } from '@/components/ui/button';

export type AgentCapability = {
  title: string;
  description: string;
};

export type AgentReview = {
  name: string;
  rating: number;
  content: string;
  time: string;
};

export type PerformanceMetric = {
  label: string;
  value: string;
  delta?: string;
};

export type TechnicalSpec = {
  label: string;
  value: string;
};

export type AgentDetailProps = {
  agent: AgentListItem;
  rating: number;
  reviewCount: number;
  weeklyCallsLabel: string;
  capabilities: AgentCapability[];
  reviews: AgentReview[];
  performanceMetrics?: PerformanceMetric[];
  technicalSpecs?: TechnicalSpec[];
  activeTab: 'overview' | 'performance' | 'technical';
  onTabChange: (tab: 'overview' | 'performance' | 'technical') => void;
  onLease?: () => void;
};

export function AgentDetail({
  agent,
  rating,
  reviewCount,
  weeklyCallsLabel,
  capabilities,
  reviews,
  performanceMetrics = [],
  technicalSpecs = [],
  activeTab,
  onTabChange,
  onLease,
}: AgentDetailProps) {
  return (
    <div>
      <a
        className="group mb-8 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition-colors hover:text-primary dark:text-slate-400"
        href="/"
      >
        <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
        Back to Marketplace
      </a>

      <section className="mb-8 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-6">
            <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400 md:h-24 md:w-24">
              <Star className="h-10 w-10" />
            </div>
            <div>
              <div className="mb-1 flex items-center gap-3">
                <h1 className="text-3xl font-bold">{agent.name}</h1>
                <span className="rounded bg-emerald-100 px-2 py-0.5 text-xs font-bold text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
                  Live
                </span>
              </div>
              <p className="font-medium text-slate-500 dark:text-slate-400">
                by <span className="text-primary hover:underline">@{agent.owner.name ?? 'creator'}</span>
              </p>
              <div className="mt-3 flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  <span className="text-sm font-bold">{rating.toFixed(1)}</span>
                  <span className="text-xs text-slate-400">({reviewCount} reviews)</span>
                </div>
                <div className="h-1 w-1 rounded-full bg-slate-300 dark:bg-slate-600" />
                <div className="text-sm text-slate-500">{weeklyCallsLabel}</div>
              </div>
            </div>
          </div>
          <div className="flex w-full flex-col gap-3 sm:flex-row md:w-auto">
            <Button
              variant="outline"
              className="w-full rounded-xl border-slate-200 font-bold dark:border-slate-700"
            >
              Add to Watchlist
            </Button>
            <Button
              className="w-full rounded-xl font-bold shadow-lg shadow-primary/20"
              onClick={onLease}
            >
              Lease Agent
            </Button>
          </div>
        </div>
      </section>

      <div className="mb-8 border-b border-slate-200 dark:border-slate-700">
        <nav className="flex min-w-max gap-8 overflow-x-auto">
          {[
            { label: 'Overview', value: 'overview' },
            { label: 'Performance', value: 'performance' },
            { label: 'Technical Specs', value: 'technical' },
          ].map((tab) => (
            <button
              key={tab.value}
              className={`pb-4 text-sm transition-all ${
                activeTab === tab.value
                  ? 'border-b-2 border-primary font-bold text-primary'
                  : 'border-b-2 border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
              onClick={() => onTabChange(tab.value as 'overview' | 'performance' | 'technical')}
              type="button"
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {activeTab === 'overview' ? (
        <div className="space-y-10">
          <section>
            <h2 className="mb-4 text-xl font-bold">Detailed Description</h2>
            <div className="prose max-w-none text-slate-600 dark:prose-invert dark:text-slate-400">
              <p>
                {agent.description ??
                  'This agent provides high-signal insights and real-time monitoring for your workflows.'}
              </p>
            </div>
          </section>

          <section>
            <h2 className="mb-4 text-xl font-bold">Capabilities</h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {capabilities.map((capability) => (
                <div
                  key={capability.title}
                  className="flex gap-3 rounded-xl border border-slate-100 bg-white p-4 dark:border-slate-700 dark:bg-slate-800"
                >
                  <Star className="h-5 w-5 text-primary" />
                  <div>
                    <h4 className="text-sm font-bold">{capability.title}</h4>
                    <p className="mt-1 text-xs text-slate-500">{capability.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold">User Reviews</h2>
              <button className="text-sm font-bold text-primary hover:underline" type="button">
                Write a Review
              </button>
            </div>
            <div className="space-y-4">
              {reviews.map((review) => (
                <div
                  key={review.name}
                  className="rounded-2xl border border-slate-100 bg-white p-6 dark:border-slate-700 dark:bg-slate-800"
                >
                  <div className="mb-4 flex items-start justify-between">
                    <div className="flex gap-3">
                      <div className="h-10 w-10 rounded-full bg-slate-200" />
                      <div>
                        <p className="text-sm font-bold">{review.name}</p>
                        <div className="flex gap-0.5">
                          {Array.from({ length: 5 }).map((_, index) => (
                            <Star
                              key={`${review.name}-star-${index}`}
                              className={`h-3 w-3 ${
                                index < review.rating
                                  ? 'fill-amber-400 text-amber-400'
                                  : 'text-slate-300'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    <span className="text-xs text-slate-400">{review.time}</span>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">{review.content}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      ) : null}

      {activeTab === 'performance' ? (
        <div className="space-y-6">
          <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
            <h2 className="mb-4 text-lg font-bold">Performance Snapshot</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {performanceMetrics.map((metric) => (
                <div key={metric.label} className="rounded-xl bg-slate-50 p-4 dark:bg-slate-900/40">
                  <p className="text-xs font-semibold uppercase text-slate-400">{metric.label}</p>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-lg font-bold">{metric.value}</span>
                    {metric.delta ? (
                      <span className="text-xs font-bold text-emerald-500">{metric.delta}</span>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          </section>
          <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
            <h2 className="mb-4 text-lg font-bold">Usage Activity</h2>
            <div className="h-32 rounded-xl border border-dashed border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-900/30" />
            <p className="mt-3 text-xs text-slate-500">
              Charts and historical usage trends will appear here.
            </p>
          </section>
        </div>
      ) : null}

      {activeTab === 'technical' ? (
        <div className="space-y-6">
          <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
            <h2 className="mb-4 text-lg font-bold">Technical Specs</h2>
            <div className="space-y-3">
              {technicalSpecs.map((spec) => (
                <div key={spec.label} className="flex items-center justify-between text-sm">
                  <span className="text-slate-500 dark:text-slate-400">{spec.label}</span>
                  <span className="font-medium">{spec.value}</span>
                </div>
              ))}
            </div>
          </section>
          <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
            <h2 className="mb-4 text-lg font-bold">Integration Notes</h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              This agent supports webhook delivery, SDK authentication, and configurable runtime
              settings. Refer to the API documentation for detailed integration steps.
            </p>
          </section>
        </div>
      ) : null}
    </div>
  );
}
