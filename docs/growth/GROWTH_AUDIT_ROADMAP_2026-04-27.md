# Teplo v Arkhyze - Audit and Growth Roadmap

Date: 2026-04-27  
Owner tag: [codex]  
Scope: public website, booking funnel, domain/proxy safety, marketplaces, SMM, 300k revenue experiment, future booking bot promotion workflow.

## Executive Summary

1. Public root `https://teplo-v-arkhyze.ru/` currently returns a maintenance page, not the Next.js site.
2. DNS for root and `www` points to FI `144.31.185.177`, the same server that hosts `vpnbot`, EasyCamp, ClaudeBot and shared memory.
3. Public `80/443` are controlled by the legacy `vpnbot` nginx/upstream stack. Site launch must go through an isolated `server_name` block in `override.conf`; do not touch shared VPN location files.
4. The local site code is more than a placeholder: there are pages for home, houses, booking, contacts, reviews, region and activities.
5. The booking page is commercially unsafe right now: it validates and shows success in React, but does not send the lead to an API or EasyCamp.
6. The site has a separate FastAPI/Postgres mini-backend, while the real booking source of truth is EasyCamp-Teplo. This must be resolved before paid traffic.
7. EasyCamp already has the stronger operational core: Avito sync, bookings, admin web, cleaner flows, Google integrations and scheduler.
8. Revenue target of 300k rub/month for 3 houses is realistic as gross revenue at ADR 6,000-7,000 rub and 48-56% occupancy.
9. 300k rub/month as owner profit is a stronger target: likely needs 420-450k+ gross revenue, high ADR, fewer commissions and good weekend/holiday pricing.
10. Avito should remain the first channel, but with 3 separate listings, better photos, exact calendar discipline, fast replies and weekly paid-promo tests.
11. Yandex Business/Maps should be done immediately as trust and local-search infrastructure.
12. Sutochno.ru and Yandex Travel are phase 2 after prices, rules, calendar process and legal/classification status are clear.
13. Ostrovok/Bronevik should wait until channel-manager or manual operations are stable enough to avoid overbooking.
14. The bot should first become operationally reliable for owner, guests and cleaner, then become a promotion assistant that drafts listings, tracks channel KPIs and prompts review/content actions.
15. The safest growth path is: make lead capture reliable, launch site safely, improve trust/content, scale Avito, add local SEO, then add OTAs and automation.

## What Was Audited

Local project files:

- `CLAUDE.md`, `STATUS.md`, `INDEX.md`, `README.md`, `docker-compose.yml`, `.env.example`
- `frontend/pages/*`, `frontend/components/Layout.js`, `frontend/site.config.js`, `frontend/styles.css`
- `api/app/main.py`, `api/app/models.py`, `api/app/schemas.py`
- `ops/deploy.md`, `ops/restore.md`
- existing docs: `SITE_ROADMAP.md`, `SITE_API_ROADMAP_TEPLO.md`, `CONTENT_REQUIREMENTS.md`

Related project:

- `EasyCamp-Teplo/CLAUDE.md`, `STATUS.md`, `INDEX.md`, `app/main.py`, `app/api/houses.py`, `app/web/routers/booking_web.py`, `.env.example`
- `memory/projects/teplo-v-arkhyze.md`, `memory/projects/easycamp-teplo.md`, `memory/SERVERS.md`, `infra/agent-map/SERVER-TOPOLOGY.md`

Live/public checks:

- DNS: root and `www` resolve to `144.31.185.177`.
- `https://teplo-v-arkhyze.ru/` returns the maintenance HTML page.
- `https://www.teplo-v-arkhyze.ru/` has a certificate principal mismatch in the external curl check.
- Subagent infra check confirmed internal Teplo services are alive on FI loopback, but not wired to the root public site.

Subagent files used:

- `docs/growth/subagents/infra-domain-audit.md`
- `docs/growth/subagents/site-ux-conversion-audit.md`
- `docs/growth/subagents/marketplaces-smm-plan.md`
- `docs/growth/subagents/revenue-model-300k.md`

## Current State

### Product

The site code already has a basic product shape:

- home page with offer, hero, FAQ and CTA;
- houses page with 3 houses;
- booking form page;
- contacts and maps;
- reviews page;
- activities and region pages;
- robots and sitemap.

But the public domain still shows maintenance, so guests do not see this site.

### Conversion

The biggest conversion bug is `frontend/pages/booking.js`: submit only updates local React state and displays a success state. It does not call `POST /booking-requests`, does not notify EasyCamp, and does not create a trackable lead.

This means paid traffic today could be lost silently.

### Architecture

There are two booking-adjacent systems:

- `teplo-v-arkhyze`: public website plus its own FastAPI/Postgres booking-request API.
- `EasyCamp-Teplo`: real booking operations, Avito sync, admin web, cleaner flows, Google integrations, SQLite state.

Decision: EasyCamp should be the booking source of truth. The public site should be a marketing and lead-capture layer, not a second booking CRM.

### Domain And Shared Infra Risk

FI hosts multiple production workloads. The domain and VPN routing are coupled through `vpnbot` proxy configuration.

Hard rules:

- Do not bind Teplo compose to public `0.0.0.0:80` or `0.0.0.0:443`.
- Do not edit shared VPN `location.conf`.
- Do not mutate the base wildcard/root VPN location behavior casually.
- Use only an isolated `server_name` block in `/root/vpnbot/config/override.conf`.
- Run nginx config test before reload.
- Have a snapshot and rollback command ready before any public switch.

## Critical Risks

| Risk | Severity | Why It Matters | Control |
|---|---:|---|---|
| Root domain switch breaks VPN/proxy paths | P0 | Same FI and shared `vpnbot` nginx handle public ports | Isolated `override.conf`, staging subdomain first, nginx test, rollback snapshot |
| Booking form loses leads | P0 | User sees success but business receives nothing | Connect form to EasyCamp or a reliable API with notification and lead ID |
| Duplicate booking state | P0 | Site-local Postgres and EasyCamp can drift | EasyCamp as source of truth; site only creates lead/request |
| Marketplace overbooking | P0 | Avito/Sutochno/Yandex calendars can conflict | One calendar owner, iCal/channel manager only after mapping is tested |
| Weak trust proof | P1 | Guests compare photos, reviews, map card, rules before paying | Real reviews, Yandex card, photos per house, clear rules |
| 300k target misunderstood | P1 | Gross revenue and profit require different tactics | Track ADR, occupancy, commission, owner profit separately |
| Legal/classification gap | P1 | OTAs may require classification/registry info | Owner verifies status before hotel-style OTA launch |

## North Star And KPI

North Star Metric:

- Confirmed paid house-nights per month at profitable ADR.

Primary 60-day targets:

| KPI | Minimum | Good | Strong |
|---|---:|---:|---:|
| Gross revenue/month | 300k | 400k | 500k+ |
| Occupancy, 3 houses | 50% | 60% | 70%+ |
| ADR | 6,500 | 7,500 | 8,500+ |
| Direct share | 30% | 45% | 60% |
| Average stay | 2.2 nights | 2.8 nights | 3.5 nights |
| Commission rate | <=12% | <=9% | <=6% |
| Lead response time | <=30 min | <=10 min | <=5 min |
| Review velocity | 2/month | 4/month | 6+/month |
| Website lead conversion | 1.5% | 3% | 5%+ |
| Empty weekend nights | <=4/month | <=2/month | 0-1/month |

## Revenue Model

Inventory:

- 3 houses x 30 days = 90 available house-nights/month.

Gross revenue target:

| ADR | Nights Needed For 300k | Occupancy |
|---:|---:|---:|
| 5,500 | 54.5 | 60.6% |
| 6,000 | 50.0 | 55.6% |
| 6,500 | 46.2 | 51.3% |
| 7,000 | 42.9 | 47.6% |
| 7,500 | 40.0 | 44.4% |
| 8,500 | 35.3 | 39.2% |

Working pricing ladder:

| House | Low/weekday | Base | Weekend | Peak | Holiday/last rooms |
|---|---:|---:|---:|---:|---:|
| House 34 m2 | 5,500 | 6,500 | 7,500 | 9,000 | 11,000 |
| Family 40 m2 | 7,000 | 8,500 | 9,500 | 11,500 | 13,500 |
| Compact 32 m2 | 5,000 | 6,000 | 7,000 | 8,500 | 10,000 |

Immediate finance actions:

1. Confirm final prices for all 3 houses.
2. Remove the mismatch: frontend says 5,000/7,000, API seed says 5,500/7,500, third house says "по запросу".
3. Track revenue as: gross, channel commission, cleaning, variable cost, owner profit.
4. Build a weekly forecast: booked nights, forecast revenue, nights left to sell to reach 300k.
5. Protect weekends and holidays from excessive discounts.

## Roadmap

### Phase 0 - Freeze The Risk Surface, 1 Day

Goal: make sure growth work does not break paid services.

| Task | Owner | AI/Agent | Human/Owner | Output |
|---|---|---|---|---|
| Confirm root vs staging launch path | Owner + infra agent | Draft exact proxy plan | Approve domain path | Launch decision |
| Snapshot `vpnbot` proxy configs | Infra operator | Prepare command checklist | Approve VPS action | Rollback source |
| Confirm Teplo DB backup path | Infra/operator | Write backup checklist | Approve prod backup | No volume-loss risk |
| Confirm EasyCamp source-of-truth rule | Product/CTO | Document integration boundary | Approve | No duplicate CRM |

Do not do yet:

- No root-domain switch.
- No OTA launch.
- No paid traffic.
- No site booking form publicity until lead capture is real.

### Phase 1 - Stop Losing Leads, Days 1-7

Goal: every submitted lead reaches a reliable place.

P0 technical work:

1. Connect booking form to a real backend.
2. Preferred path: site submits to an EasyCamp public lead endpoint or a thin proxy that creates an EasyCamp booking request.
3. Minimum fallback: site-local API stores the lead and sends Telegram/admin notification, with later sync to EasyCamp.
4. Add lead ID, error state, retry state and UTM/source capture.
5. Add consent checkbox for personal data.
6. Add spam/rate-limit protection.

Content work:

1. Add "Как бронировать" block: request, confirmation, prepayment, check-in.
2. Add clear rules: check-in/out, cancellation, deposit, children, pets, smoking, parties, winter road.
3. Confirm 3rd house facts and prices.
4. Replace fake-looking reviews or mark them as pending real reviews.

Bot work:

1. Guest flow: choose dates, house, guests, contact, question.
2. Owner flow: approve/reject/ask follow-up, set status, see source and dates.
3. Cleaner flow: see checkout tasks and readiness status.
4. Admin notification: every website lead should create a Telegram alert.

### Phase 2 - Safe Public Site Launch, Days 3-14

Goal: public domain serves the real site without breaking VPN.

Steps:

1. Use staging subdomain first, for example `site.teplo-v-arkhyze.ru`.
2. Add isolated `server_name` block in `/root/vpnbot/config/override.conf`.
3. Proxy frontend to internal Teplo frontend and `/api/` to internal API or EasyCamp proxy.
4. Run nginx config test in the container.
5. Reload only after test passes and owner approves.
6. Smoke test:
   - home page;
   - houses;
   - booking form error/success;
   - contacts/maps;
   - robots/sitemap;
   - API health;
   - `vpnbot` containers still healthy.
7. Only after staging is clean, switch root `teplo-v-arkhyze.ru`.
8. Fix `www` certificate or redirect `www` to root with valid cert.

Rollback:

1. Restore previous `override.conf`.
2. Run nginx test.
3. Reload.
4. Confirm maintenance/previous behavior returns.
5. Leave Teplo containers running internally for debugging.

### Phase 3 - Trust And Conversion Foundation, Days 7-30

Goal: make visitors believe the offer and understand the next step.

Website:

- Warm visual pass: less dark tech look, more natural house-first imagery.
- Hero: product image first, not only mountains.
- Add 3-4 facts above the fold: 3 houses, 2-6 guests, 15 min to Romanтик, parking/Wi-Fi/BBQ.
- Separate page for each house.
- Real gallery: exterior, bedroom, kitchen, bathroom, terrace, parking, view.
- Real reviews with source, date, platform and rating where allowed.
- FAQ and rules page.
- Schema.org: LocalBusiness/LodgingBusiness, FAQPage, BreadcrumbList, accommodation/product pages.
- Yandex.Metrica: events for CTA, Telegram, phone, form start, form submit, form success/error.

Owner-only tasks:

- Provide photo/video package.
- Confirm legal status and classification/registry situation.
- Confirm exact rules and price ladder.
- Provide real reviews or screenshots/links.
- Confirm public address strategy: exact address public or exact pin only after booking.

### Phase 4 - Avito Growth Sprint, Days 14-45

Goal: make Avito the main measurable acquisition engine.

Setup:

- 3 separate listings, one per house.
- Consistent titles with Arkhyz, house type and differentiator.
- First 5 photos: exterior, living room, bedroom, view/terrace, bathroom/kitchen.
- Exact calendar and price matrix.
- Response templates.
- Review request template.
- Weekly competitor price check for next 3 weekends and holidays.

Paid tests:

| Test | Duration | Goal |
|---|---:|---|
| Weekend boost | Thu-Sun for 2 weeks | Fill expensive weekend gaps |
| Holiday window | 21-30 days before holidays | Protect high ADR |
| Last-minute fill | 3-5 days before empty dates | Fill otherwise empty weekdays |
| Photo order | 1 week per variant | Improve view-to-contact rate |

Metrics:

- views;
- contacts;
- requests;
- confirmed bookings;
- view-to-contact;
- contact-to-booking;
- response time;
- net ADR after commission;
- cancellation/refusal rate.

### Phase 5 - Local SEO And Yandex, Days 14-45

Goal: make the object trustworthy outside Avito.

1. Create or claim Yandex Business/Maps card.
2. Add category, geo, phone, website, photos, services and Q&A.
3. Add review reply process.
4. Add route intent tracking.
5. Register in Yandex Webmaster and submit sitemap.
6. Prepare Yandex Travel only after legal/classification and calendar process are clear.

Source note: Yandex Travel partner docs say hotels, holiday homes, camp sites and daily-rent objects can connect, with Extranet or supported channel managers, and registration may require classification/registry information depending on object type.

### Phase 6 - Sutochno And OTA Expansion, Days 31-90

Goal: add channels without creating operational chaos.

Order:

1. Sutochno.ru after Avito calendar process is stable.
2. Yandex Travel after legal/classification check.
3. Channel manager decision after 3+ active external channels or owner time cost becomes painful.
4. Ostrovok/Bronevik only after object type and documents fit.

Channel manager decision:

- Manual cabinets are OK for 1-2 extra channels.
- Bnovo/TravelLine become useful when manual calendar updates create measurable overbooking risk.
- Do not buy PMS/channel manager just for status.

### Phase 7 - Bot As Operator And Promotion Assistant, Days 30-120

Goal: the bot helps run the business, then helps promote it.

Guest side:

- Check available dates.
- Ask for price.
- Choose house.
- Send documents/rules.
- Get route/check-in info.
- Ask common questions.
- Leave review after checkout.

Owner/admin side:

- New lead alert with source, dates, house, guests, phone, UTM.
- Approve, reject, ask follow-up.
- Convert lead to booking.
- Change status.
- See daily/weekly occupancy and revenue forecast.
- See "nights left to 300k".

Cleaner side:

- Checkout list.
- Cleaning task with deadline.
- House readiness status.
- Photo confirmation if useful.
- Issue report.

Promotion assistant:

- Weekly Avito/Sutochno/Yandex metrics digest.
- Suggest price changes for empty dates.
- Draft listing titles/descriptions.
- Generate post captions from owner photos.
- Remind owner to ask reviews.
- Prepare content calendar.
- Flag mismatch between website, Avito and real rules.

Important boundary:

- Bot can suggest promotions and draft content.
- Owner approves prices, discounts, legal claims, paid budgets and platform publication.

## Specialist/Subagent Operating Model

| Specialist | What They Own | Current Output | Next Task |
|---|---|---|---|
| Infra/domain specialist | FI, DNS, nginx, rollback, shared VPN safety | `subagents/infra-domain-audit.md` | Prepare exact staging-domain runbook |
| Site/UX/SEO specialist | Website conversion, SEO, content proof, analytics | `subagents/site-ux-conversion-audit.md` | Convert P0 fixes into implementation issues |
| Marketplace/SMM specialist | Avito, Yandex, Sutochno, OTA, content calendar | `subagents/marketplaces-smm-plan.md` | Draft 3 Avito listing variants |
| Finance/revenue analyst | ADR, occupancy, pricing, profit model | `subagents/revenue-model-300k.md` | Build weekly revenue dashboard template |
| Bot architect | EasyCamp guest/admin/cleaner flows | This master roadmap | Design lead-to-booking flow |
| Owner | Legal status, photos, prices, rules, final approvals | Pending | Provide facts and approve launches |

## Responsibility Split

### AI/Agents Can Do

- Audit code, docs, domain/proxy shape.
- Draft website copy, listings, FAQ and message templates.
- Build analytics plan and dashboards.
- Implement site and bot code after owner approves scope.
- Compare platform requirements and prepare checklists.
- Produce weekly channel reports from exported stats/screenshots.
- Generate SMM calendar and captions.

### Human Operator Or Channel Specialist Can Do

- Publish marketplace listings in real accounts.
- Monitor moderation and platform warnings.
- Keep calendars synchronized.
- Reply to guests using approved templates.
- Escalate disputes or cancellations.

### Only Owner Should Do

- Approve VPS state-changing actions, reloads, deploys and DNS changes.
- Confirm legal/tax/classification status.
- Sign platform contracts or accept offers.
- Set final prices, deposits, discounts and cancellation rules.
- Provide real photos/videos and approve public claims.
- Approve paid promotion budgets.
- Decide exceptions for guests.

## Immediate Backlog

| Priority | Task | Owner | Why |
|---|---|---|---|
| P0 | Decide staging subdomain and root launch path | Owner + infra | Prevent VPN/domain breakage |
| P0 | Implement real booking lead capture | Site/API + EasyCamp | Stop silent lead loss |
| P0 | Add admin Telegram notification for website leads | Bot/API | Fast response increases conversion |
| P0 | Confirm 3rd house facts and price | Owner | Listings/site cannot scale with "по запросу" |
| P0 | Add analytics events and UTM capture | Site | Growth without measurement is blind |
| P1 | Build photo package for 3 houses | Owner + AI brief | Trust and Avito CTR |
| P1 | Rewrite hero and CTA around "check dates" | Site/UX | Increase intent clarity |
| P1 | Create Yandex Business card | Owner + agent | Local search trust |
| P1 | Rebuild Avito listings | Marketplace agent + owner | Main demand channel |
| P1 | Add real reviews and review flow | Owner + bot | Trust and ranking |
| P2 | Separate house pages | Site/SEO | SEO and conversion |
| P2 | Calendar availability from EasyCamp | Bot/API | Reduce friction and questions |
| P2 | Sutochno launch | Channel operator | Extra demand |
| P2 | Yandex Travel readiness | Owner + channel | OTA scale |
| P3 | Channel manager evaluation | Owner + analyst | Avoid overbooking at scale |
| P3 | Ostrovok/Bronevik | Owner + channel | Broader OTA after readiness |

## Owner Checklist For Tonight

Bring or confirm:

1. Final names of all 3 houses.
2. Capacity, beds, rooms and square meters for each house.
3. Prices: weekday, weekend, holiday, minimum stay, extra guest, cleaning/deposit.
4. Rules: pets, children, smoking, parties, quiet hours, check-in/out, cancellation.
5. Current Avito listing IDs and access status.
6. Real reviews: screenshots/links/text with source and date.
7. Best photo folder or which photos are final.
8. Whether public exact address is OK or exact pin only after booking.
9. Legal status: individual/self-employed/IP/company, classification/registry status if known.
10. Whether the bot should first focus on guest booking, admin control or cleaner workflow.

## External Sources Checked

- Yandex Travel partner eligibility and channel managers: https://travel.yandex.ru/pro/kto-mozhet-sotrudnichat-s-servisom-yandeks-puteshestviya/
- Yandex Travel direct Extranet registration: https://travel.yandex.ru/pro/kak-zaregistrirovatsya-v-ekstranete-napryamuyu-bez-partnyora/
- Yandex Travel partner account/Extranet: https://yandex.ru/support/travel-partners/ru/hotel-account
- Sutochno.ru owner listing help: https://sutochno.ru/help/arendodateli/public
- TravelLine Ostrovok channel setup: https://www.travelline.ru/support/knowledge-base/kak-podklyuchit-ostrovok-v-tl-channel-manager/
- Bnovo Channel Manager: https://bnovo.ru/channel-manager/
- Yandex Direct hotel promotion article, 2026: https://direct.yandex.ru/base/articles/reklama-gostinicy-i-otelya
- Government classification documents: https://government.ru/docs/all/157162/ and https://government.ru/docs/all/157184/
- Avito Travel market/news context: https://www.bfm.ru/news/582855

## Decision

Start with safety and lead capture, not visual polish. The business does not need a prettier placeholder; it needs a safe public launch, a reliable lead path into EasyCamp, and a measured Avito-first sales loop. Visual/SEO/SMM work should support that loop, not distract from it.
