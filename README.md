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
