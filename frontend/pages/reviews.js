import Layout from "../components/Layout";
import AnimatedSection from "../components/AnimatedSection";
import cfg from "../site.config";

export default function ReviewsPage() {
  return (
    <Layout title="Отзывы гостей" description="Отзывы гостей базы отдыха «Тепло» в Архызе. Реальные впечатления о домиках, природе и сервисе.">
      <AnimatedSection className="card">
        <p style={{ margin: 0 }}>
          Мы собираем реальные впечатления гостей после каждого заезда. Пока отзывы не перенесены
          на сайт, их можно посмотреть и оставить на Яндекс.Картах.
        </p>
      </AnimatedSection>

      <AnimatedSection className="card" style={{ marginTop: 14 }}>
        <h2 style={{ marginTop: 0 }}>Отзывы на Яндекс.Картах</h2>
        <p>Откройте карточку базы, чтобы увидеть актуальные оценки и комментарии гостей.</p>
        <div className="hero-actions">
          <a className="btn-primary" href={cfg.yandexReviewsUrl} target="_blank" rel="noreferrer">Смотреть отзывы</a>
        </div>
      </AnimatedSection>

      <AnimatedSection className="card" style={{ marginTop: 14 }}>
        <h3 style={{ marginTop: 0 }}>Фото атмосферы</h3>
        <div className="photo-strip">
          <img src="/images/hero-mountains-2.jpg" alt="Горы Архыза" loading="lazy" />
          <img src="/images/house-winter-1.jpg" alt="Домик зимой" loading="lazy" />
          <img src="/images/interior-dining-1.jpg" alt="Интерьер домика" loading="lazy" />
        </div>
      </AnimatedSection>

      <AnimatedSection className="card" style={{ marginTop: 14 }}>
        <h3 style={{ marginTop: 0 }}>Побывали у нас?</h3>
        <p style={{ marginTop: 0 }}>Оставьте отзыв на Яндекс.Картах — это помогает другим путешественникам нас найти.</p>
        <div className="hero-actions">
          <a className="btn-secondary" href={cfg.yandexReviewsUrl} target="_blank" rel="noreferrer">Оставить отзыв →</a>
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
