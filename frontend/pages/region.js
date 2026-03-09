import Layout from "../components/Layout";
import AnimatedSection from "../components/AnimatedSection";

export default function RegionPage() {
  return (
    <Layout title="О регионе" description="Архыз — горный регион Карачаево-Черкесии: хвойные леса, чистый воздух, панорамы Кавказа. База «Тепло» расположена в лесу, в стороне от посёлка.">
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

      <AnimatedSection className="card" style={{ marginTop: 14 }}>
        <h3 style={{ marginTop: 0 }}>Почему выбирают Архыз</h3>
        <ul>
          <li><b>Климат и воздух:</b> хвойная зона и мягкий горный микроклимат.</li>
          <li><b>Визуальная среда:</b> открытые панорамы и тихие природные локации без городского шума.</li>
          <li><b>Баланс форматов:</b> можно совместить спокойный релакс и насыщенную программу в одной поездке.</li>
        </ul>
      </AnimatedSection>

      <AnimatedSection className="card" style={{ marginTop: 14 }}>
        <h3 style={{ marginTop: 0 }}>Когда лучше ехать</h3>
        <p>
          Если приоритет — фото-виды, тишина и восстановление, выбирайте даты с умеренной загрузкой локации.
          Для более активного формата подойдут периоды стабильной погоды и длинного светового дня.
        </p>
      </AnimatedSection>

      <AnimatedSection className="card" style={{ marginTop: 14 }}>
        <p style={{ marginTop: 0 }}>
          На странице региона мы показываем атмосферу и особенности места.
          Конкретные активности и форматы выездов собраны отдельно в разделе «Чем заняться».
        </p>
        <div className="hero-actions">
          <a className="btn-secondary" href="/activities">Смотреть активности</a>
          <a className="btn-primary" href="/booking">Выбрать даты</a>
        </div>
      </AnimatedSection>
    </Layout>
  );
}
