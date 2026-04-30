# Graph Report - C:\Users\kubko\projects\teplo-v-arkhyze  (2026-04-30)

## Corpus Check
- 184 files · ~0 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 184 nodes · 270 edges · 10 communities detected
- Extraction: 84% EXTRACTED · 16% INFERRED · 0% AMBIGUOUS · INFERRED: 44 edges (avg confidence: 0.68)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Site API Roadmap Teplo  Teplo Site UIUX and Deploy Roadmap|Site API Roadmap Teplo / Teplo Site UI/UX and Deploy Roadmap]]
- [[_COMMUNITY_test_booking_requests.py  House|test_booking_requests.py / House]]
- [[_COMMUNITY_Growth Audit Roadmap 2026-04-27  Marketplaces and SMM Plan Subagent|Growth Audit Roadmap 2026-04-27 / Marketplaces and SMM Plan Subagent]]
- [[_COMMUNITY_S2S3 Page Checklist  Photo to Page Matrix (v2 final draft)|S2/S3 Page Checklist / Photo to Page Matrix (v2 final draft)]]
- [[_COMMUNITY_Teplo Glamping Public Website  API Python Dependencies (requirements.txt)|Teplo Glamping Public Website / API Python Dependencies (requirements.txt)]]
- [[_COMMUNITY_main.py  easycamp_forward.py|main.py / easycamp_forward.py]]
- [[_COMMUNITY_Site+API Execution Checklist  API Endpoint POST booking-requests|Site+API Execution Checklist / API Endpoint: POST /booking-requests]]
- [[_COMMUNITY_Site Booking Roadmap Phase S10  EasyCamp POST apileads Endpoint|Site Booking Roadmap Phase S10 / EasyCamp POST /api/leads Endpoint]]
- [[_COMMUNITY_conftest.py  Pytest setup for site API tests.  Uses in-memory SQLite + FastAPI TestClient. Ov|conftest.py / Pytest setup for site API tests.  Uses in-memory SQLite + FastAPI TestClient. Ov]]
- [[_COMMUNITY_teplo-v-arkhyze README|teplo-v-arkhyze README]]

## God Nodes (most connected - your core abstractions)
1. `Growth Audit Roadmap 2026-04-27` - 16 edges
2. `Site API Roadmap Teplo` - 13 edges
3. `Site+API Execution Checklist` - 12 edges
4. `S2/S3 Page Checklist` - 10 edges
5. `House` - 9 edges
6. `Photo to Page Matrix (v2 final draft)` - 9 edges
7. `Marketplaces and SMM Plan Subagent` - 9 edges
8. `BookingRequest` - 8 edges
9. `Teplo Glamping Public Website` - 8 edges
10. `Photo Production Brief (Nano Banana AI generation)` - 8 edges

## Surprising Connections (you probably didn't know these)
- `startup()` --calls--> `get_db()`  [INFERRED]
  api\app\main.py → api\app\database.py
- `create_booking_request()` --calls--> `forward_lead()`  [INFERRED]
  api\app\main.py → api\app\easycamp_forward.py
- `startup()` --calls--> `House`  [INFERRED]
  api\app\main.py → api\app\models.py
- `create_booking_request()` --calls--> `BookingRequest`  [INFERRED]
  api\app\main.py → api\app\models.py
- `Создаёт локальный лид + best-effort forward в EasyCamp.` --uses--> `House`  [INFERRED]
  api\app\main.py → api\app\models.py

## Hyperedges (group relationships)
- **Docker Compose Stack (frontend + api + db)** — service_frontend, service_api, service_db [EXTRACTED 1.00]
- **API MVP Endpoints** — api_endpoint_health, api_endpoint_houses, api_endpoint_booking_post, api_endpoint_booking_get [EXTRACTED 1.00]
- **All Public Site Pages** — page_home, page_houses, page_booking, page_activities, page_region, page_reviews, page_contacts [EXTRACTED 1.00]
- **Launch Blockers (Alexey Inputs Required)** — content_blocker_photo_p1, content_blocker_cabin_params, content_blocker_contacts [EXTRACTED 1.00]
- **Python API Technology Stack** — dep_fastapi, dep_uvicorn, dep_sqlalchemy, dep_psycopg, dep_pydantic, dep_httpx [EXTRACTED 1.00]
- **Photo Production and Placement Pipeline** — photo_yandex_disk_source, photo_audit, photo_page_matrix, photo_production_brief [EXTRACTED 1.00]
- **Completed Execution Stages (E0-E5)** — exec_stage_e0, exec_stage_e1, exec_stage_e2, exec_stage_e3, exec_stage_e5 [EXTRACTED 1.00]
- **Pending Execution Stages (E6-E7)** — exec_stage_e6, exec_stage_e7 [EXTRACTED 1.00]
- **Teplo Site and API MVP Tech Stack** — nextjs_frontend_stack, fastapi_backend_stack, site_api_roadmap, ops_deploy [EXTRACTED 1.00]
- **End-to-End Booking Flow Chain** — booking_form_p0_bug, site_api_forward_layer, easycamp_leads_endpoint, easycamp_source_of_truth [EXTRACTED 1.00]
- **Growth Marketplace Channel Plan** — avito_channel, yandex_business_channel, yandex_travel_channel, sutochno_channel, ostrovok_bronevik_channel, channel_manager_decision [EXTRACTED 1.00]
- **Revenue Model and Pricing Cluster** — revenue_model_300k, pricing_ladder, house_forest_34, house_family_40, house_compact_32, kpi_north_star [EXTRACTED 1.00]
- **Infra Safety and Deploy Constraints** — vpnbot_nginx_constraint, override_conf_deploy_strategy, fi_rz4_server, domain_teplo_v_arkhyze_ru, rollback_procedure, ops_deploy, ops_restore, ops_backup [EXTRACTED 0.95]
- **Growth Roadmap Phase Sequence** — growth_phase0_freeze_risk, growth_phase1_stop_losing_leads, growth_phase2_public_site_launch, growth_phase3_trust_conversion, growth_phase4_avito_sprint, growth_phase5_local_seo, growth_phase6_ota_expansion, growth_phase7_bot_operator [EXTRACTED 1.00]
- **Site Development Phase Sequence E0-E7** — phase_e0_infra_baseline, phase_e1_front_scaffold, phase_e2_api_scaffold, phase_e3_booking_flow_mvp, phase_e4_routing_domain, phase_e5_admin_mvp, phase_e6_hardening, phase_e7_uat_launch [EXTRACTED 1.00]
- **Booking Roadmap S10-S12 Phase Sequence** — phase_s10_end_to_end_booking, phase_s11_hardening, phase_s12_ux_content [EXTRACTED 1.00]
- **Testing Stack Five Tracks** — testing_t1_api_smoke, testing_t2_ui_e2e, testing_t3_performance, testing_t4_security, testing_t5_visual_regression [EXTRACTED 1.00]
- **Growth Audit Subagent Output Set** — subagent_infra_domain, subagent_marketplaces_smm, subagent_revenue_300k, subagent_site_ux, growth_audit_roadmap [EXTRACTED 1.00]

## Communities

### Community 0 - "Site API Roadmap Teplo / Teplo Site UI/UX and Deploy Roadmap"
Cohesion: 0.07
Nodes (34): Domain teplo-v-arkhyze.ru, FastAPI Backend Tech Stack, FI-RZ-4 Production Server, Growth Phase 2 Safe Public Site Launch, Next.js Frontend Tech Stack, Ops Backup Guide, Ops Deploy Guide, Ops Restore Guide (+26 more)

### Community 1 - "test_booking_requests.py / House"
Cohesion: 0.17
Nodes (23): create_booking_request(), Создаёт локальный лид + best-effort forward в EasyCamp., AdminAuditLog, BookingRequest, House, BookingRequestCreate, BookingRequestOut, Config (+15 more)

### Community 2 - "Growth Audit Roadmap 2026-04-27 / Marketplaces and SMM Plan Subagent"
Cohesion: 0.13
Nodes (26): Avito Marketplace Channel, Channel Manager Decision Bnovo TravelLine, Growth Audit Roadmap 2026-04-27, Growth Phase 0 Freeze Risk Surface, Growth Phase 3 Trust and Conversion Foundation, Growth Phase 4 Avito Growth Sprint, Growth Phase 5 Local SEO and Yandex, Growth Phase 6 Sutochno and OTA Expansion (+18 more)

### Community 3 - "S2/S3 Page Checklist / Photo to Page Matrix (v2 final draft)"
Cohesion: 0.23
Nodes (19): Third Cabin (Avito ID 3792037514) — Missing Data, Content Blocker: Cabin Commercial Parameters, Content Blocker: Public Contacts Confirmation, Content Blocker: P1 Photo Package, Content Requirements for Launch, Next Actions from Alexey (Launch Finalization), Site Page: Activities (/activities), Site Page: Booking (/booking) (+11 more)

### Community 4 - "Teplo Glamping Public Website / API Python Dependencies (requirements.txt)"
Cohesion: 0.14
Nodes (18): API Python Dependencies (requirements.txt), Architecture Decision (2026-02-28), teplo-v-arkhyze Index, teplo-v-arkhyze Status, teplo-v-arkhyze Repo (CLAUDE.md), FastAPI 0.116.1, HTTPX 0.28.1, Psycopg3 (binary) 3.2.9 (+10 more)

### Community 5 - "main.py / easycamp_forward.py"
Cohesion: 0.21
Nodes (6): get_db(), _config(), forward_lead(), ForwardResult, Forward booking-request lead to EasyCamp `/api/leads`.  Best-effort: ошибки логи, startup()

### Community 6 - "Site+API Execution Checklist / API Endpoint: POST /booking-requests"
Cohesion: 0.17
Nodes (12): API Endpoint: GET /booking-requests/{id}, API Endpoint: POST /booking-requests, API Endpoint: GET /health, API Endpoint: GET /houses, Execution Stage E0: Infra baseline, Execution Stage E2: API models + booking endpoint, Execution Stage E3: Front booking flow, Execution Stage E4: Reverse-proxy subdomain (in progress) (+4 more)

### Community 7 - "Site Booking Roadmap Phase S10 / EasyCamp POST /api/leads Endpoint"
Cohesion: 0.36
Nodes (9): Booking Form P0 Silent Lead Loss Bug, EasyCamp POST /api/leads Endpoint, EasyCamp Booking Source of Truth, Growth Phase 1 Stop Losing Leads, Phase S10 End-to-End Booking, Phase S11 Hardening, Phase S12 UX and Content, Site API Forward Layer to EasyCamp (+1 more)

### Community 9 - "conftest.py / Pytest setup for site API tests.  Uses in-memory SQLite + FastAPI TestClient. Ov"
Cohesion: 1.0
Nodes (1): Pytest setup for site API tests.  Uses in-memory SQLite + FastAPI TestClient. Ov

### Community 22 - "teplo-v-arkhyze README"
Cohesion: 1.0
Nodes (1): teplo-v-arkhyze README

## Knowledge Gaps
- **44 isolated node(s):** `Forward booking-request lead to EasyCamp `/api/leads`.  Best-effort: ошибки логи`, `Config`, `Pytest setup for site API tests.  Uses in-memory SQLite + FastAPI TestClient. Ov`, `teplo-v-arkhyze Index`, `teplo-v-arkhyze README` (+39 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **Thin community `conftest.py / Pytest setup for site API tests.  Uses in-memory SQLite + FastAPI TestClient. Ov`** (2 nodes): `conftest.py`, `Pytest setup for site API tests.  Uses in-memory SQLite + FastAPI TestClient. Ov`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `teplo-v-arkhyze README`** (1 nodes): `teplo-v-arkhyze README`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.