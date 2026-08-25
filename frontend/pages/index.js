import Head from "next/head";
import Link from "next/link";
import Layout from "../components/Layout";
import AnimatedSection from "../components/AnimatedSection";

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

export default function Home() {
  return (
    <Layout description="Домики в лесу, в стороне от посёлка. Без шума и суеты — тишина, горы и чистый воздух. 3 домика на 2–6 гостей, до курорта 15 минут.">
      <Head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: FAQ_SCHEMA }} />
      </Head>
      <AnimatedSection className="hero card hero-mountain">
        <div className="hero-media">
          <img src="/images/house-winter-1.jpg" alt="Домик базы «Тепло» зимой" />
        </div>
        <h1>База отдыха «Тепло» в Архызе</h1>
        <p>
          Домики в лесу, в стороне от посёлка — без шума дорог и суеты.
          Только тишина, горы и чистый воздух. 3 домика на 2–6 гостей, до курорта Романтик — 15 минут.
        </p>
        <div className="hero-actions">
          <Link href="/booking" className="btn-primary">Забронировать</Link>
          <Link href="/houses" className="btn-secondary">Смотреть домики</Link>
        </div>
      </AnimatedSection>

      <AnimatedSection className="grid3">
        <article className="card card-hover"><h3>Тишина и природа</h3><p>Лесная локация, чистый воздух и горные панорамы.</p><Link href="/region">Подробнее →</Link></article>
        <article className="card card-hover"><h3>Комфортные домики</h3><p>Уютные варианты на 4–6 гостей с базовыми удобствами.</p><Link href="/houses">Смотреть →</Link></article>
        <article className="card card-hover"><h3>Активности круглый год</h3><p>Маршруты, зимний отдых и спокойный формат у базы.</p><Link href="/activities">Открыть →</Link></article>
      </AnimatedSection>

      <AnimatedSection className="card">
        <h2 style={{marginTop:0}}>Атмосфера Архыза</h2>
        <p>
          Утренний воздух, хвойный лес, тишина и горные виды — то, за чем возвращаются снова.
        </p>
        <div className="photo-strip" style={{marginTop:10}}>
          <img src="/images/hero-mountains-2.jpg" alt="Панорама гор" loading="lazy" />
          <img src="/images/house-winter-1.jpg" alt="Домик базы" loading="lazy" />
          <img src="/images/interior-dining-1.jpg" alt="Интерьер домика" loading="lazy" />
        </div>
      </AnimatedSection>

      <AnimatedSection className="card" style={{ marginTop: 14 }}>
        <h3 style={{ marginTop: 0 }}>Частые вопросы</h3>
        <p><b>Далеко ли до посёлка?</b> В 3 минутах езды до Архыза и в 15 минутах до курорта Романтик.</p>
        <p><b>Можно с детьми?</b> Да, подберём домик с удобной планировкой для семьи.</p>
        <p><b>Есть парковка?</b> Да, рядом с домиками предусмотрены места для авто.</p>
        <p style={{ marginBottom: 0 }}><b>Как быстро подтверждаете заявку?</b> Обычно в течение 10–30 минут в рабочее время.</p>
      </AnimatedSection>

      <AnimatedSection className="card" style={{ marginTop: 14 }}>
        <h3 style={{ marginTop: 0 }}>Готовы выбрать даты?</h3>
        <p style={{ marginTop: 0 }}>Оставьте заявку онлайн или посмотрите варианты домиков по вместимости и формату отдыха.</p>
        <div className="hero-actions">
          <Link href="/booking" className="btn-primary">Перейти к бронированию</Link>
          <Link href="/houses" className="btn-secondary">Выбрать домик</Link>
        </div>
      </AnimatedSection>
    </Layout>
  );
}
