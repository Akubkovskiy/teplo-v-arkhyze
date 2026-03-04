import Link from "next/link";
import Layout from "../components/Layout";
import AnimatedSection from "../components/AnimatedSection";

export default function Home() {
  return (
    <Layout>
      <AnimatedSection className="hero card hero-mountain">
        <div className="hero-media">
          <img src="/images/hero-mountains-1.jpg" alt="Горы Архыза" />
        </div>
        <h1>База отдыха «Тепло» · Архыз</h1>
        <p>
          Уютные домики в Архызе для спокойного отдыха: горные виды, тишина, чистый воздух
          и готовый формат заселения без лишних сложностей.
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
          <img src="/images/hero-mountains-2.jpg" alt="Панорама гор" />
          <img src="/images/house-winter-1.jpg" alt="Домик базы" />
          <img src="/images/interior-dining-1.jpg" alt="Интерьер домика" />
        </div>
      </AnimatedSection>

      <AnimatedSection className="card" style={{ marginTop: 14 }}>
        <h3 style={{ marginTop: 0 }}>Частые вопросы</h3>
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
