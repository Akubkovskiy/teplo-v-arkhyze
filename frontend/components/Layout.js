import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";

const SITE_NAME = "Тепло — база отдыха в Архызе";
const DEFAULT_DESC = "Домики в лесу, в стороне от посёлка. Без шума и суеты — только тишина, горы и чистый воздух. 3 домика на 2–6 гостей, до курорта 15 минут.";
const SITE_URL = "https://teplo-v-arkhyze.ru";
const OG_IMAGE = `${SITE_URL}/images/hero-mountains-1.jpg`;

const navItems = [
  ["/", "Главная"],
  ["/houses", "Домики"],
  ["/activities", "Чем заняться"],
  ["/region", "О регионе"],
  ["/reviews", "Отзывы"],
  ["/contacts", "Контакты"],
  ["/booking", "Бронирование"],
];

export default function Layout({ title, description, children }) {
  const router = useRouter();
  const pageTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME;
  const pageDesc = description || DEFAULT_DESC;
  const canonicalUrl = `${SITE_URL}${router.asPath === "/" ? "" : router.asPath}`.split("?")[0];

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDesc} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href={canonicalUrl} />

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content={SITE_NAME} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDesc} />
        <meta property="og:image" content={OG_IMAGE} />
        <meta property="og:locale" content="ru_RU" />

        {/* Preload hero images */}
        <link rel="preload" as="image" href="/images/hero-mountains-1.jpg" />
      </Head>

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
    </>
  );
}
