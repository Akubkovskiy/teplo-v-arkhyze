import Layout from "../components/Layout";
import AnimatedSection from "../components/AnimatedSection";

export default function ContactsPage() {
  return (
    <Layout title="Контакты и как добраться">
      <AnimatedSection className="card">
        <p>📍 Карачаево-Черкесская Республика, Зеленчукский район, с. Архыз.</p>
        <p>
          До базы ведёт асфальтированная дорога. На следующем этапе добавим карту и детальный маршрут
          с видео/подсказками по подъезду.
        </p>
      </AnimatedSection>
    </Layout>
  );
}
