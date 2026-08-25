# Site Booking Roadmap (S10 → S12 + Unified Pricing)

Статус: **S10/S11/S12 COMPLETE, Unified Pricing DEPLOYED**
Дата: 2026-04-27 (создан) → 2026-05-01 (все фазы закрыты)
Автор: claude-code
Связано: `docs/growth/GROWTH_AUDIT_ROADMAP_2026-04-27.md` (codex audit), `EasyCamp-Teplo/docs/guest/GUEST_SELF_SERVICE_ROADMAP.md` (бот self-service).

Цель: сквозное бронирование — гость заполняет форму на сайте, заявка попадает в БД EasyCamp как `Booking(status=NEW, source=DIRECT)` и админ получает Telegram-уведомление в течение секунды. Никакой тихой потери лидов и никакого второго CRM.

**Итог:** все фазы задеплоены на production 2026-05-01. EasyCamp = единый источник правды для цен и бронирований. Сайт показывает живые цены, динамически считает стоимость при выборе дат. Aggregator-ready API (`/api/houses/{id}/availability`) готов для будущих OTA-интеграций.

---

## 0. Аудит booking-флоу — что есть сейчас

### Frontend (`frontend/pages/booking.js`)

- Форма: домик, имя, телефон, даты, гости, комментарий.
- Валидация телефона + дат — клиентская.
- `submit()` делает только `setSent(true)` — **никакого сетевого вызова**.
- Success-экран показывает «Спасибо за заявку» и ссылки на бот/админа.
- **Любой лид с сайта теряется молча.** P0-блокер для платного трафика.

### Site API (`api/app/main.py`, FastAPI на порту 8001)

- Эндпоинт `POST /booking-requests` существует и работает: пишет `BookingRequest(status='new', source='website')` в локальный Postgres.
- **Frontend его не зовёт.** Он мёртвый.
- Модель `BookingRequest` независимая от `Booking` в EasyCamp.
- `GET /houses` возвращает 2 seed'а — Forest 34м² и Family 40м² — и расходится с фронтом (там 3 домика, у третьего «по запросу»).

### EasyCamp (отдельный репо, SQLite на FI)

- `Booking` модель (другая схема, FK к `House`, `BookingService`).
- `BookingService.create_booking(BookingCreate)` с overlap-гардом + Avito block + sheets sync — продакшн-готовая.
- `app/main.py` имеет FastAPI, но НЕТ публичного `/api/leads`эндпоинта для внешних источников.
- Существует Telegram-бот с авторизованными админами (`get_all_users()`
  - `settings.telegram_chat_id`).

### Расхождения

- `BookingRequest` (site) и `Booking` (EasyCamp) живут в разных БД, никак не синхронизированы.
- Цены и список домиков на фронте, в site API и в EasyCamp DB расходятся — это P0 для роста, но в bookin-флоу мы примем «source of truth = EasyCamp DB» и оставим site-копии справочными.
- House mapping: site front использует id 1/2/3, site API — slug'и forest-34/family-40, EasyCamp — динамические `House.name`. Нужен слой fuzzy-маппинга (по имени), либо передаём имя домика «как есть» и EasyCamp ищет по `name LIKE %x%`.

---

## 1. Phase S10 — Сквозное бронирование ✅ DEPLOYED 2026-05-01

### S10.1 — EasyCamp: `POST /api/leads` (token-protected) ✅

- [x] `EasyCamp-Teplo/app/api/site_leads.py` — header-token auth, pydantic-схема, house resolution (id → name → ILIKE → fallback), идемпотентность по `external_ref`, Telegram-уведомление с inline-кнопками confirm/reject.
- [x] Callback-хендлеры `site_lead:confirm:*` и `site_lead:reject:*` в `guest_booking.py`.
- [x] Тесты: 8 кейсов в `tests/test_site_leads.py`.

### S10.2 — Site API: forward в EasyCamp ✅

- [x] `api/app/easycamp_forward.py` — best-effort POST с `house_id` в payload.
- [x] `BookingRequest` расширена полями `forwarded_at`, `forwarded_status`, `easycamp_booking_id`, `forward_error`.
- [x] Тесты: 4 кейса в `api/tests/test_booking_requests.py`.

### S10.3 — Frontend: реальный сабмит ✅

- [x] `booking.js` — fetch на `/api/booking-requests`, loading/error/success states, lead_id в success card.

### S10.4 — Тесты ✅

- [x] Все 12 тестов зелёные (8 EasyCamp + 4 site).

### S10.5 — UAT ✅

- [x] End-to-end через публичный URL: форма → success → `forwarded_status=ok` → EasyCamp Booking(NEW, DIRECT) → Telegram-уведомление.
- [x] Duplicate POST → 409 (overlap guard).
- [x] Admin confirm/reject через inline-кнопки работает.

---

## 2. Phase S11 — Hardening ✅ DEPLOYED 2026-05-01

- [x] **S11.1** Alembic baseline migration (idempotent `0001_baseline.py`).
- [x] **S11.2** Rate-limit: `5/min` POST /booking-requests, `30/min` GET /houses.
- [x] **S11.3/S11.7** Honeypot: hidden `website` field, silent discard on frontend + API.
- [x] **S11.4** Retry-job: APScheduler 300s interval, max 3 retries → `abandoned`.
- [x] **S11.5** House sync — частично: `house_id` передаётся напрямую (fix от 2026-05-01), косметическая разница в именах осталась (функционально не критична).
- [x] **S11.6** UTM-захват: frontend reads `utm_source/medium/campaign/term/content` → comment prefix.

## 3. Phase S12 — UX/контент ✅ DEPLOYED 2026-05-01

- [x] **S12.1** 3-й домик `compact-32` (id=3, capacity=4, base_price=4500) — второй домик той же модели, что и `forest-34`; slug сохранён для совместимости с существующими заявками.
- [x] **S12.2** Единые цены — **решено через Unified Pricing** (см. раздел ниже).
- [x] **S12.3** «Как бронировать» — step-by-step блок на странице бронирования (заявка → подтверждение → предоплата → заезд).
- [x] **S12.4** Правила и условия `/rules` — отмена, заезд/выезд, дети, питомцы, тишина, территория.

## 3.1. Unified Pricing ✅ DEPLOYED 2026-05-01

EasyCamp = единый источник правды для цен. Сайт показывает живые данные.

- [x] `api/app/easycamp_prices.py` — прокси к EasyCamp API с 5-мин in-memory кешем.
- [x] `GET /houses` — мержит EasyCamp-цены (current_price, discount_percent, season_label).
- [x] `GET /houses/{id}/calculate` — проксирует расчёт стоимости проживания.
- [x] `GET /houses/{id}/prices` — проксирует прайс-календарь.
- [x] `frontend/pages/houses.js` — динамические цены + discount badges.
- [x] `frontend/pages/booking.js` — динамический расчёт при выборе дат, отображение скидок.
- [x] EasyCamp `GET /api/houses/{id}/availability` — aggregator-ready (OTA foundation для Яндекс Путешествия, Островок и т.д.).
- [x] `www.teplo-v-arkhyze.ru` → 301 redirect на bare domain (cert expanded + nginx configured).

---

## 4. Архитектурное решение

EasyCamp-Teplo — единая «source of truth» для бронирований и операций. Сайт = маркетинг + надёжный лид-капчер. site API оставляем как локальный audit + retry-буфер (если EasyCamp недоступен), но primary хранилище бронирований — `easycamp.db`.

```
┌──────────┐         ┌──────────────┐         ┌────────────────┐
│ frontend │  POST   │  site API    │  POST   │ EasyCamp /api/ │
│ booking  │────────▶│ /booking-    │────────▶│ leads          │
│ form     │         │ requests     │         │ (token auth)   │
└──────────┘         │ (Postgres)   │         └────────────────┘
                     │              │                 │
                     │ forward      │                 ▼
                     │ best-effort  │         ┌────────────────┐
                     └──────────────┘         │ Booking(NEW,   │
                                              │ source=DIRECT) │
                                              │ + Telegram     │
                                              │ admin notify   │
                                              └────────────────┘
```

## 5. Безопасность работы

Из `EasyCamp-Teplo/CLAUDE.md` и `teplo-v-arkhyze/CLAUDE.md`:

- Никаких `0.0.0.0:80/443` биндов, всё через FI nginx + override.conf.
- Не печатать секреты (`SITE_LEAD_TOKEN`, `.env`).
- Маленькие коммиты, явный rollback (env-flag `SITE_LEAD_FORWARD_ENABLED`для быстрого включения/выключения).
- Изменения в БД EasyCamp идут через `BookingService.create_booking`, а не raw SQLAlchemy в эндпоинте.

## 6. Журнал прогресса

- 2026-04-27: roadmap создан, аудит завершён, S10 код написан (S10.1–S10.4).
- 2026-05-01 01:25: **S10 deployed** — ALTER TABLE, токены, Docker network bridge, UAT green.
- 2026-05-01 01:40: **S11 deployed** — Alembic, rate-limit, retry-job, honeypot.
- 2026-05-01 09:45: **S12 (P3) deployed** — UTM capture, 3-й домик, www redirect.
- 2026-05-01 10:08: **Bugfix** — site_lead confirm/reject callback handlers + house_id в forward payload.
- 2026-05-01 10:35: **Unified Pricing deployed** — EasyCamp = единый источник цен, динамический расчёт на сайте, availability endpoint для агрегаторов.

- 2026-05-01 13:30: **S12.3 + S12.4 deployed** — «Как бронировать» step-by-step на /booking + /rules (правила и условия).

### Open

- **S11.5** Косметическая синхронизация имён домиков (EasyCamp "Дом 1/2/3" vs site "Домик в лесу 34м²") — функционально не критично, house_id резолвится напрямую.
