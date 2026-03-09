/** Site-wide settings — all from NEXT_PUBLIC_* env vars with sensible defaults */
const config = {
  botUsername: process.env.NEXT_PUBLIC_BOT_USERNAME || "TeploCampBot",
  adminTelegram: process.env.NEXT_PUBLIC_ADMIN_TELEGRAM || "Alexey_kubkovskiy",
  phone: process.env.NEXT_PUBLIC_PHONE || "+79251279722",
  email: process.env.NEXT_PUBLIC_EMAIL || "teploarkhyz@gmail.com",
  coords: { lat: "43.560731", lon: "41.284236" },
};

config.botUrl = `https://t.me/${config.botUsername}`;
config.adminUrl = `https://t.me/${config.adminTelegram}`;
config.phoneHref = `tel:${config.phone.replace(/[\s\-()]/g, "")}`;
config.emailHref = `mailto:${config.email}`;
config.yandexMapUrl = `https://yandex.ru/maps/?pt=${config.coords.lon},${config.coords.lat}&z=15&l=map`;
config.googleMapUrl = `https://www.google.com/maps?q=${config.coords.lat},${config.coords.lon}`;
config.gisMapUrl = `https://2gis.ru/geo/${config.coords.lon},${config.coords.lat}`;

export default config;
