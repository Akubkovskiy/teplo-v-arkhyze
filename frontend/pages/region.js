import Layout from "../components/Layout";
import AnimatedSection from "../components/AnimatedSection";

export default function RegionPage() {
  return (
    <Layout title="О регионе Архыз">
      <AnimatedSection className="card">
        <p>
          Архыз — горный регион Карачаево-Черкесии с хвойными лесами, чистым воздухом и панорамами Кавказских вершин.
          Сюда приезжают за атмосферой уединения, природой и активным отдыхом круглый год.
        </p>
      </AnimatedSection>

      <AnimatedSection className="region-hero" style={{ marginTop: 14 }}>
        <img src="/images/hero-mountains-3.jpg" alt="Панорама Архыза" />
      </AnimatedSection>

      <AnimatedSection className="grid2" style={{ marginTop: 14 }}>
        <article className="card card-hover">
          <h3 style={{ marginTop: 0 }}>Летом</h3>
          <p>Походы, альпийские луга, панорамные точки, фотопрогулки и выезды на природу.</p>
        </article>
        <article className="card card-hover">
          <h3 style={{ marginTop: 0 }}>Зимой</h3>
          <p>Горнолыжный курорт Архыз, сноуборд, инструкторы, прокат и уютный вечер в домике.</p>
        </article>
      </AnimatedSection>
    </Layout>
  );
}
