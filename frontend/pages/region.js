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

      <AnimatedSection className="grid2" style={{ marginTop: 14 }}>
        <article className="card card-hover">
          <h3 style={{ marginTop: 0 }}>Летом</h3>
          <p>
            Пешеходные маршруты, альпийские луга, панорамные точки, фотопрогулки и выезды на природу.
          </p>
        </article>
        <article className="card card-hover">
          <h3 style={{ marginTop: 0 }}>Зимой</h3>
          <p>
            Горнолыжный курорт Архыз, сноуборд, инструкторы, прокат и уютный вечер в тёплом домике после катания.
          </p>
        </article>
      </AnimatedSection>

      <AnimatedSection className="card" style={{ marginTop: 14 }}>
        <h3 style={{ marginTop: 0 }}>Почему гостям нравится Архыз</h3>
        <ul>
          <li>Чистый горный воздух и тишина</li>
          <li>Красивые виды в любое время года</li>
          <li>Возможность совместить активность и спокойный отдых</li>
        </ul>
      </AnimatedSection>
    </Layout>
  );
}
