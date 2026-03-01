import Layout from "../components/Layout";
import AnimatedSection from "../components/AnimatedSection";

const items = [
  ["Горные маршруты", "Трекинг и прогулки по живописным тропам Архыза."],
  ["Квадроциклы", "Прогулки с инструктором по согласованным маршрутам."],
  ["Зимний сезон", "Лыжи и сноуборд на курорте Архыз."],
  ["Спокойный отдых", "Очаг, чай, лесной воздух и вечерние виды."],
];

export default function ActivitiesPage() {
  return (
    <Layout title="Чем заняться">
      <AnimatedSection className="grid2">
        {items.map(([title, text]) => (
          <article className="card card-hover" key={title}>
            <h3 style={{ marginTop: 0 }}>{title}</h3>
            <p>{text}</p>
          </article>
        ))}
      </AnimatedSection>
    </Layout>
  );
}
