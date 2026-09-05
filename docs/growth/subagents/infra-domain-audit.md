# Infra/domain audit for teplo-v-arkhyze

Date: 2026-04-27
Agent: [codex] infra-domain-audit subagent
Scope: read-only audit of domain, deploy shape, shared FI/VPN risks, rollout and rollback path.

## Guardrails followed

- No VPS deploy, restart, reload, DNS, firewall, or config edits were performed.
- No secrets or raw `.env` files were read or printed.
- Write scope was limited to this file.
- `git pull` and `sync-memory.ps1 pull` were not run because the user constrained writes to this single file; those commands can modify files outside the allowed write zone.

## Files and live context read

Local/global context:

- `C:\Users\kubko\.codex\RTK.md`
- `C:\Users\kubko\projects\memory\PROJECTS.md`
- `C:\Users\kubko\projects\memory\SERVERS.md`
- `C:\Users\kubko\projects\memory\projects\teplo-v-arkhyze.md`
- `C:\Users\kubko\projects\memory\projects\easycamp-teplo.md`
- `C:\Users\kubko\projects\memory\servers\fi.md`
- `C:\Users\kubko\projects\infra\agent-map\PROJECT-CATALOG.md`
- `C:\Users\kubko\projects\infra\agent-map\SERVER-TOPOLOGY.md`

Repo-local context:

- `C:\Users\kubko\projects\teplo-v-arkhyze\CLAUDE.md`
- `C:\Users\kubko\projects\teplo-v-arkhyze\STATUS.md`
- `C:\Users\kubko\projects\teplo-v-arkhyze\INDEX.md`
- `C:\Users\kubko\projects\teplo-v-arkhyze\README.md`
- `C:\Users\kubko\projects\teplo-v-arkhyze\.env.example`
- `C:\Users\kubko\projects\teplo-v-arkhyze\docker-compose.yml`
- `C:\Users\kubko\projects\teplo-v-arkhyze\ops\deploy.md`
- `C:\Users\kubko\projects\teplo-v-arkhyze\ops\backup.md`
- `C:\Users\kubko\projects\teplo-v-arkhyze\ops\restore.md`
- `C:\Users\kubko\projects\teplo-v-arkhyze\docs\ARCHITECTURE_DECISION.md`
- `C:\Users\kubko\projects\teplo-v-arkhyze\docs\SITE_API_ROADMAP_TEPLO.md`
- `C:\Users\kubko\projects\teplo-v-arkhyze\docs\SITE_ROADMAP.md`
- `C:\Users\kubko\projects\teplo-v-arkhyze\docs\RELEASE_CANDIDATE_CHECKLIST.md`
- `C:\Users\kubko\projects\teplo-v-arkhyze\frontend\site.config.js`
- `C:\Users\kubko\projects\teplo-v-arkhyze\frontend\next.config.js`
- `C:\Users\kubko\projects\teplo-v-arkhyze\frontend\package.json`
- `C:\Users\kubko\projects\teplo-v-arkhyze\frontend\public\robots.txt`
- `C:\Users\kubko\projects\teplo-v-arkhyze\frontend\public\sitemap.xml`
- `C:\Users\kubko\projects\teplo-v-arkhyze\api\app\main.py`
- `C:\Users\kubko\projects\teplo-v-arkhyze\api\app\database.py`

Read-only live checks on FI:

- `docker ps` filtered for teplo/vpnbot/easycamp/claude containers.
- `docker compose ps` in `/root/teplo-v-arkhyze`.
- Grep for `teplo-v-arkhyze`, `site.teplo`, `api.teplo`, `claw.teplo` in `/root/vpnbot/config/{override.conf,nginx.conf,upstream.conf}`.
- Snippets from `/root/vpnbot/config/override.conf` and `/root/vpnbot/config/nginx.conf` around the teplo server blocks.
- Internal checks: `http://127.0.0.1:3000/` and `http://127.0.0.1:8001/health` from FI.
- External checks: `https://teplo-v-arkhyze.ru/` and `https://www.teplo-v-arkhyze.ru/`.

## Current topology

`teplo-v-arkhyze` runs on `FI-RZ-4` (`fin`, `144.31.185.177`), the same high-density host as ClaudeBot, legacy `vpn-bot`, EasyCamp, and shared memory. This makes FI the main blast-radius boundary for any site/domain work.

Local compose shape from repo and live FI:

- `teplo-site-frontend-1`: Next.js on `127.0.0.1:3000`.
- `teplo-site-api-1`: FastAPI on `127.0.0.1:8001`.
- `teplo-site-db-1`: Postgres 16 on `127.0.0.1:5433`.

The site stack is not directly exposed on public ports. It depends on a reverse proxy path through the existing `vpnbot` nginx/upstream stack.

## Domain and proxy state

Observed facts:

- Public `80/tcp` and `443/tcp+udp` on FI are owned by the legacy `vpnbot` stack, not by the Teplo compose project.
- `nginx.conf` has a wildcard/root server block for `*.teplo-v-arkhyze.ru` and `teplo-v-arkhyze.ru`.
- `override.conf` currently contains a `claw.teplo-v-arkhyze.ru` server block only.
- The local Teplo frontend answers internally with Next.js headers on `127.0.0.1:3000`.
- The local Teplo API answers `{"ok":true}` on `127.0.0.1:8001/health`.
- `https://teplo-v-arkhyze.ru/` currently returns a small maintenance page, not the Next.js site.
- `https://www.teplo-v-arkhyze.ru/` did not pass the external `curl -I` check in this audit.

Conclusion: the application containers are alive internally, but the public root domain is still routed through the legacy vpnbot domain block/maintenance behavior. The public site is not safely wired to the root domain yet.

## Shared domain and VPN risks

Highest risks:

- Editing `/root/vpnbot/config/nginx.conf`, `/root/vpnbot/config/upstream.conf`, or included VPN location files can break legacy VPN routing, Telegram webhook paths, auth pages, or protocol-specific paths.
- Binding the Teplo compose services directly to `0.0.0.0:80` or `0.0.0.0:443` would collide with vpnbot and can take down shared domain/VPN entrypoints.
- Changing `location /` in the existing vpnbot domain block is risky because the same wildcard/root domain block carries legacy behavior and protected paths.
- A bad nginx reload affects all traffic served by that nginx container, not only the public website.
- The Teplo stack is stateful because of the Postgres volume. `docker compose down -v`, volume recreation, or incompatible API/model changes can destroy or strand site data.
- `EasyCamp-Teplo` is a separate production booking system. Public-site growth must not move backoffice authority into this repo without an explicit integration design.
- The FI host is shared with unrelated production services, so CPU/memory/disk pressure from image builds, npm installs, or runaway logs can degrade neighboring services.

## Safer rollout strategy

Preferred approach:

1. Keep Teplo services bound to loopback/internal addresses only.
2. Publish through a new, isolated `server_name` block in `/root/vpnbot/config/override.conf`.
3. Do not edit `location.conf` or existing VPN location blocks.
4. Stage first on a subdomain such as `site.teplo-v-arkhyze.ru` and optionally `api.teplo-v-arkhyze.ru`.
5. Move root `teplo-v-arkhyze.ru` only after subdomain smoke tests prove the proxy path and app behavior.

Root-domain approach is possible, but should still be isolated in `override.conf` with a dedicated `server_name teplo-v-arkhyze.ru www.teplo-v-arkhyze.ru` block and explicit `/api/` routing to the API. It should not be implemented by mutating the shared base VPN locations.

## Safe rollout checklist

Before any VPS change:

- Get explicit owner confirmation for the exact VPS/proxy action.
- Confirm intended public shape: root domain, `www`, staging subdomain, API subdomain, or `/api/` under root.
- Snapshot current vpnbot proxy files: `override.conf`, `nginx.conf`, `upstream.conf`, and any included files that will be touched.
- Record current container state: Teplo compose, vpnbot nginx/upstream/php, EasyCamp, and disk usage.
- Confirm the Teplo Postgres backup source and restore command. Do not proceed with DB-affecting changes without this.
- Build/test the site locally or in the existing container path before proxy exposure.

Proxy rollout:

- Add only a new block in `/root/vpnbot/config/override.conf`.
- Point frontend proxy to the internal Teplo frontend address currently used by the FI setup.
- Point API proxy to the internal Teplo API address currently used by the FI setup.
- Preserve `Host`, `X-Real-IP`, `X-Forwarded-For`, and `X-Forwarded-Proto` headers.
- Run `nginx -t` inside the nginx container before reload.
- Reload nginx only after config test passes.

Post-rollout smoke:

- Check public HTML returns the Next.js site, not the maintenance page.
- Check all public pages from `RELEASE_CANDIDATE_CHECKLIST.md`.
- Check API health through the intended public route.
- Submit no real booking/payment data during smoke unless explicitly approved.
- Confirm legacy VPN entrypoints still work or at minimum that nginx/upstream containers stayed healthy and known VPN paths were not changed.
- Monitor FI container status and logs for the first minutes after reload.

## Rollback path

Fast proxy rollback:

1. Restore the previous `/root/vpnbot/config/override.conf` snapshot or remove only the newly added Teplo server block.
2. Run nginx config test inside the nginx container.
3. Reload nginx only if the test passes.
4. Verify `https://teplo-v-arkhyze.ru/` returns the prior maintenance/protected behavior.
5. Verify vpnbot nginx/upstream containers remain running.

App rollback:

1. Return `/root/teplo-v-arkhyze` to the previous known-good commit or deployment state.
2. Recreate only Teplo compose services if needed.
3. Do not remove the Postgres volume.
4. If schema/data changed, restore from the confirmed Postgres backup source before bringing the API back to production traffic.

Emergency isolation:

- Remove public proxy routing to Teplo and leave internal Teplo containers running for debugging.
- If Teplo containers are consuming host resources, stop only the Teplo compose project after confirming this will not touch vpnbot/EasyCamp containers or the Postgres volume.

## Unknowns to resolve before launch

- DNS provider/current A/AAAA/CNAME state for root, `www`, `site`, and `api`.
- Whether `www.teplo-v-arkhyze.ru` is expected to work; current external check failed.
- Certificate issuance and renewal ownership for root, `www`, `site`, and `api`.
- Exact nginx container name to use for future `nginx -t` and reload commands; docs mention an older name, live containers currently have `before-update` names.
- Canonical backup artifact path for the Teplo Postgres volume.
- Whether production should expose API as `/api/*` under root or as `api.teplo-v-arkhyze.ru`.
- Whether booking requests should remain in site-local Postgres or be proxied into `EasyCamp-Teplo` as the architecture docs suggest.
- Rate limiting, auth boundaries, and spam protection for public booking endpoints.
- Live `.env` values on FI were intentionally not read.

## Recommendation

Do not launch by replacing the current wildcard/root vpnbot domain block. Use `override.conf` as the only proxy change surface, start with a subdomain, and keep the Teplo compose project loopback-only. Treat the root-domain switch as a second step after subdomain smoke, backup confirmation, and explicit owner approval.
