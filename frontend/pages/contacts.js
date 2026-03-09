import Layout from "../components/Layout";
import AnimatedSection from "../components/AnimatedSection";
import cfg from "../site.config";

export default function ContactsPage() {
  return (
    <Layout title="Контакты и как добраться" description="Контакты базы «Тепло» в Архызе: телефон, Telegram, координаты для навигатора и ссылки на карты.">
      <AnimatedSection className="card">
        <p><b>📍 Локация:</b> Карачаево-Черкесская Республика, Архыз.</p>
        <p>
          База расположена в лесу, в стороне от посёлка — без шума дорог и суеты. До подъезда ведёт асфальтированная дорога.
        </p>
        <p style={{ marginBottom: 4 }}><b>Координаты для навигатора:</b></p>
        <code style={{ display: "inline-block", padding: "8px 14px", background: "rgba(255,255,255,0.08)", borderRadius: 8, fontSize: 16, letterSpacing: 1, userSelect: "all", cursor: "pointer" }}>{cfg.coords.lat}, {cfg.coords.lon}</code>
        <div style={{ display: "flex", gap: 10, marginTop: 10, flexWrap: "wrap" }}>
          <a className="btn-secondary" style={{ fontSize: 14 }} href={cfg.yandexMapUrl} target="_blank" rel="noreferrer">Яндекс Карты</a>
          <a className="btn-secondary" style={{ fontSize: 14 }} href={cfg.googleMapUrl} target="_blank" rel="noreferrer">Google Maps</a>
          <a className="btn-secondary" style={{ fontSize: 14 }} href={cfg.gisMapUrl} target="_blank" rel="noreferrer">2ГИС</a>
        </div>
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
        <p style={{ marginTop: 0, marginBottom: 8 }}><b>Telegram-бот:</b> <a href={cfg.botUrl} target="_blank" rel="noreferrer">@{cfg.botUsername}</a></p>
        <p style={{ marginTop: 0, marginBottom: 8 }}><b>Telegram администратора:</b> <a href={cfg.adminUrl} target="_blank" rel="noreferrer">@{cfg.adminTelegram}</a></p>
        <p style={{ marginTop: 0, marginBottom: 8 }}><b>Телефон:</b> <a href={cfg.phoneHref}>{cfg.phone}</a></p>
        <p style={{ marginTop: 0, marginBottom: 0 }}><b>Email:</b> <a href={cfg.emailHref}>{cfg.email}</a></p>
      </AnimatedSection>

      <AnimatedSection className="card" style={{ marginTop: 14 }}>
        <h3 style={{ marginTop: 0 }}>Быстрые кнопки</h3>
        <div className="hero-actions">
          <a className="btn-secondary" href={cfg.yandexMapUrl} target="_blank" rel="noreferrer">Открыть карту</a>
          <a className="btn-primary" href="/booking">Оставить заявку</a>
        </div>
      </AnimatedSection>
    </Layout>
  );
}
