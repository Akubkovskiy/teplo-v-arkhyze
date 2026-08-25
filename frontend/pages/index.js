import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";
import Layout from "../components/Layout";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "/api";

const FAQ_SCHEMA = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Далеко ли база до посёлка Архыз?",
      "acceptedAnswer": { "@type": "Answer", "text": "В 3 минутах езды до посёлка Архыз и в 15 минутах до курорта Романтик." },
    },
    {
      "@type": "Question",
      "name": "Можно ли приезжать с детьми?",
      "acceptedAnswer": { "@type": "Answer", "text": "Да, подберём домик с удобной планировкой для семьи с детьми." },
    },
    {
      "@type": "Question",
      "name": "Есть ли парковка?",
      "acceptedAnswer": { "@type": "Answer", "text": "Да, рядом с домиками предусмотрены места для автомобилей." },
    },
    {
      "@type": "Question",
      "name": "Как быстро подтверждаете заявку?",
      "acceptedAnswer": { "@type": "Answer", "text": "Обычно в течение 10–30 минут в рабочее время." },
    },
  ],
});

const HOUSE_FALLBACKS = [
  {
    id: 1,
    name: "Домик в лесу",
    size: "34 м²",
    capacity: 4,
    price: 4675,
    image: "/images/house-winter-1.jpg",
    description: "Отдельная спальня, кухня-гостиная и открытая веранда у леса.",
  },
  {
    id: 2,
    name: "Семейный домик",
    size: "40 м²",
    capacity: 6,
    price: 5950,
    image: "/images/interior-dining-1.jpg",
    description: "Две спальни и просторная гостиная для семьи или компании.",
  },
  {
    id: 3,
    name: "Компактный домик",
    size: "32 м²",
    capacity: 3,
    price: 4675,
    image: "/images/interior-bath-1.jpg",
    description: "Спокойный вариант для пары или небольшой компании до трёх гостей.",
  },
];

function formatPrice(price) {
  return Number(price || 0).toLocaleString("ru-RU");
}

export default function Home() {
  const [houses, setHouses] = useState(HOUSE_FALLBACKS);

  useEffect(() => {
    fetch(`${API_BASE}/houses`)
      .then((response) => (response.ok ? response.json() : []))
      .then((apiHouses) => {
        if (!apiHouses.length) return;
        setHouses((current) => current.map((house) => {
          const apiHouse = apiHouses.find((item) => item.id === house.id);
          if (!apiHouse) return house;
          return {
            ...house,
            capacity: apiHouse.capacity || house.capacity,
            price: apiHouse.current_price || apiHouse.base_price || house.price,
            discountPercent: apiHouse.discount_percent || 0,
          };
        }));
      })
      .catch(() => {});
  }, []);

  return (
    <Layout description="Три уютных домика в лесу Архыза: тишина, горы и чистый воздух. До курорта Романтик — 15 минут. Выберите даты и оставьте заявку на бронирование.">
      <Head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: FAQ_SCHEMA }} />
      </Head>

      <div className="home-page">
        <section className="home-hero" aria-labelledby="home-hero-title">
          <img
            className="home-hero-image"
            src="/images/house-winter-1.jpg"
            alt="Домик базы «Тепло» среди заснеженного леса"
          />
          <div className="home-hero-overlay" aria-hidden="true" />
          <div className="home-hero-inner">
            <p className="home-eyebrow">ТЕПЛО · АРХЫЗ</p>
            <h1 id="home-hero-title">Тишина в горах, которая начинается с порога</h1>
            <p className="home-hero-lead">
              Три уютных домика в лесу, в стороне от посёлка. Для тех, кто хочет просыпаться среди гор, а не в шуме курорта.
            </p>
            <div className="hero-actions">
              <Link href="/booking" className="btn-primary">Выбрать даты</Link>
              <Link href="/houses" className="btn-hero-secondary">Посмотреть домики</Link>
            </div>
            <dl className="home-hero-facts">
              <div><dt>15 мин</dt><dd>до курорта Романтик</dd></div>
              <div><dt>3 домика</dt><dd>от пары до компании</dd></div>
              <div><dt>10–30 мин</dt><dd>до ответа по заявке</dd></div>
            </dl>
          </div>
        </section>

        <section className="home-booking-bar" aria-label="Быстрое бронирование">
          <div className="home-inner home-booking-bar-inner">
            <div>
              <strong>Планируете поездку в Архыз?</strong>
              <span>Проверим даты и подберём домик под вашу компанию.</span>
            </div>
            <Link href="/booking" className="btn-dark">Проверить даты</Link>
          </div>
        </section>

        <div className="home-inner">
          <section className="home-section home-houses" aria-labelledby="houses-title">
            <div className="home-section-heading">
              <div>
                <p className="home-eyebrow home-eyebrow-dark">ГДЕ ВЫ ОСТАНОВИТЕСЬ</p>
                <h2 id="houses-title">Выберите свой формат отдыха</h2>
              </div>
              <Link href="/houses" className="text-link">Все характеристики →</Link>
            </div>
            <div className="home-house-grid">
              {houses.map((house) => (
                <article className="home-house-card" key={house.id}>
                  <Link href={`/booking?house=${house.id}`} className="home-house-image-link" aria-label={`Выбрать ${house.name}`}>
                    <img src={house.image} alt={house.name} loading="lazy" />
                  </Link>
                  <div className="home-house-body">
                    <div className="home-house-title-row">
                      <h3>{house.name}</h3>
                      <span>{house.size}</span>
                    </div>
                    <p>{house.description}</p>
                    <div className="home-house-footer">
                      <span>до {house.capacity} гостей</span>
                      <strong>от {formatPrice(house.price)} ₽</strong>
                    </div>
                    {house.discountPercent > 0 && <small className="home-discount">Сейчас действует скидка −{house.discountPercent}%</small>}
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="home-section home-detail" aria-labelledby="detail-title">
            <div className="home-detail-media">
              <img src="/images/hero-mountains-2.jpg" alt="Горная панорама Архыза рядом с базой" loading="lazy" />
            </div>
            <div className="home-detail-copy">
              <p className="home-eyebrow home-eyebrow-dark">ЗА ЧЕМ СЮДА ЕДУТ</p>
              <h2 id="detail-title">Горы рядом. Людей немного. Времени для себя достаточно.</h2>
              <p>База находится в трёх минутах от Архыза, но остаётся в стороне от дороги. Днём можно уйти на маршрут или к курорту, а вечером вернуться в тишину леса.</p>
              <ul className="home-check-list">
                <li>лесная локация и парковка у домика</li>
                <li>Wi‑Fi, кухня, горячая вода и мангальная зона</li>
                <li>подскажем маршрут и поможем выбрать домик</li>
              </ul>
              <Link href="/region" className="text-link">Узнать больше об Архызе →</Link>
            </div>
          </section>

          <section className="home-section home-atmosphere" aria-labelledby="atmosphere-title">
            <div className="home-section-heading">
              <div>
                <p className="home-eyebrow home-eyebrow-dark">ПОСМОТРИТЕ НАСТРОЕНИЕ</p>
                <h2 id="atmosphere-title">Так выглядит отдых в «Тепле»</h2>
              </div>
              <Link href="/reviews" className="text-link">Отзывы гостей →</Link>
            </div>
            <div className="home-gallery">
              <img className="home-gallery-large" src="/images/house-winter-1.jpg" alt="Домик среди зимнего леса" loading="lazy" />
              <img src="/images/interior-dining-1.jpg" alt="Обеденная зона в домике" loading="lazy" />
              <img src="/images/hero-mountains-3.jpg" alt="Панорама гор Архыза" loading="lazy" />
            </div>
          </section>

          <section className="home-section home-faq" aria-labelledby="faq-title">
            <div className="home-section-heading">
              <div>
                <p className="home-eyebrow home-eyebrow-dark">ПЕРЕД ПОЕЗДКОЙ</p>
                <h2 id="faq-title">Коротко о важном</h2>
              </div>
              <Link href="/contacts" className="text-link">Задать вопрос →</Link>
            </div>
            <div className="home-faq-list">
              <div><strong>Как далеко до курорта?</strong><span>Около 15 минут на машине до Романтика.</span></div>
              <div><strong>Можно с детьми?</strong><span>Да, подберём домик под состав семьи.</span></div>
              <div><strong>Как закрепляется бронь?</strong><span>После подтверждения доступности и предоплаты.</span></div>
              <div><strong>Когда будет ответ?</strong><span>Обычно в течение 10–30 минут в рабочее время.</span></div>
            </div>
          </section>
        </div>

        <section className="home-final-cta" aria-labelledby="final-cta-title">
          <div className="home-inner">
            <p className="home-eyebrow">ВАШ АРХЫЗ НАЧИНАЕТСЯ ЗДЕСЬ</p>
            <h2 id="final-cta-title">Выберите даты — остальное подскажем</h2>
            <p>Оставьте заявку, и мы проверим свободные домики, итоговую стоимость и ответим на вопросы.</p>
            <div className="hero-actions">
              <Link href="/booking" className="btn-primary">Перейти к бронированию</Link>
              <Link href="/contacts" className="btn-hero-secondary">Связаться с нами</Link>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}
