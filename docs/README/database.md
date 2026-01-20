# Database development

- Prisma schema: `packages/db/prisma/schema.prisma`.
- Generate client: `pnpm db:generate`.
- Migrate (dev): `pnpm db:migrate`.
- Seed: `pnpm db:seed`.

Environment variable:
- `DATABASE_URL` (set in `apps/api/.env`).
