import Layout from "../components/Layout";
import AnimatedSection from "../components/AnimatedSection";

const items = [
  ["Треккинг и панорамные маршруты", "Прогулки по горным тропам Архыза с видами на хребты и альпийские луга. Формат — от лёгких прогулок до маршрутов на весь день.", "/images/hero-mountains-2.jpg"],
  ["Конные прогулки", "По живописным долинам и предгорьям. Подходит для тех, кто хочет спокойный темп и красивые кадры на фоне гор.", "/images/hero-mountains-1.jpg"],
  ["Квадроциклы и off-road", "Маршруты с инструктором по согласованным трекам. Лучше бронировать заранее в сезон высокого спроса.", "/images/hero-mountains-3.jpg"],
  ["Зимний Архыз", "Лыжи и сноуборд на курорте: трассы разного уровня, прокат и обучение с инструктором.", "/images/house-winter-1.jpg"],
  ["Спокойный отдых у базы", "Мангал, беседка, зона очага, вечерние виды и лесная тишина — без спешки и суеты.", "/images/interior-dining-1.jpg"],
  ["Индивидуальная программа", "Если нужен особый формат отдыха, оставьте заявку — подберём активности под ваш состав и даты.", "/images/interior-bath-1.jpg"],
];

export default function ActivitiesPage() {
  return (
    <Layout title="Чем заняться в Архызе">
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
    </Layout>
  );
}
