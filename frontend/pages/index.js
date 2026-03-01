import Link from "next/link";
import Layout from "../components/Layout";

export default function Home() {
  return (
    <Layout>
      <section className="hero card">
        <h1>База отдыха «Тепло» · Архыз</h1>
        <p>
          Домики в лесу с видом на горы, тишина, уют и всё необходимое для отдыха.
        </p>
        <div className="hero-actions">
          <Link href="/booking" className="btn-primary">Забронировать</Link>
          <Link href="/houses" className="btn-secondary">Смотреть домики</Link>
        </div>
      </section>

      <section className="grid3">
        <article className="card"><h3>Домики</h3><p>Уютные варианты на 4–6 гостей.</p><Link href="/houses">Открыть →</Link></article>
        <article className="card"><h3>Чем заняться</h3><p>Маршруты, активности и отдых в горах.</p><Link href="/activities">Открыть →</Link></article>
        <article className="card"><h3>Как добраться</h3><p>Локация и полезные советы по пути.</p><Link href="/contacts">Открыть →</Link></article>
      </section>
    </Layout>
  );
}
