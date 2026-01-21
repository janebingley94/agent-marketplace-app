# Backend development

- Framework: NestJS.
- App entry: `apps/api/src/main.ts`.
- Dev command: `pnpm --filter @agent-marketplace/api dev`.
- Health check: `GET /health` on `http://localhost:7001`.

Database migrations:
- Prisma runs from `packages/db`, so it requires `DATABASE_URL` in `packages/db/.env` (or export it in the shell).
- Non-interactive migrate example: `pnpm --filter @agent-marketplace/db db:migrate -- --name init_schema`.

Auth module:
- Nonce: `POST /auth/nonce`
- Verify: `POST /auth/verify`
- Current user: `GET /auth/me` (Bearer token)

Agents module:
- List: `GET /agents`
- Detail: `GET /agents/:slug`
- Create: `POST /agents` (Bearer token)
- Update: `PATCH /agents/:id` (Bearer token)
- Delete: `DELETE /agents/:id` (Bearer token)
- Leaderboard: `GET /agents/leaderboard`

Dashboard module:
- Overview: `GET /dashboard/overview` (Bearer token)
- Earnings: `GET /dashboard/earnings` (Bearer token)
- Agents distribution: `GET /dashboard/agents` (Bearer token)

API docs:
- Swagger UI: `http://localhost:7001/api/docs`
