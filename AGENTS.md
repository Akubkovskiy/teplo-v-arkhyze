# Codex Repository Guidance

## Scope and read-first routing

This repository owns the public Teplo website, its API, and site-local Postgres
state. It does not own the operational booking backoffice: EasyCamp remains the
source of truth for availability, prices, reservations, and booking operations.

Before editing:

1. Read `STATUS.md` and `INDEX.md`.
2. Decide whether the task belongs to `frontend/`, `api/`, application runtime,
   or the separate edge nginx runtime, then read only that slice.
3. For database or migration work, inspect `docker-compose.yml`,
   `api/alembic.ini`, `api/alembic/`, `api/app/database.py`, `ops/backup.md`, and
   `ops/restore.md`.
4. For production work, read `ops/deploy.md`, `ops/backup.md`, and
   `ops/restore.md` before issuing server commands.
5. For availability, booking, payment, or channel-integration work, inspect the
   related EasyCamp contract and project guidance before deciding where the
   change belongs.

Do not create a second authoritative booking store in the site's Postgres
database. New booking flows must define the EasyCamp API contract, idempotency,
failure behavior, and rollback before implementation.

## State and safety

- Never print, copy into Git, or expose values from `.env`, credentials, tokens,
  certificates, or subscription URLs.
- Treat the Postgres volume and API-persisted data as non-disposable. Do not
  delete the volume for a clean start.
- The API container runs Alembic migrations during startup. Before changing or
  deploying a migration, create and verify a Postgres backup, document forward
  and rollback compatibility, and test the migration against representative
  data.
- Do not roll Postgres backward together with application code unless the target
  schema is compatible and a verified data backup exists.
- Prefer small, reviewable patches and preserve unrelated working-tree changes.

## Deployment boundaries

The application Compose project and edge nginx are separate production layers.
Do not deploy or restore them as one unit.

- For application changes, validate Compose configuration and rebuild only the
  affected `frontend` and/or `api` service. Do not include `db` unless the task
  explicitly requires it. Do not use `docker compose down` or `down -v` as a
  routine deployment step.
- The edge configuration lives outside this repository under `/root/teplo`.
  Before changing it, create a timestamped backup of its nginx and Compose
  configuration, verify the backup and hashes, validate Compose and nginx, and
  recreate only `teplo-nginx` with `--no-deps`.
- Site work must not change DNS, `XRAY_SUBSCRIPTION_URL_PREFIX`, EasyCamp state,
  or VPN containers and ports unless the task explicitly targets that separate
  system.
- Roll back the application to a known-good Git revision and recreate only the
  changed services. Roll back edge nginx only from the backup made for that
  specific change; do not assume an old forensic backup is safe.

## Verification

Run the applicable local checks:

```bash
python -m pytest -q api/tests
cd frontend
npm ci
npm run build
```

For Compose or production changes, also run `docker compose config --quiet`.
After deployment, follow `ops/deploy.md` and verify the local frontend and API,
the public site and API routes, the `www` redirect, the separate VPN hostname,
and the expected legacy-route response. Check nginx logs for new file-descriptor
or upstream-resolution errors and confirm that unrelated EasyCamp, database, and
VPN containers were not restarted.
