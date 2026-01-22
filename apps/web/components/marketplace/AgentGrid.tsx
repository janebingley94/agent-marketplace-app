import type { AgentListItem } from '@/lib/agents';
import { AgentCard } from './AgentCard';
import { Button } from '@/components/ui/button';

type AgentGridProps = {
  agents: AgentListItem[];
  isLoading: boolean;
  isError: boolean;
  onRetry?: () => void;
};

export function AgentGrid({ agents, isLoading, isError, onRetry }: AgentGridProps) {
  if (isLoading) {
    return (
      <div className="grid gap-6 md:grid-cols-2">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={`skeleton-${index}`}
            className="h-64 animate-pulse rounded-2xl border border-slate-100 bg-white dark:border-slate-700 dark:bg-slate-800"
          />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-2xl border border-slate-100 bg-white p-8 text-center dark:border-slate-700 dark:bg-slate-800">
        <p className="text-sm text-slate-500 dark:text-slate-400">Failed to load agents.</p>
        {onRetry ? (
          <div className="mt-4">
            <Button size="sm" onClick={onRetry}>
              Retry
            </Button>
          </div>
        ) : null}
      </div>
    );
  }

  if (agents.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-100 bg-white p-8 text-center dark:border-slate-700 dark:bg-slate-800">
        <p className="text-sm text-slate-500 dark:text-slate-400">No agents found.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {agents.map((agent) => (
        <AgentCard key={agent.id} agent={agent} />
      ))}
    </div>
  );
}
