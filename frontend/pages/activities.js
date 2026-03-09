import Layout from "../components/Layout";
import AnimatedSection from "../components/AnimatedSection";

const items = [
  ["Треккинг и панорамные маршруты", "Прогулки по горным тропам Архыза с видами на хребты и альпийские луга. Формат — от лёгких прогулок до маршрутов на весь день.", "/images/hero-mountains-2.jpg"],
  ["Конные прогулки", "По живописным долинам и предгорьям. Подходит для тех, кто хочет спокойный темп и красивые кадры на фоне гор.", "/images/hero-mountains-1.jpg"],
  ["Квадроциклы и off-road", "Маршруты с инструктором по согласованным трекам. Лучше бронировать заранее в сезон высокого спроса.", "/images/hero-mountains-3.jpg"],
  ["Зимний Архыз", "Лыжи и сноуборд на курорте: трассы разного уровня, прокат и обучение с инструктором.", "/images/house-winter-1.jpg"],
  ["Спокойный отдых у базы", "Мангал, беседка, зона очага, вечерние виды и лесная тишина — без спешки и суеты.", "/images/house-winter-1.jpg"],
  ["Индивидуальная программа", "Если нужен особый формат отдыха, оставьте заявку — подберём активности под ваш состав и даты.", "/images/hero-mountains-3.jpg"],
];

export default function ActivitiesPage() {
  return (
    <Layout title="Чем заняться" description="Треккинг, конные прогулки, квадроциклы, горнолыжный курорт Романтик и спокойный отдых у базы «Тепло» в Архызе.">
      <AnimatedSection className="card">
        <p style={{ margin: 0 }}>
          Архыз — это не только горнолыжный сезон. Летом здесь треккинг, конные прогулки, панорамы и чистый воздух,
          а зимой — трассы, инструкторы и снежные виды Кавказа.
        </p>
      </AnimatedSection>

      <AnimatedSection className="grid2" style={{ marginTop: 14 }}>
        {items.map(([title, text, img]) => (
          <article className="card card-hover" key={title}>
            <img src={img} alt={title} className="house-thumb" />
            <h3 style={{ marginTop: 12 }}>{title}</h3>
            <p>{text}</p>
          </article>
        ))}
      </AnimatedSection>

      <AnimatedSection className="grid2" style={{ marginTop: 14 }}>
        <article className="card card-hover">
          <h3 style={{ marginTop: 0 }}>Лето</h3>
          <p>Треккинг, конные прогулки, панорамные точки и спокойные выезды по окрестностям Архыза.</p>
        </article>
        <article className="card card-hover">
          <h3 style={{ marginTop: 0 }}>Зима</h3>
          <p>Горнолыжный формат, инструкторы, прокат и вечерний отдых в тёплом домике после активного дня.</p>
        </article>
      </AnimatedSection>

      <AnimatedSection className="card" style={{ marginTop: 14 }}>
        <h3 style={{ marginTop: 0 }}>Как выбрать активность</h3>
        <ul>
          <li><b>Спокойный формат:</b> прогулки и панорамы, без перегруза.</li>
          <li><b>Семейный формат:</b> лёгкие маршруты и короткие выезды.</li>
          <li><b>Динамичный формат:</b> квадро/зимние активности с инструктором.</li>
        </ul>
        <p style={{ marginBottom: 0 }}>
          Часть активностей организуется через партнёров и инструкторов по предварительному согласованию.
          Подберём доступные варианты под даты, состав гостей и уровень подготовки.
        </p>
      </AnimatedSection>

      <AnimatedSection className="card" style={{ marginTop: 14 }}>
        <div className="hero-actions">
          <a className="btn-secondary" href="/contacts">Уточнить детали</a>
          <a className="btn-primary" href="/booking">Оставить заявку</a>
        </div>
      </AnimatedSection>
    </Layout>
  );
}
