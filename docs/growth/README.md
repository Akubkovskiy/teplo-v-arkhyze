# Growth workspace - Teplo v Arkhyze

Created: 2026-04-27
Owner: [codex]

This folder contains the working audit and growth plan for turning `teplo-v-arkhyze.ru` from a maintenance/placeholder state into a client-acquisition system for the 3 Arkhyz houses.

## Main document

- `GROWTH_AUDIT_ROADMAP_2026-04-27.md` - consolidated audit, 300k revenue model, rollout plan, marketplace/SMM plan, bot roadmap, and role split.

## Subagent drafts

- `subagents/infra-domain-audit.md` - domain, FI server, VPN/proxy risk, safe rollout and rollback.
- `subagents/site-ux-conversion-audit.md` - site UX, SEO, booking form, content and conversion audit.
- `subagents/marketplaces-smm-plan.md` - Avito, Yandex, Sutochno.ru, Ostrovok/Bronevik, channel manager and SMM plan.
- `subagents/revenue-model-300k.md` - ADR, occupancy, commissions, pricing ladder and 300k scenarios.

## Immediate P0

1. Do not change shared `vpnbot` proxy or root domain without a tested rollback.
2. Publish the real Next.js site through an isolated nginx `server_name` path, first on a staging subdomain.
3. Make the booking form actually create a lead in the source-of-truth booking system.
4. Prepare verified photos, prices, rules and reviews before scaling paid traffic.
5. Use Avito as the main acquisition channel, then Yandex Business/Maps, then Sutochno/Yandex Travel/Ostrovok after calendar discipline is stable.
