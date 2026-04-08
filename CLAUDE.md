# teplo-v-arkhyze - Repo Guidance

## What This Repo Is

Public website and lightweight API surface for the Teplo glamping resort.

This repo is not the booking backoffice. The operational booking logic stays in `EasyCamp-Teplo`.
This repo owns the public-facing presentation layer plus the API and local Postgres runtime used by the site stack.

## Read First

Before editing anything, inspect:

1. `STATUS.md`
2. `INDEX.md`
3. `README.md`
4. `docker-compose.yml`
5. `.env.example`
6. `frontend/`
7. `api/`
8. `memory/projects/teplo-v-arkhyze.md`
9. `memory/projects/easycamp-teplo.md`

If the task touches booking integration or shared product assumptions, also inspect the related `EasyCamp-Teplo` docs first.

## Architecture Snapshot

- `frontend/` - Next.js public website
- `api/` - Python API service
- `db` - local Postgres container via Compose volume

Current compose runtime:
- `frontend` on `127.0.0.1:3000`
- `api` on `127.0.0.1:8001`
- `db` on local mapped Postgres port `5433`

This is a stateful Docker stack because the Postgres volume persists content and configuration.

## Memory Structure

This project uses the shared Obsidian memory model from `ai-infra`.

Primary durable notes:
- `memory/projects/teplo-v-arkhyze.md`
- `memory/projects/easycamp-teplo.md`
- `memory/servers/fi.md`

Use shared memory for:
- deployment facts
- architecture notes
- project-level decisions
- service placement and risk notes

Do not use shared memory for:
- raw runtime DB state
- ad-hoc debug logs
- local environment-specific temporary notes

Local runtime state outside Obsidian:
- `.env`
- Postgres data in the compose volume
- any API-side runtime data persisted in the container volume

## Deploy Shape

Current baseline:

```bash
cp .env.example .env
docker compose up -d --build
```

Operational docs for this repo live in:
- `STATUS.md`
- `INDEX.md`
- `ops/deploy.md`
- `ops/restore.md`

## High-Risk Areas

- `docker-compose.yml`
- any database-related changes in `api/`
- public API contracts between `frontend/` and `api/`
- changes that accidentally move booking/backoffice logic into this public repo

## Safe Working Rules

- Read before editing.
- Prefer small, reviewable patches.
- Do not print secrets from `.env`.
- Treat Postgres state as non-disposable.
- Keep public-site concerns separate from `EasyCamp-Teplo` operational booking logic.

## Expected Agent Behavior

When working here, first answer:
- is this a frontend task, API task, or runtime/deploy task
- what persistent state could be affected
- whether the change belongs here or in `EasyCamp-Teplo`
- how rollback would work if the change fails
