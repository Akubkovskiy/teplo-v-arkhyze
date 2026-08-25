import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Layout from "../components/Layout";
import AnimatedSection from "../components/AnimatedSection";
import cfg from "../site.config";
import { captureUtm, getStoredUtm, trackEvent } from "../lib/analytics";

const FALLBACK_HOUSES = [
  { id: 1, name: "Домик в лесу 34 м² · №1", capacity: 4, base_price: 5500 },
  { id: 2, name: "Семейный домик 40 м²", capacity: 6, base_price: 7500 },
  { id: 3, name: "Домик в лесу 34 м² · №3", capacity: 4, base_price: 4500 },
];

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "/api";

function displayHouseName(house) {
  if (house && (house.id === 1 || house.id === 3)) {
    return `Домик в лесу 34 м² · №${house.id}`;
  }
  return house?.name || "Домик";
}

function normalizePhone(raw) {
  return (raw || "").replace(/[\s\-()]/g, "");
}

function formatPrice(n) {
  return n.toLocaleString("ru-RU");
}

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

function nextDate(value) {
  const date = new Date(`${value}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + 1);
  return date.toISOString().slice(0, 10);
}

function getStayAvailability(entries, checkIn, checkOut) {
  if (!checkIn || !checkOut || checkOut <= checkIn || !entries.length) return null;
  const byDate = new Map(entries.map((entry) => [String(entry.date).slice(0, 10), entry]));
  let date = checkIn;
  while (date < checkOut) {
    const entry = byDate.get(date);
    if (!entry) return null;
    if (entry.available === false) return false;
    date = nextDate(date);
  }
  return true;
}

export default function BookingPage() {
  const router = useRouter();
  const qsHouse = Number(router.query.house) || 1;
  const minDate = todayStr();
  const [houses, setHouses] = useState(FALLBACK_HOUSES);
  const [form, setForm] = useState({
    house: qsHouse,
    guest_name: "",
    guest_phone: "",
    check_in: "",
    check_out: "",
    guests_count: 2,
    comment: "",
  });
  const [honeypot, setHoneypot] = useState("");
  const [utm, setUtm] = useState({});
  const [sent, setSent] = useState(false);
  const [leadId, setLeadId] = useState(null);
  const [leadStatus, setLeadStatus] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [priceCalc, setPriceCalc] = useState(null);
  const [priceLoading, setPriceLoading] = useState(false);
  const [availability, setAvailability] = useState([]);
  const [availabilityStatus, setAvailabilityStatus] = useState("idle");

  useEffect(() => {
    fetch(`${API_BASE}/houses`)
      .then((r) => r.ok ? r.json() : [])
      .then((data) => {
        if (data.length) setHouses(data);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    let cancelled = false;
    setAvailability([]);
    setAvailabilityStatus("loading");
    fetch(`${API_BASE}/houses/${form.house}/availability?days=365`)
      .then((r) => {
        if (!r.ok) throw new Error("availability unavailable");
        return r.json();
      })
      .then((data) => {
        if (cancelled) return;
        setAvailability(Array.isArray(data) ? data : []);
        setAvailabilityStatus(Array.isArray(data) ? "ready" : "error");
      })
      .catch(() => {
        if (!cancelled) setAvailabilityStatus("error");
      });
    return () => { cancelled = true; };
  }, [form.house]);

  useEffect(() => {
    if (!router.isReady) return;
    const q = router.query;
    if (q.house) setForm((f) => ({ ...f, house: Number(q.house) || 1 }));
    const keys = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"];
    const found = {};
    for (const k of keys) {
      if (q[k]) found[k] = String(q[k]);
    }
    setUtm({ ...getStoredUtm(), ...captureUtm(found) });
  }, [router.isReady]);

  const fetchPrice = useCallback(async (houseId, checkIn, checkOut) => {
    if (!checkIn || !checkOut || checkOut <= checkIn) {
      setPriceCalc(null);
      return;
    }
    setPriceLoading(true);
    try {
      const r = await fetch(
        `${API_BASE}/houses/${houseId}/calculate?check_in=${checkIn}&check_out=${checkOut}`
      );
      if (r.ok) {
        setPriceCalc(await r.json());
      } else {
        setPriceCalc(null);
      }
    } catch {
      setPriceCalc(null);
    } finally {
      setPriceLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPrice(form.house, form.check_in, form.check_out);
  }, [form.house, form.check_in, form.check_out, fetchPrice]);

  const selectedHouse = houses.find((x) => x.id === form.house) || houses[0];
  const stayAvailability = getStayAvailability(availability, form.check_in, form.check_out);

  async function submit(e) {
    e.preventDefault();
    setError("");

    const phone = normalizePhone(form.guest_phone);
    if (!/^\+?\d{10,15}$/.test(phone)) {
      setError("Введите корректный телефон: только цифры, можно с + в начале.");
      return;
    }

    if (form.check_in && form.check_out && form.check_out <= form.check_in) {
      setError("Дата выезда должна быть позже даты заезда.");
      return;
    }

    if (availabilityStatus === "loading" || stayAvailability === null) {
      setError("Подождите проверку доступности дат или напишите администратору в Telegram.");
      return;
    }

    if (stayAvailability === false) {
      setError("Некоторые выбранные даты уже заняты. Выберите другой период.");
      return;
    }

    if (honeypot) {
      setSent(true);
      return;
    }

    const houseObj = houses.find((x) => x.id === form.house) || houses[0];
    const commentParts = [];
    if (Object.keys(utm).length) {
      const utmStr = Object.entries(utm).map(([k, v]) => `${k.replace("utm_", "")}=${v}`).join(" ");
      commentParts.push(`UTM: ${utmStr}`);
    }
    commentParts.push(`Дом: ${houseObj.name}`);
    if (form.comment.trim()) commentParts.push(form.comment.trim());

    const payload = {
      house_id: form.house,
      guest_name: form.guest_name.trim(),
      guest_phone: phone,
      guest_comment: commentParts.join(" | "),
      check_in: form.check_in,
      check_out: form.check_out,
      guests_count: Number(form.guests_count) || 2,
    };

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/booking-requests`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        let detail = "";
        try {
          const data = await res.json();
          if (data && data.detail) {
            detail = typeof data.detail === "string" ? data.detail : JSON.stringify(data.detail);
          }
        } catch {
          /* ignore */
        }
        setError(
          detail
            ? `Не удалось отправить заявку (${res.status}): ${detail}`
            : `Не удалось отправить заявку (${res.status}). Попробуйте ещё раз или напишите в Telegram.`,
        );
        setLoading(false);
        return;
      }

      const data = await res.json();
      setLeadId(data && data.id ? data.id : null);
      setLeadStatus(data && data.status ? data.status : "accepted");
      trackEvent("booking_request_sent", { status: data && data.status ? data.status : "accepted" });
      setSent(true);
    } catch (err) {
      setError(
        "Сеть недоступна — заявка не отправлена. Попробуйте ещё раз или напишите нам в Telegram.",
      );
    } finally {
      setLoading(false);
    }
  }

  if (sent) {
    const h = houses.find((x) => x.id === form.house) || houses[0];
    const pending = leadStatus === "pending";
    return (
      <Layout
        title="Бронирование"
        description="Забронируйте домик на базе «Тепло» в Архызе. Домики в лесу, тишина и природа. Выберите даты — ответим в течение 30 минут."
      >
        <AnimatedSection className="card">
          <h2 style={{ marginTop: 0 }}>{pending ? "Заявка сохранена" : "Заявка принята"}</h2>
          {leadId ? (
            <p>
              Номер заявки: <b>#{leadId}</b>. Сохраните его — пригодится, если будете писать
              нам в Telegram.
            </p>
          ) : null}
          <p>Домик: <b>{displayHouseName(h)}</b></p>
          <p>Даты: <b>{form.check_in} — {form.check_out}</b></p>
          {priceCalc && (
            <p>Стоимость: <b>{formatPrice(priceCalc.total)} ₽</b> ({priceCalc.nights} {priceCalc.nights === 1 ? "ночь" : priceCalc.nights < 5 ? "ночи" : "ночей"})</p>
          )}
          <p>
            {pending
              ? "Заявка сохранена, но сервис бронирования временно не ответил. Мы проверим даты вручную и свяжемся с вами в течение 10–30 минут."
              : "Мы получили заявку и свяжемся с вами в течение 10–30 минут в рабочее время для подтверждения."}
          </p>
          <p>Если хотите ускорить — напишите нам напрямую:</p>
          <div className="hero-actions">
            <a className="btn-primary" href={`${cfg.botUrl}?start=booking`} target="_blank" rel="noreferrer">
              Бот бронирования
            </a>
            <a className="btn-secondary" href={cfg.adminUrl} target="_blank" rel="noreferrer">
              Написать администратору
            </a>
          </div>
        </AnimatedSection>
      </Layout>
    );
  }

  return (
    <Layout
      title="Бронирование"
      description="Забронируйте домик на базе «Тепло» в Архызе. Домики в лесу, тишина и природа. Выберите даты — ответим в течение 30 минут."
    >
      <AnimatedSection className="card" style={{ marginBottom: 14 }}>
        <h2 style={{ marginTop: 0 }}>Выберите домик и даты</h2>
        <p style={{ marginBottom: 8 }}>После заявки проверим доступность и итоговую стоимость, затем ответим в течение 10–30 минут в рабочее время.</p>
        <p style={{ margin: 0, fontSize: "0.9em", opacity: 0.8 }}>Бронь фиксируется после подтверждения и предоплаты. Заезд с 14:00, выезд до 12:00.</p>
        <p style={{ fontSize: "0.85em", opacity: 0.6, marginBottom: 0, marginTop: 10 }}>
          <Link href="/rules" style={{ color: "#93c5fd" }}>Правила и условия бронирования</Link>
        </p>
      </AnimatedSection>

      <AnimatedSection className="card booking-form">
        <p style={{ marginTop: 0 }}>
          Оставьте заявку — подтвердим доступность и свяжемся с вами.
          Обычно отвечаем в течение 10–30 минут в рабочее время.
        </p>
        <form onSubmit={submit}>
          <label htmlFor="booking-house">Домик</label>
          <select
            id="booking-house"
            value={form.house}
            onChange={(e) => {
              const houseId = Number(e.target.value);
              const house = houses.find((item) => item.id === houseId);
              setForm({
                ...form,
                house: houseId,
                guests_count: Math.min(Number(form.guests_count) || 2, house?.capacity || 20),
              });
            }}
            disabled={loading}
          >
            {houses.map((h) => (
              <option key={h.id} value={h.id}>
                {displayHouseName(h)}
                {h.current_price ? ` · от ${formatPrice(h.current_price)} ₽/сутки` : ""}
              </option>
            ))}
          </select>
          {selectedHouse && selectedHouse.discount_percent > 0 && (
            <p style={{ color: "#86efac", fontSize: "0.9em", marginTop: 4 }}>
              -{selectedHouse.discount_percent}%{selectedHouse.discount_label ? ` ${selectedHouse.discount_label}` : ""}
            </p>
          )}
          <label htmlFor="booking-name">Имя</label>
          <input
            id="booking-name"
            required
            autoComplete="name"
            placeholder="Имя и фамилия"
            value={form.guest_name}
            onChange={(e) => setForm({ ...form, guest_name: e.target.value })}
            disabled={loading}
          />
          <label htmlFor="booking-phone">Телефон</label>
          <input
            id="booking-phone"
            type="tel"
            inputMode="tel"
            required
            autoComplete="tel"
            placeholder="+79991234567"
            value={form.guest_phone}
            onChange={(e) => setForm({ ...form, guest_phone: e.target.value })}
            disabled={loading}
          />
          <div className="grid2">
            <div>
              <label htmlFor="booking-check-in">Заезд</label>
              <input
                id="booking-check-in"
                type="date"
                required
                min={minDate}
                value={form.check_in}
                onChange={(e) => setForm({ ...form, check_in: e.target.value })}
                disabled={loading}
              />
            </div>
            <div>
              <label htmlFor="booking-check-out">Выезд</label>
              <input
                id="booking-check-out"
                type="date"
                required
                min={form.check_in || minDate}
                value={form.check_out}
                onChange={(e) => setForm({ ...form, check_out: e.target.value })}
                disabled={loading}
              />
            </div>
          </div>

          {priceLoading && (
            <p style={{ fontSize: "0.9em", opacity: 0.7 }}>Считаем стоимость...</p>
          )}
          {priceCalc && !priceLoading && (
            <div className="price-summary" style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 8,
              padding: "12px 16px",
              margin: "8px 0",
            }}>
              <p style={{ margin: 0, fontWeight: 600, fontSize: "1.1em" }}>
                {formatPrice(priceCalc.total)} ₽
                {priceCalc.total_without_discount && priceCalc.total_without_discount > priceCalc.total && (
                  <span style={{ textDecoration: "line-through", opacity: 0.5, marginLeft: 8, fontWeight: 400, fontSize: "0.9em" }}>
                    {formatPrice(priceCalc.total_without_discount)} ₽
                  </span>
                )}
              </p>
              <p style={{ margin: "4px 0 0", fontSize: "0.85em", opacity: 0.7 }}>
                {priceCalc.nights} {priceCalc.nights === 1 ? "ночь" : priceCalc.nights < 5 ? "ночи" : "ночей"} · ~{formatPrice(priceCalc.avg_per_night)} ₽/ночь
              </p>
            </div>
          )}

          {availabilityStatus === "loading" && (
            <p className="availability-status" role="status" aria-live="polite">
              Проверяем доступность дат…
            </p>
          )}
          {availabilityStatus === "error" && (
            <p className="availability-status availability-status-warning" role="status" aria-live="polite">
              Не удалось проверить календарь. Напишите администратору, чтобы подтвердить даты.
            </p>
          )}
          {stayAvailability === true && (
            <p className="availability-status availability-status-ok" role="status" aria-live="polite">
              Выбранные даты свободны по текущему календарю.
            </p>
          )}
          {stayAvailability === false && (
            <p className="availability-status availability-status-warning" role="status" aria-live="polite">
              Некоторые выбранные даты уже заняты. Выберите другой период.
            </p>
          )}

          <label htmlFor="booking-guests">Гостей</label>
          <input
            id="booking-guests"
            type="number"
            min={1}
            max={selectedHouse?.capacity || 20}
            value={form.guests_count}
            onChange={(e) => setForm({ ...form, guests_count: e.target.value })}
            disabled={loading}
          />
          <label htmlFor="booking-comment">Комментарий (необязательно)</label>
          <textarea
            id="booking-comment"
            rows={3}
            placeholder="Пожелания по размещению, вопросы, особые условия..."
            value={form.comment}
            onChange={(e) => setForm({ ...form, comment: e.target.value })}
            disabled={loading}
          />
          <input
            name="website"
            tabIndex={-1}
            autoComplete="off"
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
            style={{ position: "absolute", left: "-9999px", opacity: 0 }}
            aria-hidden="true"
          />
          <button type="submit" disabled={loading}>
            {loading ? "Отправляем…" : "Отправить заявку"}
          </button>
          {error ? <p role="alert" style={{ color: "#fca5a5" }}>⚠️ {error}</p> : null}
          <div className="hero-actions" style={{ marginTop: 8 }}>
            <a className="btn-primary" href={`${cfg.botUrl}?start=booking`} target="_blank" rel="noreferrer">
              Перейти в бот бронирования
            </a>
            <a className="btn-secondary" href={cfg.adminUrl} target="_blank" rel="noreferrer">
              Связаться с администратором
            </a>
          </div>
        </form>
        <div className="booking-banner">
          <img src="/images/hero-mountains-3.jpg" alt="Вид на горы рядом с базой" loading="lazy" />
        </div>
      </AnimatedSection>
    </Layout>
  );
}
