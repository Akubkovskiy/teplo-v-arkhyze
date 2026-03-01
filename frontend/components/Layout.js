import Link from "next/link";

const navItems = [
  ["/", "Главная"],
  ["/houses", "Домики"],
  ["/activities", "Чем заняться"],
  ["/region", "О регионе"],
  ["/reviews", "Отзывы"],
  ["/contacts", "Контакты"],
  ["/booking", "Бронирование"],
];

export default function Layout({ title, children }) {
  return (
    <div className="site-wrap">
      <header className="site-header">
        <div className="container row between center">
          <Link href="/" className="brand">Тепло · Архыз</Link>
          <nav className="nav">
            {navItems.map(([href, label]) => (
              <Link key={href} href={href} className="nav-link">{label}</Link>
            ))}
          </nav>
        </div>
      </header>

      <main className="container">
        {title ? <h1 className="page-title">{title}</h1> : null}
        {children}
      </main>

      <footer className="site-footer">
        <div className="container">© {new Date().getFullYear()} База отдыха «Тепло», Архыз</div>
      </footer>
    </div>
  );
}
