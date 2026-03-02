# teplo-v-arkhyze — Детальный роудмап сайта (UI/UX + деплой)

> Дата создания: 2026-03-02
> Базовый роудмап (E0–E7, инфра): `SITE_API_ROADMAP_TEPLO.md`
> Тестирование: `TESTING_STACK_ROADMAP.md`

## Текущий статус проекта (2026-03-02)

| Этап | Статус | Детали |
|---|---|---|
| E0 Infra baseline | ✅ | vpnbot snapshot, compose setup |
| E1 Front scaffold | ✅ | Next.js + base page + form |
| E2 API scaffold | ✅ | FastAPI + PostgreSQL + booking-requests |
| E3 Booking flow MVP | ✅ | Форма отправляет заявку в API |
| **E4 Routing (домен)** | ⚠️ частично | `claw.*` работает, **root `teplo-v-arkhyze.ru` → frontend НЕ настроен** |
| E5 Admin MVP | ✅ | Просмотр заявок, смена статуса |
| E6 Hardening | ❌ | Не начат |
| E7 UAT + launch | ❌ | Не начат |

### Что нужно сделать ПРЯМО СЕЙЧАС чтобы увидеть сайт

Добавить в `/root/vpnbot/config/override.conf` server block:
```nginx
server {
  listen 10.10.0.2:443 ssl http2 proxy_protocol;
  listen 10.10.1.2:443 ssl http2;
  server_name teplo-v-arkhyze.ru www.teplo-v-arkhyze.ru;
  ssl_certificate     /certs/cert_public;
  ssl_certificate_key /certs/cert_private;
  access_log /logs/nginx_teplo_access;

  location /api/ {
    proxy_pass http://10.10.0.1:8001/;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-Proto https;
  }

  location / {
    proxy_pass http://10.10.0.1:3000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-Proto https;
  }
}
```
Затем: `docker exec nginx-2.28.1 nginx -t && docker exec nginx-2.28.1 nginx -s reload`

---
> Стек: Next.js 15 (Pages Router) · React 19 · Tailwind CSS 3 · Framer Motion 11 · FastAPI · PostgreSQL
> Принцип: коммит только после `npm run build` (без ошибок)

---

## Архитектура и философия

**Сайт = публичная витрина** (не админка, не CRM).
Данные о доступных датах и приём заявок — через API EasyCamp (`easycamp-bot`).
Своей БД нет — только проксируем запросы.

### Цвета дизайна
| Роль | HEX | Использование |
|---|---|---|
| Forest (primary) | `#2c6e2c` | Кнопки, акценты, фон секций |
| Gold (accent) | `#c8913a` | Подзаголовки-лейблы, детали |
| Cream (bg) | `#faf7f2` | Основной фон страниц |
| Dark forest | `#143414` | Заголовки |
| Stone | `#8b7355` | Вторичный текст |

### Шрифты
- Заголовки: **Playfair Display** (serif, элегантность)
- Тело: **Inter** (чистый, читаемый)

---

## Фазы разработки

---

### ФАЗА 0 — Инфраструктура и стек ✅ (2026-03-02)

| # | Задача | Файлы | Тест |
|---|---|---|---|
| 0.1 | Добавить Tailwind CSS 3 | `tailwind.config.js`, `postcss.config.js` | `npm run build` |
| 0.2 | Добавить Framer Motion 11, clsx | `package.json` | `npm run build` |
| 0.3 | Переписать `styles.css` (tailwind + custom vars) | `styles.css` | `npm run build` |
| 0.4 | Обновить `next.config.js` (images, i18n) | `next.config.js` | `npm run build` |
| 0.5 | Добавить `lib/data.js` — данные домиков и контента | `lib/data.js` | `npm run build` |
| 0.6 | Обновить `_app.js` — AnimatePresence + SEO | `pages/_app.js` | `npm run build` |

**Коммит:** `feat(infra): add Tailwind, Framer Motion, base styles and data layer`

---

### ФАЗА 1 — Компоненты (layout + секции) 🔲

#### 1.1 Navbar
**Файл:** `components/Navbar.js`
- Логотип «ТЕПЛО» (Playfair Display)
- Навигация: Домики · Удобства · Расположение · Контакты
- CTA кнопка «Забронировать» (scroll to form)
- На скролле: transparent → solid белый + тень (Framer Motion)
- Мобильное меню (hamburger) — slide-down анимация
- **Тест:** рендер без ошибок, `npm run build`

#### 1.2 Hero Section
**Файл:** `components/Hero.js`
- Full-viewport (100vh) с animated gradient (лес/горы атмосфера)
- Mountain SVG силуэт снизу (векторный, CSS)
- Стaggered text animation: badge «Архыз · КЧР» → H1 → subtitle → кнопки
- 2 CTA: «Посмотреть домики» (scroll down) + «Написать в Telegram»
- Scroll-down индикатор (bounce анимация)
- **Noise texture overlay** для глубины
- Плейсхолдер под hero-фото (можно заменить реальным фото позже)
- **Тест:** рендер, `npm run build`

#### 1.3 Stats Strip
**Файл:** встроен в `Hero.js` или отдельный `StatsStrip.js`
- 3 домика · Архыз, КЧР · от 5 500 ₽/сутки · Круглый год
- Анимация счётчика при появлении в viewport
- **Тест:** рендер, `npm run build`

**Коммит:** `feat(ui): add Navbar and Hero section with animations`

---

#### 1.4 Cabins Section
**Файл:** `components/CabinsSection.js`
- 3 карточки домиков (данные из `lib/data.js`)
- Каждая карточка: фото-плейсхолдер (gradient), название, тег, цена, вместимость, 3 топ-удобства
- Hover: lift + shadow + scale 1.02
- Framer Motion: stagger fade-in при появлении
- Статус «Скоро» для 3-го домика (до получения данных)
- «Подробнее» → якорь / страница домика
- «Забронировать» → scroll to form с pre-fill домика
- **Тест:** рендер всех 3 карточек, `npm run build`

#### 1.5 Amenities Section
**Файл:** `components/AmenitiesSection.js`
- 8 удобств: горный воздух, лес, мангал, лыжи, Wi-Fi, парковка, 12 месяцев, полный комфорт
- 4-col desktop / 2-col mobile
- Fade-in stagger при скролле
- Иконка (emoji или SVG) + заголовок + описание
- **Тест:** рендер, `npm run build`

**Коммит:** `feat(sections): add Cabins and Amenities sections`

---

#### 1.6 Gallery Placeholder Section
**Файл:** `components/GallerySection.js`
- Masonry-style сетка 6 плейсхолдеров (для реальных фото)
- Hover: overlay с подписью
- Каждый плейсхолдер помечен: «Фото 1: Внешний вид домика Лесной» и т.д.
- **Тест:** рендер, `npm run build`

#### 1.7 Location Section
**Файл:** `components/LocationSection.js`
- О Архызе: горы Кавказа, 1450 м, хвойный лес
- Блок «Как добраться»: от Черкесска 120 км, от Краснодара 350 км, от Минвод 250 км
- Активности: горные лыжи (зима), походы (лето), рафтинг, конные прогулки
- Карта-ссылка на Яндекс.Карты
- **Тест:** рендер, `npm run build`

**Коммит:** `feat(sections): add Gallery placeholder and Location sections`

---

#### 1.8 Booking Section
**Файл:** `components/BookingSection.js`
- Форма: Выбор домика (select) · Имя · Телефон · Даты заезда/выезда · Кол-во гостей · Комментарий
- API: `POST /booking-requests` → EasyCamp backend
- Состояния: idle / submitting / success / error
- Success: анимация checkmark + «Мы свяжемся в течение 1 часа»
- Валидация: даты (выезд > заезд), телефон (российский формат)
- Ссылка «Или напишите сразу в Telegram» → `t.me/Teplovic`
- **Тест:** валидация формы, рендер, `npm run build`

#### 1.9 Reviews Section (placeholder)
**Файл:** `components/ReviewsSection.js`
- 3 карточки отзывов — ПЛЕЙСХОЛДЕР (реальные отзывы нужны от пользователя)
- Звёзды, имя, дата, текст
- **Тест:** рендер, `npm run build`

**Коммит:** `feat(sections): add Booking form and Reviews placeholder`

---

#### 1.10 Footer
**Файл:** `components/Footer.js`
- Тёмный (forest-900) фон
- Лого + слоган
- Колонки: Навигация · Домики · Контакты
- Иконки: Telegram · Авито · Яндекс.Карты
- Copyright
- **Тест:** рендер, `npm run build`

**Коммит:** `feat(layout): add Footer`

---

### ФАЗА 2 — Страница домика и API 🔲

#### 2.1 Cabin detail page
**Файл:** `pages/cabin/[slug].js`
- SSG (`getStaticProps` + `getStaticPaths`)
- Hero: фото-плейсхолдер + название + цена + capacity
- Описание (длинное)
- Полный список удобств
- Встроенная форма бронирования с pre-fill
- SEO мета-теги

#### 2.2 Availability check
**Файл:** `components/AvailabilityCalendar.js`
- Вызов EasyCamp API: `GET /houses/{id}/availability?from=...&to=...`
- Визуализация занятых/свободных дат
- Интеграция с формой бронирования

#### 2.3 API proxy в Next.js
**Файл:** `pages/api/booking-requests.js`
- Прокси к EasyCamp backend чтобы скрыть CORS и внутренний адрес
- Rate limiting (простой)

**Коммит:** `feat(pages): add cabin detail page and booking API proxy`

---

### ФАЗА 3 — SEO, производительность, деплой 🔲

| # | Задача | Детали |
|---|---|---|
| 3.1 | SEO компонент | `<Head>` с title, description, og:image для каждой страницы |
| 3.2 | Sitemap | `pages/sitemap.xml.js` — динамический sitemap |
| 3.3 | Реальные фото | Заменить плейсхолдеры, `next/image` + WebP |
| 3.4 | LCP оптимизация | Priority image на hero, preload fonts |
| 3.5 | Docker prod build | `docker-compose.prod.yml` с `npm run build && next start` |
| 3.6 | Nginx конфиг | Роутинг на порт 3000, SSL через Let's Encrypt |
| 3.7 | Домен | Конфигурация DNS (отдельный домен или поддомен) |

**Коммит:** `feat(seo): add meta tags, sitemap, image optimization`

---

### ФАЗА 4 — Расширенный функционал (после MVP) 🔲

| # | Задача | Приоритет |
|---|---|---|
| 4.1 | Онлайн-бронирование с оплатой | высокий |
| 4.2 | Интерактивный календарь доступности | высокий |
| 4.3 | Мобильное приложение / PWA | средний |
| 4.4 | Отзывы (реальные) с модерацией | средний |
| 4.5 | Раздел «Активности Архыза» | низкий |
| 4.6 | Мультиязычность (RU/EN) | низкий |
| 4.7 | Промо-страница (скидки, акции) | низкий |

---

## Структура файлов (итоговая)

```
frontend/
├── pages/
│   ├── _app.js              ← AnimatePresence, SEO base
│   ├── _document.js         ← HTML head, fonts
│   ├── index.js             ← Главная (все секции)
│   ├── cabin/
│   │   └── [slug].js        ← Страница домика
│   └── api/
│       └── booking-requests.js  ← API proxy
├── components/
│   ├── Navbar.js
│   ├── Hero.js
│   ├── StatsStrip.js
│   ├── CabinsSection.js
│   ├── AmenitiesSection.js
│   ├── GallerySection.js
│   ├── LocationSection.js
│   ├── BookingSection.js
│   ├── ReviewsSection.js
│   └── Footer.js
├── lib/
│   └── data.js              ← Данные домиков, контент
├── public/
│   ├── images/
│   │   ├── hero/            ← hero-bg.jpg (нужно от пользователя)
│   │   ├── cabin-lesnoj/    ← 5-8 фото (нужно от пользователя)
│   │   ├── cabin-semejnyj/  ← 5-8 фото (нужно от пользователя)
│   │   └── cabin-gornyj/    ← 5-8 фото (нужно от пользователя)
│   └── og-image.jpg         ← OG preview (нужно от пользователя)
├── styles.css
├── tailwind.config.js
├── postcss.config.js
├── next.config.js
└── package.json
```

---

## Правила работы

1. **Тест перед коммитом:** `npm run build` внутри Docker контейнера. При ошибках — фикс, не коммит.
2. **Маленькие коммиты:** один коммит = один логический блок (1-2 секции или 1 компонент).
3. **Семантические сообщения:** `feat(секция): что добавлено`
4. **Плейсхолдеры:** все реальные фото → gradient div с понятным alt. Никаких сломанных img тегов.
5. **Данные:** константы в `lib/data.js`, не захардкожены в компонентах.
6. **Responsive:** mobile-first, проверять на 375px и 1280px.
