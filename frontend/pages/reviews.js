import Layout from "../components/Layout";
import AnimatedSection from "../components/AnimatedSection";

const reviews = [
  "Уютно, тихо, чисто. Очень красивый вид и приятная атмосфера.",
  "Отдыхали семьёй — комфортно, тепло и всё необходимое в домике есть.",
  "Понравилось расположение: лес, горы и ощущение уединения.",
  "Хороший интернет, удобная парковка и классная мангальная зона.",
  "Отдельный плюс — гостеприимство и помощь по всем вопросам на месте.",
];

export default function ReviewsPage() {
  return (
    <Layout title="Отзывы гостей">
      <AnimatedSection className="card">
        <p style={{ margin: 0 }}>
          Мы собираем обратную связь после каждого заезда и постоянно улучшаем сервис.
          Ниже — типичные впечатления гостей о базе отдыха «Тепло».
        </p>
      </AnimatedSection>

      <AnimatedSection className="grid2" style={{ marginTop: 14 }}>
        {reviews.map((r, i) => (
          <article key={i} className="card card-hover">
            <p style={{ margin: 0 }}>“{r}”</p>
          </article>
        ))}
      </AnimatedSection>
    </Layout>
  );
}
