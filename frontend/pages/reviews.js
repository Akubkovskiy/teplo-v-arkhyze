import Layout from "../components/Layout";
import AnimatedSection from "../components/AnimatedSection";

const reviews = [
  "Уютно, тихо, чисто. Красивый вид на горы.",
  "Очень понравилась атмосфера и гостеприимство.",
  "Отличное место для спокойного отдыха в Архызе.",
];

export default function ReviewsPage() {
  return (
    <Layout title="Отзывы гостей">
      <AnimatedSection className="grid2">
        {reviews.map((r, i) => (
          <article key={i} className="card card-hover">
            <p style={{ margin: 0 }}>“{r}”</p>
          </article>
        ))}
      </AnimatedSection>
    </Layout>
  );
}
