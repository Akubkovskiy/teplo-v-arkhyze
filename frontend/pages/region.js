import Layout from "../components/Layout";
import AnimatedSection from "../components/AnimatedSection";

export default function RegionPage() {
  return (
    <Layout title="О регионе Архыз">
      <AnimatedSection className="card">
        <p>
          Архыз — одно из самых живописных мест Кавказа: хвойные леса, альпийские луга,
          снежные вершины и чистый горный воздух. Здесь комфортно и летом, и зимой.
        </p>
      </AnimatedSection>

      <AnimatedSection className="grid2" style={{ marginTop: 14 }}>
        <article className="card card-hover">
          <h3 style={{ marginTop: 0 }}>Летом</h3>
          <p>Походы, панорамные маршруты, фототочки, отдых у природы.</p>
        </article>
        <article className="card card-hover">
          <h3 style={{ marginTop: 0 }}>Зимой</h3>
          <p>Склоны Архыза, катание, зимние виды и уютные вечера в домике.</p>
        </article>
      </AnimatedSection>
    </Layout>
  );
}
