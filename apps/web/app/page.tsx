import { Button } from '@/components/ui/button';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background px-6 py-16">
      <section className="mx-auto max-w-3xl space-y-6 rounded-2xl border border-border bg-card p-10 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-muted-foreground">
          Agent Marketplace
        </p>
        <h1 className="text-4xl font-semibold leading-tight text-foreground">
          Project configuration complete.
        </h1>
        <p className="text-base text-muted-foreground">
          Tailwind, shadcn/ui, TanStack Query, Jotai, and wagmi are wired up.
        </p>
        <div className="flex flex-wrap gap-3">
          <Button>Get started</Button>
          <Button variant="outline">View docs</Button>
        </div>
      </section>
    </main>
  );
}
