import Layout from "../components/Layout";
import AnimatedSection from "../components/AnimatedSection";

export default function ContactsPage() {
  return (
    <Layout title="Контакты и как добраться">
      <AnimatedSection className="card">
        <p><b>📍 Локация:</b> Карачаево-Черкесская Республика, Зеленчукский район, с. Архыз.</p>
        <p>
          База расположена в тихой локации рядом с природой. До подъезда ведёт асфальтированная дорога.
          После бронирования отправим подробные ориентиры и схему подъезда.
        </p>
      </AnimatedSection>

      <AnimatedSection className="grid2" style={{ marginTop: 14 }}>
        <article className="card card-hover">
          <h3 style={{ marginTop: 0 }}>Перед выездом</h3>
          <ul>
            <li>Проверьте прогноз погоды в Архызе</li>
            <li>Уточните время заезда/выезда</li>
            <li>Сохраните контакт администратора</li>
          </ul>
        </article>
        <article className="card card-hover">
          <h3 style={{ marginTop: 0 }}>На месте</h3>
          <ul>
            <li>Парковка рядом с домиками</li>
            <li>Зона отдыха и мангал</li>
            <li>Помощь по размещению и вопросам</li>
          </ul>
        </article>
      </AnimatedSection>

      <AnimatedSection className="card" style={{ marginTop: 14 }}>
        <h3 style={{ marginTop: 0 }}>Ориентиры по маршруту</h3>
        <ul>
          <li>Двигайтесь в сторону с. Архыз по основной трассе без своротов на грунтовые дороги.</li>
          <li>За 15-20 минут до прибытия свяжитесь с администратором — подтвердим точку въезда.</li>
          <li>После бронирования отправляем точный pin и финальную схему подъезда.</li>
        </ul>
      </AnimatedSection>

      <AnimatedSection className="card" style={{ marginTop: 14 }}>
        <h3 style={{ marginTop: 0 }}>Контакты</h3>
        <p style={{ marginTop: 0, marginBottom: 8 }}><b>Telegram-бот:</b> <a href="https://t.me/Claw_kub_bot" target="_blank" rel="noreferrer">@Claw_kub_bot</a></p>
        <p style={{ marginTop: 0, marginBottom: 8 }}><b>Telegram администратора:</b> <a href="https://t.me/Alexey_kubkovskiy" target="_blank" rel="noreferrer">@Alexey_kubkovskiy</a></p>
        <p style={{ marginTop: 0, marginBottom: 8 }}><b>Телефон:</b> <a href="tel:+79251279722">+7 925 127-97-22</a></p>
        <p style={{ marginTop: 0, marginBottom: 0 }}><b>Email:</b> <a href="mailto:teploarkhyz@gmail.com">teploarkhyz@gmail.com</a></p>
      </AnimatedSection>

      <AnimatedSection className="card" style={{ marginTop: 14 }}>
        <h3 style={{ marginTop: 0 }}>Быстрые кнопки</h3>
        <div className="hero-actions">
          <a className="btn-secondary" href="https://yandex.ru/maps/?text=%D0%90%D1%80%D1%85%D1%8B%D0%B7" target="_blank" rel="noreferrer">Открыть карту</a>
          <a className="btn-primary" href="/booking">Оставить заявку</a>
        </div>
      </AnimatedSection>
    </Layout>
  );
}
