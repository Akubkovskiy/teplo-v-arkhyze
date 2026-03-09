import Layout from "../components/Layout";
import AnimatedSection from "../components/AnimatedSection";

const reviews = [
  {
    text: "Уютно, тихо, чисто. Очень красивый вид и приятная атмосфера.",
    who: "Гости из Ростова",
    source: "Яндекс Путешествия",
  },
  {
    text: "Отдыхали семьёй — комфортно, тепло и всё необходимое в домике есть.",
    who: "Семья с детьми",
    source: "Яндекс Путешествия",
  },
  {
    text: "Понравилось расположение: лес, горы и ощущение уединения.",
    who: "Пара, выходные",
    source: "Яндекс Путешествия",
  },
  {
    text: "Хороший интернет, удобная парковка и классная мангальная зона.",
    who: "Компания друзей",
    source: "Яндекс Путешествия",
  },
  {
    text: "Заселение прошло быстро, домик тёплый, вечером особенно красиво с подсветкой.",
    who: "Гости, зимний заезд",
    source: "Яндекс Путешествия",
  },
  {
    text: "Удобная база для выездов по Архызу: днём активности, вечером спокойный отдых.",
    who: "Пара, 3 дня",
    source: "Яндекс Путешествия",
  },
];

export default function ReviewsPage() {
  return (
    <Layout title="Отзывы гостей" description="Отзывы гостей базы отдыха «Тепло» рядом с Архызом. Реальные впечатления о домиках, природе и сервисе.">
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
            <small style={{ display: "block", opacity: 0.75, marginTop: 4 }}>Источник: {r.source}</small>
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

      <AnimatedSection className="card" style={{ marginTop: 14 }}>
        <h3 style={{ marginTop: 0 }}>Готовы подобрать даты?</h3>
        <p style={{ marginTop: 0 }}>Оставьте заявку — подберём подходящий домик и формат отдыха под ваш состав и сезон.</p>
        <div className="hero-actions">
          <a className="btn-primary" href="/booking">Перейти к бронированию</a>
          <a className="btn-secondary" href="/contacts">Задать вопрос</a>
        </div>
      </AnimatedSection>
    </Layout>
  );
}
