import Layout from "../components/Layout";
import AnimatedSection from "../components/AnimatedSection";

const houses = [
  {
    name: "Домик в лесу 34 м²",
    guests: "до 4 гостей (+ доп. место)",
    price: "от 5 000 ₽/сутки",
    text: "Уютный домик с верандой и видом на горы. Wi‑Fi, горячая вода, мангальная зона.",
    img: "/images/house-winter-1.jpg",
  },
  {
    name: "Семейный домик 40 м²",
    guests: "до 6 гостей",
    price: "от 7 000 ₽/сутки",
    text: "Две отдельные спальни, терраса, зона отдыха, парковка, комфорт для семьи или компании.",
    img: "/images/interior-dining-1.jpg",
  },
  {
    name: "Компактный домик 32 м²",
    guests: "до 4 гостей",
    price: "по запросу",
    text: "Практичный формат для короткого отдыха: базовый комфорт и приватная атмосфера.",
    img: "/images/interior-bath-1.jpg",
  },
];

export default function HousesPage() {
  return (
    <Layout title="Домики" description="Домики базы «Тепло» рядом с Архызом: от 34 до 40 м², на 2–6 гостей. Wi-Fi, кухня, мангал, парковка.">
      <AnimatedSection className="card">
        <p style={{ margin: 0 }}>
          Ниже — финальные карточки по каждому домику: формат размещения, базовые удобства и быстрый выбор для бронирования. Отдельную расширенную галерею по каждому домику добавим после финального фото-пакета.
        </p>
      </AnimatedSection>

      <AnimatedSection className="grid3" style={{ marginTop: 14 }}>
        {houses.map((h, idx) => (
          <article className="card card-hover" key={h.name}>
            <img src={h.img} alt={h.name} className="house-thumb" />
            <h3 style={{ marginTop: 12 }}>{h.name}</h3>
            <p>{h.text}</p>
            <p>👥 {h.guests}</p>
            <p>💰 {h.price}</p>
            <a className="btn-primary" href={`/booking?house=${idx + 1}`}>Выбрать этот домик</a>
          </article>
        ))}
      </AnimatedSection>

      <AnimatedSection className="card" style={{ marginTop: 14 }}>
        <h3 style={{ marginTop: 0 }}>Что есть в домиках</h3>
        <ul>
          <li>Wi‑Fi и горячая вода</li>
          <li>Постельное бельё и полотенца</li>
          <li>Кухонная зона и посуда</li>
          <li>Мангальная зона и парковка</li>
          <li>Лесная атмосфера и видовые точки рядом с базой</li>
        </ul>
      </AnimatedSection>

      <AnimatedSection className="card" style={{ marginTop: 14 }}>
        <h3 style={{ marginTop: 0 }}>Подбор по формату отдыха</h3>
        <p style={{ marginBottom: 8 }}><b>Пара / спокойный отдых:</b> компактный домик, приватность и тихий режим.</p>
        <p style={{ marginBottom: 8 }}><b>Семья:</b> семейный домик с двумя спальнями и удобной зоной отдыха.</p>
        <p style={{ margin: 0 }}><b>Компания друзей:</b> домик с удобным общим пространством и мангальной зоной.</p>
      </AnimatedSection>

      <AnimatedSection className="card" style={{ marginTop: 14 }}>
        <h3 style={{ marginTop: 0 }}>Галерея домиков</h3>
        <div className="photo-strip" style={{ marginTop: 10 }}>
          <img src="/images/house-winter-1.jpg" alt="Домик зимой" />
          <img src="/images/interior-dining-1.jpg" alt="Гостиная и обеденная зона" />
          <img src="/images/interior-bath-1.jpg" alt="Санузел" />
          <img src="/images/hero-mountains-1.jpg" alt="Вид на горы" />
          <img src="/images/hero-mountains-2.jpg" alt="Атмосфера Архыза" />
          <img src="/images/hero-mountains-3.jpg" alt="Панорама региона" />
        </div>
      </AnimatedSection>
    </Layout>
  );
}
