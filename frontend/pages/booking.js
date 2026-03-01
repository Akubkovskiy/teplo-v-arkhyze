import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import AnimatedSection from "../components/AnimatedSection";

const API = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8001";

export default function BookingPage() {
  const [houses, setHouses] = useState([]);
  const [form, setForm] = useState({ house_id: "", guest_name: "", guest_phone: "", check_in: "", check_out: "", guests_count: 2, guest_comment: "" });
  const [result, setResult] = useState("");

  useEffect(() => {
    fetch(`${API}/houses`).then((r) => r.json()).then((data) => {
      setHouses(data || []);
      if (data?.[0]?.id) setForm((f) => ({ ...f, house_id: String(data[0].id) }));
    });
  }, []);

  async function submit(e) {
    e.preventDefault();
    setResult("Отправка...");
    const payload = { ...form, house_id: form.house_id ? Number(form.house_id) : null, guests_count: Number(form.guests_count) };
    const r = await fetch(`${API}/booking-requests`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(payload) });
    const data = await r.json();
    setResult(r.ok ? `✅ Заявка отправлена (#${data.id})` : `❌ ${data.detail || "Ошибка"}`);
  }

  return (
    <Layout title="Бронирование">
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
          <select value={form.house_id} onChange={(e) => setForm({ ...form, house_id: e.target.value })}>
            {houses.map((h) => <option key={h.id} value={h.id}>{h.name} · {h.base_price} ₽</option>)}
          </select>
          <label>Имя</label><input required value={form.guest_name} onChange={(e) => setForm({ ...form, guest_name: e.target.value })} />
          <label>Телефон</label><input required value={form.guest_phone} onChange={(e) => setForm({ ...form, guest_phone: e.target.value })} />
          <div className="grid2">
            <div><label>Заезд</label><input type="date" required value={form.check_in} onChange={(e) => setForm({ ...form, check_in: e.target.value })} /></div>
            <div><label>Выезд</label><input type="date" required value={form.check_out} onChange={(e) => setForm({ ...form, check_out: e.target.value })} /></div>
          </div>
          <label>Гостей</label><input type="number" min={1} max={20} value={form.guests_count} onChange={(e) => setForm({ ...form, guests_count: e.target.value })} />
          <label>Комментарий</label><textarea rows={3} value={form.guest_comment} onChange={(e) => setForm({ ...form, guest_comment: e.target.value })} />
          <button type="submit">Отправить заявку</button>
          {result ? <p>{result}</p> : null}
        </form>
      </AnimatedSection>
    </Layout>
  );
}
