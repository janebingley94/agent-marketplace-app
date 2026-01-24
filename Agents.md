# Agent Marketplace – Coding Agent Rules (Codex)

You are working in a pnpm + turbo monorepo.

## Repo basics

- Package manager: pnpm (lockfile: pnpm-lock.yaml)
- Monorepo: apps/*and packages/*
- Task runner: turbo

## Hard rules

- Never commit secrets.
- Prefer small, focused PRs.
- Keep changes within the task scope and constraints from the GitHub Issue.
- Do not refactor unrelated code unless required for the task acceptance.

## Verification (must run before finishing)

- pnpm install --frozen-lockfile
- pnpm -w turbo run lint typecheck test build

If e2e is requested by the task, follow the task instructions.

## PR Requirements

- Reference TASK_ID in PR title or body.
- Provide: change summary, verification commands output, risk + rollback.

## Commit style

- Use: "codex: <TASK_ID> <short summary>"
