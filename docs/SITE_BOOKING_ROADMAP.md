# Site Booking Roadmap (Phase S10)

Статус: **ACTIVE**Дата: 2026-04-27 Автор: claude-code Связано: `docs/growth/GROWTH_AUDIT_ROADMAP_2026-04-27.md` (codex audit), `EasyCamp-Teplo/docs/guest/GUEST_SELF_SERVICE_ROADMAP.md` (бот self-service).

Цель: сквозное бронирование — гость заполняет форму на сайте, заявка попадает в БД EasyCamp как `Booking(status=NEW, source=DIRECT)`и админ получает Telegram-уведомление в течение секунды. Никакой тихой потери лидов и никакого второго CRM.

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

## 1. Phase S10 — Сквозное бронирование (P0, сегодня)

### S10.1 — EasyCamp: `POST /api/leads` (token-protected)

- \[ \] Новый файл `EasyCamp-Teplo/app/api/site_leads.py`.
- \[ \] Pydantic схема `SiteLeadCreate`: `guest_name`, `guest_phone`, `check_in`, `check_out`, `guests_count`, `house_name?`, `comment?`, `source` (default `website`), `external_ref?` (id заявки на сайте, для идемпотентности).
- \[ \] Обязательный header `X-Site-Token`. Проверка через `settings.site_lead_token`. Если не совпало — 401.
- \[ \] Резолвинг house: если `house_name` дан — find by `name ILIKE %x%`, иначе оставить `house_id=None` (но фолбэк недопустим — без `house_id` нельзя создать бронь). Стратегия: если не найден — берём первый дом из `Houses` (best-effort) и помечаем в комментарии «house resolution: fallback».
- \[ \] Идемпотентность: если `external_ref` совпал с `Booking.external_id`и `source=DIRECT` — возвращаем существующий, не дублируем.
- \[ \] Создаём `Booking(status=NEW, source=DIRECT, external_id=external_ref)`через `BookingService.create_booking`.
- \[ \] Telegram-уведомление админам с inline-кнопкой `Подтвердить`/`Отклонить` (reuse паттерн из `guest_booking.py`).
- \[ \] Подключить роутер в `app/main.py`.
- \[ \] Тесты: token обязателен, идемпотентность, fallback-house, success.

### S10.2 — Site API: forward в EasyCamp

- \[ \] Добавить `httpx` в `api/requirements.txt`.
- \[ \] Env-vars: `EASYCAMP_LEAD_URL`, `EASYCAMP_LEAD_TOKEN`. Default-ы безопасные (если не заданы — forward отключён, работает как сейчас, без падения).
- \[ \] В `create_booking_request`: после локального commit, вызов `httpx.AsyncClient.post(url, json={...}, headers={X-Site-Token})`с timeout 5s. Best-effort: ошибки логируем, локальный лид остаётся.
- \[ \] Расширить `BookingRequest`: новые столбцы `forwarded_at` (DateTime, nullable), `forwarded_status` (String, nullable: `ok`/`error`/`disabled`), `easycamp_booking_id` (Int, nullable).
- \[ \] Миграция Alembic — у сайта Alembic'а нет, текущая модель создаётся через `Base.metadata.create_all`. Для существующего Postgres'а на FI потребуется ручной `ALTER TABLE` ИЛИ дроп + пересоздание (если данных нет — простейший путь). Зафиксировать в roadmap deploy-стратегию.
- \[ \] Тесты: forward вызван с правильным payload + token, ошибка forward не валит локальный insert.

### S10.3 — Frontend: реальный сабмит

- \[ \] `booking.js`: заменить `setSent(true)` на:
  - построить payload `{house_id?, guest_name, guest_phone, check_in, check_out, guests_count, guest_comment, source: "website"}`.
  - `fetch('/api/booking-requests', { method: 'POST', body, headers })`.
  - На 2xx: `setSent(true)`, передать `lead_id` в success card.
  - На ошибку (network/422/5xx): показать error inline, дать «попробовать ещё» + ссылку в Telegram.
- \[ \] Loading state: disable button + спиннер.
- \[ \] Сохранять UTM-параметры из URL и передавать в payload (`source`или `utm_*` в comment).
- \[ \] Минимальная защита от двойного сабмита.

### S10.4 — Тесты

- \[ \] EasyCamp: `tests/test_site_leads.py` — 4-5 кейсов через FastAPI `TestClient`:
  - 401 без токена,
  - 422 на bad payload,
  - 200 на валидный + проверка что `Booking` создан со status=NEW source=DIRECT,
  - идемпотентность по `external_ref`,
  - fallback house при отсутствующем `house_name`.
- \[ \] Site API: `api/tests/test_booking_requests.py` — 2-3 кейса:
  - локальный insert + forward вызван (mock httpx),
  - forward падает → лид всё равно сохранён локально,
  - идемпотентность по `external_id` если повторный POST.

### S10.5 — UAT (после deploy)

- \[ \] На staging/локально: открыть форму → заполнить → submit → получить «Спасибо» с lead_id.
- \[ \] В EasyCamp DB появилась `Booking(status=NEW, source=DIRECT, external_id=site:<id>)`.
- \[ \] В Telegram админ-чат прилетело уведомление с inline-кнопками.
- \[ \] Admin confirm → бронь становится CONFIRMED, гость... (для site flow гость не привязан к Telegram, поэтому уведомление гостю приходит SMS-ом или звонком от админа — описать это в текстовом ответе админа).
- \[ \] Повторный submit с тем же `external_ref` → не создаёт дубль.
- \[ \] Forward отключён (без env) → site lead всё равно сохраняется, админ видит его в site Postgres.

---

## 2. Phase S11 — Hardening (после S10)

- S11.1: миграции Alembic для site API (для безопасных будущих изменений схемы).
- S11.2: rate-limit (`slowapi` уже подключён в EasyCamp) на site и на EasyCamp `/api/leads`.
- S11.3: spam/honeypot field в форме.
- S11.4: ретрай-job для forward (если EasyCamp был недоступен — периодически дочитывать `forwarded_status='error'` и пробовать снова).
- S11.5: synch site `houses` с EasyCamp (одна правда о ценах/домах).
- S11.6: UTM-захват + Yandex.Metrica события.
- S11.7: спам-защита: reCAPTCHA или hCaptcha.

## 3. Phase S12 — UX/контент

- S12.1: 3-я карточка домика — убрать «по запросу», добавить факты.
- S12.2: расхождение цен между фронтом/API/EasyCamp — единый источник.
- S12.3: «как бронировать»-блок с шагами заявка→подтверждение→ предоплата→заезд.
- S12.4: правила и условия (отмена, дети, питомцы, шум).

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

- 2026-04-27: roadmap создан, аудит завершён, S10 запущен в работу.
- 2026-04-27: реализованы S10.1, S10.2, S10.3, S10.4:
  - **S10.1** EasyCamp `POST /api/leads`: новый router `app/api/site_leads.py`, header-token auth (`X-Site-Token`), pydantic-схема, fuzzy house resolution (id → name exact → name ILIKE → fallback к первому домику с note), идемпотентность по `external_ref` (Booking.external_id = `site:<ref>`), best-effort Telegram-уведомление с inline-кнопками `confirm/reject`. Зарегистрирован в `app/main.py`. Env: `SITE_LEAD_TOKEN`.
  - **S10.2** site API forward: `httpx`-зависимость, новый модуль `api/app/easycamp_forward.py` с `forward_lead(payload) -> ForwardResult`. Endpoint `POST /booking-requests` теперь async — после локального commit делает best-effort POST на `EASYCAMP_LEAD_URL` с `EASYCAMP_LEAD_TOKEN`. Лид всё равно сохранён локально, если EasyCamp недоступен. Расширил модель `BookingRequest` полями `forwarded_at`, `forwarded_status`, `easycamp_booking_id`, `forward_error`.
  - **S10.3** frontend: `frontend/pages/booking.js` теперь реально шлёт fetch на `${NEXT_PUBLIC_API_BASE || '/api'}/booking-requests`, показывает loading-state, error-state, success-state с `lead_id`. Имя домика всегда добавляется в `guest_comment` префиксом — даже если site API не знает house_id, EasyCamp видит выбор гостя.
  - **S10.4** тесты: `tests/test_site_leads.py` в EasyCamp (8 кейсов на in-memory async SQLite + `TestClient` поверх mini-app c одним роутером, чтобы не дёргать main app startup); `api/tests/test_booking_requests.py` в site (4 кейса с monkey-patch'ом forward на disabled / ok / error и проверкой 404 для неизвестного house_id). Все 12 тестов зелёные локально.
- Open для следующего захода:
  - S11.1 Alembic миграции для site Postgres (новые колонки в production надо добавить ALTER TABLE'ом до деплоя).
  - S11.2 rate-limit на `/booking-requests` и `/api/leads`.
  - S11.4 retry-job для `forwarded_status='error'` записей.
  - DNS/proxy publish (вне scope этого репо).
