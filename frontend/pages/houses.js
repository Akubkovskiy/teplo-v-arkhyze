import Layout from "../components/Layout";
import AnimatedSection from "../components/AnimatedSection";

const houses = [
  {
    name: "Домик в лесу 34 м²",
    guests: "до 4 гостей (+ доп. место)",
    price: "от 5 500 ₽/сутки",
    text: "Уютный домик с верандой и видом на горы. Wi‑Fi, горячая вода, мангальная зона.",
  },
  {
    name: "Семейный домик 40 м²",
    guests: "до 6 гостей",
    price: "от 7 500 ₽/сутки",
    text: "Две отдельные спальни, терраса, зона отдыха, парковка, комфорт для семьи или компании.",
  },
];

export default function HousesPage() {
  return (
    <Layout title="Домики">
      <AnimatedSection className="card">
        <p style={{ margin: 0 }}>
          Для каждого домика добавим отдельную фотогалерею и детальную комплектацию. Ниже — актуальные карточки с базовой информацией.
        </p>
      </AnimatedSection>

      <AnimatedSection className="grid2" style={{ marginTop: 14 }}>
        {houses.map((h, idx) => (
          <article className="card card-hover" key={h.name}>
            <img
              src={idx === 0 ? "/images/house-winter-1.jpg" : "/images/interior-dining-1.jpg"}
              alt={h.name}
              className="house-thumb"
            />
            <h3 style={{ marginTop: 12 }}>{h.name}</h3>
            <p>{h.text}</p>
            <p>👥 {h.guests}</p>
            <p>💰 {h.price}</p>
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
        </ul>
      </AnimatedSection>
    </Layout>
  );
}
