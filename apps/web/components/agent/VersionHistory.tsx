import React from 'react';

export type VersionEntry = {
  id: string;
  version: string;
  publishedAt: string;
  notes: string;
};

export function VersionHistory({ versions }: { versions: VersionEntry[] }) {
  return (
    <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
      <h3 className="mb-6 text-xs font-bold uppercase tracking-widest text-slate-400">
        Version History
      </h3>
      <div className="space-y-4">
        {versions.map((version) => (
          <div key={version.id} className="rounded-xl border border-slate-100 p-4 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-slate-900 dark:text-slate-100">
                v{version.version}
              </span>
              <span className="text-xs text-slate-400">{version.publishedAt}</span>
            </div>
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">{version.notes}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
