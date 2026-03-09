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

export default function BookingPage() {
  const router = useRouter();
  const qsHouse = Number(router.query.house) || 1;
  const [form, setForm] = useState({ house: qsHouse, guest_name: "", guest_phone: "", check_in: "", check_out: "", guests_count: 2, comment: "" });
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  function submit(e) {
    e.preventDefault();
    setError("");

    const phone = (form.guest_phone || "").replace(/[\s\-()]/g, "");
    if (!/^\+?\d{10,15}$/.test(phone)) {
      setError("Введите корректный телефон: только цифры, можно с + в начале.");
      return;
    }

    if (form.check_in && form.check_out && form.check_out <= form.check_in) {
      setError("Дата выезда должна быть позже даты заезда.");
      return;
    }

    setSent(true);
  }

  if (sent) {
    const h = houses.find((x) => x.id === form.house) || houses[0];
    return (
      <Layout title="Бронирование" description="Забронируйте домик на базе «Тепло» рядом с Архызом. Выберите даты и оставьте заявку — ответим в течение 30 минут.">
        <AnimatedSection className="card">
          <h2 style={{ marginTop: 0 }}>Спасибо за заявку!</h2>
          <p>Домик: <b>{h.name}</b></p>
          <p>Даты: <b>{form.check_in} — {form.check_out}</b></p>
          <p>Для быстрого подтверждения свяжитесь с нами:</p>
          <div className="hero-actions">
            <a className="btn-primary" href={`${cfg.botUrl}?start=booking`} target="_blank" rel="noreferrer">Бот бронирования</a>
            <a className="btn-secondary" href={cfg.adminUrl} target="_blank" rel="noreferrer">Написать администратору</a>
          </div>
        </AnimatedSection>
      </Layout>
    );
  }

  return (
    <Layout title="Бронирование" description="Забронируйте домик на базе «Тепло» рядом с Архызом. Выберите даты и оставьте заявку — ответим в течение 30 минут.">
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
          <select value={form.house} onChange={(e) => setForm({ ...form, house: Number(e.target.value) })}>
            {houses.map((h) => <option key={h.id} value={h.id}>{h.name} · {h.price}</option>)}
          </select>
          <label>Имя</label><input required value={form.guest_name} onChange={(e) => setForm({ ...form, guest_name: e.target.value })} />
          <label>Телефон</label>
          <input required placeholder="+79991234567" value={form.guest_phone} onChange={(e) => setForm({ ...form, guest_phone: e.target.value })} />
          <div className="grid2">
            <div><label>Заезд</label><input type="date" required value={form.check_in} onChange={(e) => setForm({ ...form, check_in: e.target.value })} /></div>
            <div><label>Выезд</label><input type="date" required value={form.check_out} onChange={(e) => setForm({ ...form, check_out: e.target.value })} /></div>
          </div>
          <label>Гостей</label><input type="number" min={1} max={20} value={form.guests_count} onChange={(e) => setForm({ ...form, guests_count: e.target.value })} />
          <label>Комментарий</label><textarea rows={3} value={form.comment} onChange={(e) => setForm({ ...form, comment: e.target.value })} />
          <button type="submit">Отправить заявку</button>
          {error ? <p style={{ color: "#fca5a5" }}>⚠️ {error}</p> : null}
          <div className="hero-actions" style={{ marginTop: 8 }}>
            <a className="btn-primary" href={`${cfg.botUrl}?start=booking`} target="_blank" rel="noreferrer">Перейти в бот бронирования</a>
            <a className="btn-secondary" href={cfg.adminUrl} target="_blank" rel="noreferrer">Связаться с администратором</a>
          </div>
        </form>
      </AnimatedSection>
    </Layout>
  );
}
