import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import AnimatedSection from "../components/AnimatedSection";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "/api";

const HOUSE_META = {
  1: {
    name: "Домик в лесу 34 м²",
    guests: "до 4 гостей (+ доп. место)",
    text: "Уютный домик с верандой и видом на горы. Wi‑Fi, горячая вода, мангальная зона.",
    img: "/images/house-winter-1.jpg",
  },
  2: {
    name: "Семейный домик 40 м²",
    guests: "до 6 гостей",
    text: "Две отдельные спальни, терраса, зона отдыха, парковка, комфорт для семьи или компании.",
    img: "/images/interior-dining-1.jpg",
  },
  3: {
    name: "Компактный домик 32 м²",
    guests: "до 4 гостей",
    text: "Практичный формат для короткого отдыха: базовый комфорт и приватная атмосфера.",
    img: "/images/interior-bath-1.jpg",
  },
};

function formatPrice(price) {
  return price.toLocaleString("ru-RU");
}

function PriceDisplay({ house }) {
  if (!house.current_price) {
    return <p>💰 от {formatPrice(house.base_price)} ₽/сутки</p>;
  }
  if (house.discount_percent > 0) {
    return (
      <div>
        <p style={{ margin: 0 }}>
          💰{" "}
          <span style={{ textDecoration: "line-through", opacity: 0.6 }}>
            {formatPrice(house.base_price)} ₽
          </span>{" "}
          <b>{formatPrice(house.current_price)} ₽/сутки</b>
        </p>
        <span className="discount-badge">-{house.discount_percent}%{house.discount_label ? ` ${house.discount_label}` : ""}</span>
      </div>
    );
  }
  return <p>💰 от {formatPrice(house.current_price)} ₽/сутки</p>;
}

export default function HousesPage() {
  const [houses, setHouses] = useState(
    Object.entries(HOUSE_META).map(([id, meta]) => ({
      id: Number(id),
      ...meta,
      base_price: 0,
      current_price: null,
      discount_percent: 0,
      discount_label: null,
    }))
  );

  useEffect(() => {
    fetch(`${API_BASE}/houses`)
      .then((r) => r.ok ? r.json() : [])
      .then((apiHouses) => {
        if (!apiHouses.length) return;
        setHouses((prev) =>
          prev.map((h) => {
            const api = apiHouses.find((a) => a.id === h.id);
            if (!api) return h;
            return {
              ...h,
              base_price: api.base_price,
              current_price: api.current_price,
              discount_percent: api.discount_percent || 0,
              discount_label: api.discount_label,
              season_label: api.season_label,
            };
          })
        );
      })
      .catch(() => {});
  }, []);

  return (
    <Layout title="Домики" description="Домики базы «Тепло» в Архызе: от 34 до 40 м², на 2–6 гостей. В лесу, в стороне от посёлка. Wi-Fi, кухня, мангал, парковка.">
      <AnimatedSection className="card">
        <p style={{ margin: 0 }}>
          Все домики расположены в лесу, в стороне от посёлка. Выберите подходящий вариант по формату отдыха и вместимости.
        </p>
      </AnimatedSection>

      <AnimatedSection className="grid3" style={{ marginTop: 14 }}>
        {houses.map((h) => (
          <article className="card card-hover" key={h.id}>
            <img src={h.img} alt={h.name} className="house-thumb" />
            <h3 style={{ marginTop: 12 }}>{h.name}</h3>
            <p>{h.text}</p>
            <p>👥 {h.guests}</p>
            <PriceDisplay house={h} />
            {h.season_label && <p style={{ fontSize: "0.85em", opacity: 0.8 }}>📅 {h.season_label}</p>}
            <a className="btn-primary" href={`/booking?house=${h.id}`}>Выбрать этот домик</a>
          </article>
        ))}
      </AnimatedSection>

      <AnimatedSection className="card" style={{ marginTop: 14 }}>
        <h3 style={{ marginTop: 0 }}>Что есть в домиках</h3>
        <ul>
          <li>Wi‑Fi и горячая вода</li>
          <li>Постельное бельё и полотенца</li>
          <li>Кухонная зона и посуда</li>
          <li>Мангальная зона и парковка</li>
          <li>Лесная атмосфера и видовые точки рядом с базой</li>
        </ul>
      </AnimatedSection>

      <AnimatedSection className="card" style={{ marginTop: 14 }}>
        <h3 style={{ marginTop: 0 }}>Подбор по формату отдыха</h3>
        <p style={{ marginBottom: 8 }}><b>Пара / спокойный отдых:</b> компактный домик, приватность и тихий режим.</p>
        <p style={{ marginBottom: 8 }}><b>Семья:</b> семейный домик с двумя спальнями и удобной зоной отдыха.</p>
        <p style={{ margin: 0 }}><b>Компания друзей:</b> домик с удобным общим пространством и мангальной зоной.</p>
      </AnimatedSection>

      <AnimatedSection className="card" style={{ marginTop: 14 }}>
        <h3 style={{ marginTop: 0 }}>Галерея домиков</h3>
        <div className="photo-strip" style={{ marginTop: 10 }}>
          <img src="/images/house-winter-1.jpg" alt="Домик зимой" />
          <img src="/images/interior-dining-1.jpg" alt="Гостиная и обеденная зона" />
          <img src="/images/interior-bath-1.jpg" alt="Санузел" />
          <img src="/images/hero-mountains-1.jpg" alt="Вид на горы" />
          <img src="/images/hero-mountains-2.jpg" alt="Атмосфера Архыза" />
          <img src="/images/hero-mountains-3.jpg" alt="Панорама региона" />
        </div>
      </AnimatedSection>
    </Layout>
  );
}
