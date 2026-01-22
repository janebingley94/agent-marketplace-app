# Changelog

## v0.1.0 - 2026-01-22

### Added
- Marketplace, Agent Detail, Studio, Wallet, Dashboard, Bills, and DAO pages aligned with design snapshots.
- Auth flow with SIWE, agents CRUD API, dashboard analytics endpoints, and Swagger documentation.
- Frontend component tests for key UI modules.
- API e2e tests for auth and agents CRUD (mocked providers for isolation).
- OpenTelemetry bootstrap (optional via environment variables).

### Known Issues
- Some UI pages use mock data until backend endpoints are finalized.
- API e2e tests use in-memory service mocks for determinism rather than a real database.
- TypeScript peer dependency warnings from wagmi/viem tooling in the web workspace.
