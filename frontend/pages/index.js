import Link from "next/link";
import Layout from "../components/Layout";
import AnimatedSection from "../components/AnimatedSection";

export default function Home() {
  return (
    <Layout>
      <AnimatedSection className="hero card hero-mountain">
        <h1>База отдыха «Тепло» · Архыз</h1>
        <p>
          Домики в лесу с видом на горы, тишина, уют и всё необходимое для отдыха.
        </p>
        <div className="hero-actions">
          <Link href="/booking" className="btn-primary">Забронировать</Link>
          <Link href="/houses" className="btn-secondary">Смотреть домики</Link>
        </div>
      </AnimatedSection>

      <AnimatedSection className="grid3">
        <article className="card card-hover"><h3>Домики</h3><p>Уютные варианты на 4–6 гостей.</p><Link href="/houses">Открыть →</Link></article>
        <article className="card card-hover"><h3>Чем заняться</h3><p>Маршруты, активности и отдых в горах.</p><Link href="/activities">Открыть →</Link></article>
        <article className="card card-hover"><h3>Как добраться</h3><p>Локация и полезные советы по пути.</p><Link href="/contacts">Открыть →</Link></article>
      </AnimatedSection>

      <AnimatedSection className="card">
        <h2 style={{marginTop:0}}>Атмосфера Архыза</h2>
        <p>
          Утренний воздух, хвойный лес, тишина и горные виды — то, за чем возвращаются снова.
          На следующих этапах добавим полноценные фото-блоки и отзывы гостей.
        </p>
      </AnimatedSection>
    </Layout>
  );
}
