import React from 'react';
import { Button } from '@/components/ui/button';

export type PricingOption = {
  id: string;
  name: string;
  price: string;
  unit: string;
  description: string;
};

export type PricingCardProps = {
  options: PricingOption[];
  selectedId: string;
  onSelect: (id: string) => void;
  onPurchase?: () => void;
};

export function PricingCard({ options, selectedId, onSelect, onPurchase }: PricingCardProps) {
  const selected = options.find((option) => option.id === selectedId) ?? options[0];

  return (
    <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
      <h3 className="mb-6 text-xs font-bold uppercase tracking-widest text-slate-400">
        Pricing Model
      </h3>
      <div className="space-y-3">
        {options.map((option) => {
          const isActive = option.id === selectedId;
          return (
            <button
              key={option.id}
              type="button"
              onClick={() => onSelect(option.id)}
              className={`w-full rounded-xl border px-4 py-3 text-left transition-all ${
                isActive
                  ? 'border-primary bg-primary/10'
                  : 'border-slate-200 hover:border-primary/50 dark:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  {option.name}
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400">{option.unit}</span>
              </div>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                {option.description}
              </p>
              <div className="mt-2 text-lg font-bold">
                {option.price} <span className="text-xs text-slate-500">/ {option.unit}</span>
              </div>
            </button>
          );
        })}
      </div>
      {selected ? (
        <div className="mt-6 border-t border-slate-100 pt-4 text-xs text-slate-400 dark:border-slate-700">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-500">Service Fee</span>
            <span className="font-medium">5%</span>
          </div>
          <div className="mt-2 flex items-center justify-between text-sm">
            <span className="text-slate-500">Gas Allowance</span>
            <span className="font-medium">Dynamic</span>
          </div>
        </div>
      ) : null}
      <Button
        className="mt-6 w-full rounded-xl font-bold shadow-lg shadow-primary/20"
        onClick={onPurchase}
      >
        Lease Agent
      </Button>
    </section>
  );
}
