# Database development

- Prisma schema: `packages/db/prisma/schema.prisma`.
- Start local services: `docker compose up -d`.
- Generate client: `pnpm db:generate`.
- Migrate (dev): `pnpm db:migrate`.
- Seed: `pnpm db:seed`.
- Run seed tests: `pnpm --filter @agent-marketplace/db test`.

Environment variable:

- `DATABASE_URL` (set in `packages/db/.env`; copy from `packages/db/.env.example`).

Database migrations:

- Prisma runs from `packages/db`, so it requires `DATABASE_URL` in `packages/db/.env` (or export it in the shell).
- Non-interactive migrate example: `pnpm --filter @agent-marketplace/db db:migrate -- --name init_schema`.
