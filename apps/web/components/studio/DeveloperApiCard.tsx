import React from 'react';
import { Button } from '@/components/ui/button';

export function DeveloperApiCard() {
  return (
    <section className="rounded-2xl border border-slate-100 bg-slate-900 p-6 text-white shadow-sm">
      <h3 className="mb-2 flex items-center gap-2 text-sm font-bold">
        <span className="inline-flex h-6 w-6 items-center justify-center rounded-lg bg-white/10">⚡</span>
        Developer API
      </h3>
      <p className="mb-6 text-xs text-slate-200">
        Connect your local agents to the Aladdin network via our secure SDK. Get your API key to
        start.
      </p>
      <Button className="w-full rounded-xl bg-white font-bold text-slate-900 hover:bg-slate-100">
        Access API Console
      </Button>
    </section>
  );
}
