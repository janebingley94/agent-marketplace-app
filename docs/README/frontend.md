# Frontend development

- Framework: Next.js App Router.
- App entry: `apps/web/app`.
- Dev command: `pnpm --filter @agent-marketplace/web dev`.
- Health check: open `http://localhost:7002`.
- UI stack: Tailwind + shadcn/ui.
- State: TanStack Query + Jotai.
- Wallet: wagmi + viem.
- Tests: `pnpm --filter @agent-marketplace/web test`.

Environment:
- `NEXT_PUBLIC_API_URL` (defaults to `http://localhost:7001`).

Auth flow:
- Wallet connect uses injected provider (MetaMask).
- SIWE sign-in: `/auth/nonce` -> signature -> `/auth/verify` -> `/auth/me`.

Testing:
- Run: `pnpm --filter @agent-marketplace/web test`

Marketplace UI:
- Components: AgentCard, AgentGrid, SearchBar, FilterBar, CategoryTags, Leaderboard.
- URL state: `nuqs` for search/filter/pagination.

Agent detail UI:
- Route: `/agent/[slug]`.
- Components: AgentDetail, PricingCard, VersionHistory.
- Tabs: Overview / Performance / Technical Specs.

Studio UI:
- Route: `/studio`.
- Components: StudioAgentCard, FleetPerformanceCard, DeveloperApiCard, RecentActivity.

Agent deployment UI:
- Routes: `/studio/agents/new`, `/studio/agents/[id]/edit`.
- Component: AgentForm (shared create/edit layout).

Other pages:
- Wallet: `/wallet` (summary cards, earnings, distributions).
- Dashboard: `/dashboard` (agent workflow + chat).
- Bills: `/bills` and `/bills/create`.
- DAO: `/dao` (dispute list + proposal modal).
