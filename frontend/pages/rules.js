import Link from "next/link";
import Layout from "../components/Layout";
import AnimatedSection from "../components/AnimatedSection";
import cfg from "../site.config";

export default function RulesPage() {
  return (
    <Layout
      title="Правила и условия"
      description="Правила проживания и условия бронирования на базе «Тепло» в Архызе. Отмена, дети, питомцы, заезд и выезд."
    >
      <AnimatedSection className="card">
        <h2 style={{ marginTop: 0 }}>Бронирование и оплата</h2>
        <ul>
          <li>Бронирование подтверждается после внесения предоплаты.</li>
          <li>Предоплата — переводом по реквизитам, которые отправим после подтверждения заявки.</li>
          <li>Остаток оплачивается при заезде.</li>
        </ul>

        <h3>Отмена бронирования</h3>
        <ul>
          <li>Отмена за 7 и более дней до заезда — полный возврат предоплаты.</li>
          <li>Отмена за 3–6 дней — возврат 50% предоплаты.</li>
          <li>Отмена менее чем за 3 дня — предоплата не возвращается.</li>
          <li>Перенос дат — бесплатно при наличии свободных мест.</li>
        </ul>
      </AnimatedSection>

      <AnimatedSection className="card" style={{ marginTop: 14 }}>
        <h2 style={{ marginTop: 0 }}>Заезд и выезд</h2>
        <ul>
          <li>Заезд — с 14:00.</li>
          <li>Выезд — до 12:00.</li>
          <li>Ранний заезд или поздний выезд — по согласованию с администратором.</li>
          <li>Координаты и схему подъезда отправляем после подтверждения бронирования.</li>
        </ul>
      </AnimatedSection>

      <AnimatedSection className="card" style={{ marginTop: 14 }}>
        <h2 style={{ marginTop: 0 }}>Проживание</h2>
        <h3>Дети</h3>
        <ul>
          <li>Дети любого возраста — бесплатно (в рамках вместимости домика).</li>
          <li>Дополнительное спальное место для ребёнка — уточняйте при бронировании.</li>
        </ul>

        <h3>Питомцы</h3>
        <ul>
          <li>Размещение с домашними животными — по согласованию.</li>
          <li>Просим предупредить заранее при бронировании.</li>
          <li>Хозяин несёт ответственность за чистоту и порядок.</li>
        </ul>

        <h3>Тишина</h3>
        <ul>
          <li>Тихие часы — с 23:00 до 08:00.</li>
          <li>База расположена в лесу — просим уважать природу и соседей.</li>
        </ul>
      </AnimatedSection>

      <AnimatedSection className="card" style={{ marginTop: 14 }}>
        <h2 style={{ marginTop: 0 }}>На территории</h2>
        <ul>
          <li>Парковка — бесплатно, рядом с домиками.</li>
          <li>Мангальная зона — в общем пользовании.</li>
          <li>Курение — только на улице, в отведённых местах.</li>
          <li>Мусор — просим выносить в контейнеры при выезде.</li>
        </ul>
      </AnimatedSection>

      <AnimatedSection className="card" style={{ marginTop: 14 }}>
        <h3 style={{ marginTop: 0 }}>Вопросы?</h3>
        <p style={{ marginTop: 0 }}>Свяжитесь с нами — ответим на любые вопросы по размещению.</p>
        <div className="hero-actions">
          <Link href="/booking" className="btn-primary">Забронировать</Link>
          <a className="btn-secondary" href={cfg.adminUrl} target="_blank" rel="noreferrer">Написать администратору</a>
        </div>
      </AnimatedSection>
    </Layout>
  );
}
