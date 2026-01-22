# Agent Marketplace

Monorepo scaffold for the Agent Marketplace platform.

## Local development

```bash
pnpm install
pnpm dev
```

Recommended runtime: Node v25.2.1 (per project input). `engines` remains flexible for local compatibility.

Apps:

- Web: `http://localhost:7002`
- API: `http://localhost:7001`

Frontend tooling:
- Tailwind + shadcn/ui
- TanStack Query + Jotai
- wagmi + viem

Frontend env:
- `NEXT_PUBLIC_API_URL` (defaults to `http://localhost:7001`)

Frontend auth:
- Wallet connect via injected provider + SIWE (`/auth/nonce` -> `/auth/verify`).

Marketplace:
- Search/filter/pagination wired to URL state with `nuqs`.
- Agent detail page: `/agent/[slug]` with pricing + version history sections.
- Studio page: `/studio` with agent fleet cards and performance widgets.
- Agent deployment: `/studio/agents/new` and `/studio/agents/[id]/edit`.
- Wallet: `/wallet`.
- Dashboard: `/dashboard`.
- Bills: `/bills` and `/bills/create`.
- DAO: `/dao`.

## Environment variables

Copy the example file and adjust as needed:

```bash
cp apps/api/.env.example apps/api/.env
```

Required variables for the API:

- `PORT`
- `DATABASE_URL`
- `REDIS_URL`
- `JWT_SECRET`
- `JWT_EXPIRES_IN`

## Local infrastructure (Docker)

```bash
docker compose up -d
```

Services:
- Postgres: `localhost:5432`
- Redis: `localhost:6379`

## Database setup

```bash
pnpm db:generate
pnpm db:migrate
pnpm db:seed
```

## API example

```bash
curl http://localhost:7001/health
```

Expected response:

```json
{
  "status": "ok",
  "timestamp": "2026-01-21T00:00:00.000Z"
}
```

Auth example:

```bash
curl -X POST http://localhost:7001/auth/nonce \
  -H 'Content-Type: application/json' \
  -d '{"address":"0x71C7656EC7ab88b098defB751B7401B5f6d8976F","chainId":1}'
```

```bash
curl -X POST http://localhost:7001/auth/verify \
  -H 'Content-Type: application/json' \
  -d '{"message":"Sign in to Agent Marketplace\nNonce: <nonce>","signature":"0x...","address":"0x71C7656EC7ab88b098defB751B7401B5f6d8976F","chainId":1}'
```

```bash
curl http://localhost:7001/auth/me \
  -H 'Authorization: Bearer <token>'
```

Agents example:

```bash
curl "http://localhost:7001/agents?q=analyst&category=Analytics&tags=data,analysis&sort=createdAt&order=desc&page=1&limit=20"
```

```bash
curl "http://localhost:7001/agents/leaderboard?metric=revenue&limit=5"
```

Dashboard example:

```bash
curl "http://localhost:7001/dashboard/overview?range=7d" \
  -H 'Authorization: Bearer <token>'
```

```bash
curl "http://localhost:7001/dashboard/earnings?range=30d&groupBy=day" \
  -H 'Authorization: Bearer <token>'
```

Swagger docs:
- `http://localhost:7001/api/docs`
