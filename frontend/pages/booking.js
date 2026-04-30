import { useState } from "react";
import { useRouter } from "next/router";
import Layout from "../components/Layout";
import AnimatedSection from "../components/AnimatedSection";
import cfg from "../site.config";

const houses = [
  { id: 1, name: "Домик в лесу 34 м²", price: "от 5 000 ₽/сутки" },
  { id: 2, name: "Семейный домик 40 м²", price: "от 7 000 ₽/сутки" },
  { id: 3, name: "Компактный домик 32 м²", price: "по запросу" },
];

// Прод: фронт и API сидят за общим nginx, /api/* проксируется на FastAPI.
// Можно переопределить через NEXT_PUBLIC_API_BASE для dev-окружения.
const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "/api";

function normalizePhone(raw) {
  return (raw || "").replace(/[\s\-()]/g, "");
}

export default function BookingPage() {
  const router = useRouter();
  const qsHouse = Number(router.query.house) || 1;
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
  const [sent, setSent] = useState(false);
  const [leadId, setLeadId] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);


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

    if (honeypot) {
      setSent(true);
      return;
    }

    const houseObj = houses.find((x) => x.id === form.house) || houses[0];
    // Префикс с названием домика в комментарии — это страховка на случай,
    // если site API не найдёт house_id у себя в seed (например, для
    // 3-го домика, которого пока нет в site DB), и EasyCamp получит
    // пустой house_name. Тогда на стороне EasyCamp админ всё равно
    // увидит, какой домик был выбран.
    const commentParts = [];
    commentParts.push(`Дом: ${houseObj.name}`);
    if (form.comment.trim()) commentParts.push(form.comment.trim());

    const payload = {
      house_id: [1, 2].includes(form.house) ? form.house : null,
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
    return (
      <Layout
        title="Бронирование"
        description="Забронируйте домик на базе «Тепло» в Архызе. Домики в лесу, тишина и природа. Выберите даты — ответим в течение 30 минут."
      >
        <AnimatedSection className="card">
          <h2 style={{ marginTop: 0 }}>Спасибо за заявку!</h2>
          {leadId ? (
            <p>
              Номер заявки: <b>#{leadId}</b>. Сохраните его — пригодится, если будете писать
              нам в Telegram.
            </p>
          ) : null}
          <p>Домик: <b>{h.name}</b></p>
          <p>Даты: <b>{form.check_in} — {form.check_out}</b></p>
          <p>Мы свяжемся с вами в течение 10–30 минут в рабочее время для подтверждения.</p>
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
      <AnimatedSection className="card booking-form">
        <p style={{ marginTop: 0 }}>
          Оставьте заявку — подтвердим доступность и свяжемся с вами.
          Обычно отвечаем в течение 10–30 минут в рабочее время.
        </p>
        <div className="booking-banner">
          <img src="/images/hero-mountains-3.jpg" alt="Вид на горы рядом с базой" />
        </div>
        <form onSubmit={submit}>
          <label>Домик</label>
          <select
            value={form.house}
            onChange={(e) => setForm({ ...form, house: Number(e.target.value) })}
            disabled={loading}
          >
            {houses.map((h) => (
              <option key={h.id} value={h.id}>
                {h.name} · {h.price}
              </option>
            ))}
          </select>
          <label>Имя</label>
          <input
            required
            value={form.guest_name}
            onChange={(e) => setForm({ ...form, guest_name: e.target.value })}
            disabled={loading}
          />
          <label>Телефон</label>
          <input
            required
            placeholder="+79991234567"
            value={form.guest_phone}
            onChange={(e) => setForm({ ...form, guest_phone: e.target.value })}
            disabled={loading}
          />
          <div className="grid2">
            <div>
              <label>Заезд</label>
              <input
                type="date"
                required
                value={form.check_in}
                onChange={(e) => setForm({ ...form, check_in: e.target.value })}
                disabled={loading}
              />
            </div>
            <div>
              <label>Выезд</label>
              <input
                type="date"
                required
                value={form.check_out}
                onChange={(e) => setForm({ ...form, check_out: e.target.value })}
                disabled={loading}
              />
            </div>
          </div>
          <label>Гостей</label>
          <input
            type="number"
            min={1}
            max={20}
            value={form.guests_count}
            onChange={(e) => setForm({ ...form, guests_count: e.target.value })}
            disabled={loading}
          />
          <label>Комментарий</label>
          <textarea
            rows={3}
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
          {error ? <p style={{ color: "#fca5a5" }}>⚠️ {error}</p> : null}
          <div className="hero-actions" style={{ marginTop: 8 }}>
            <a className="btn-primary" href={`${cfg.botUrl}?start=booking`} target="_blank" rel="noreferrer">
              Перейти в бот бронирования
            </a>
            <a className="btn-secondary" href={cfg.adminUrl} target="_blank" rel="noreferrer">
              Связаться с администратором
            </a>
          </div>
        </form>
      </AnimatedSection>
    </Layout>
  );
}
