# teplo-v-arkhyze Status

Updated: 2026-04-08
Tier: Tier 2
Runs on: `FI-RZ-4`

## What This Repo Owns

- public website
- lightweight API surface
- site-local Postgres state
- public presentation and content delivery

## Runtime Shape

- `frontend/` -> Next.js public site
- `api/` -> Python API service
- `db` -> Postgres container via Docker Compose

## Production-Sensitive State

- `.env`
- Postgres volume
- API-side persisted runtime data

## High-Risk Zones

- `docker-compose.yml`
- database-related changes in `api/`
- public API contracts between `frontend` and `api`
- any accidental mixing of booking backoffice logic from `EasyCamp-Teplo`

## Current Working Rule

Enter through `STATUS.md` and `INDEX.md`, then decide whether the task belongs to the public site or the separate booking system.
