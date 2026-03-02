import Layout from "../components/Layout";
import AnimatedSection from "../components/AnimatedSection";

const reviews = [
  {
    text: "Уютно, тихо, чисто. Очень красивый вид и приятная атмосфера.",
    who: "Гости из Ростова",
  },
  {
    text: "Отдыхали семьёй — комфортно, тепло и всё необходимое в домике есть.",
    who: "Семья с детьми",
  },
  {
    text: "Понравилось расположение: лес, горы и ощущение уединения.",
    who: "Пара, выходные",
  },
  {
    text: "Хороший интернет, удобная парковка и классная мангальная зона.",
    who: "Компания друзей",
  },
];

export default function ReviewsPage() {
  return (
    <Layout title="Отзывы гостей">
      <AnimatedSection className="card">
        <p style={{ margin: 0 }}>
          Ниже — реальные впечатления гостей о тишине, чистоте, видах и атмосфере базы «Тепло».
          Мы регулярно обновляем сервис по отзывам после каждого заезда.
        </p>
      </AnimatedSection>

      <AnimatedSection className="reviews-grid" style={{ marginTop: 14 }}>
        {reviews.map((r, i) => (
          <article key={i} className="card card-hover review-card">
            <p>“{r.text}”</p>
            <small>{r.who}</small>
          </article>
        ))}
      </AnimatedSection>

      <AnimatedSection className="card" style={{ marginTop: 14 }}>
        <h3 style={{ marginTop: 0 }}>Фото атмосферы</h3>
        <div className="photo-strip">
          <img src="/images/hero-mountains-2.jpg" alt="Горы Архыза" />
          <img src="/images/house-winter-1.jpg" alt="Домик зимой" />
          <img src="/images/interior-dining-1.jpg" alt="Интерьер домика" />
        </div>
      </AnimatedSection>
    </Layout>
  );
}
