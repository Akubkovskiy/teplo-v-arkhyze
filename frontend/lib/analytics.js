const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"];
const UTM_STORAGE_KEY = "teplo_first_touch_utm";

export function captureUtm(query = {}) {
  if (typeof window === "undefined") return {};
  const current = getStoredUtm();
  const incoming = {};
  for (const key of UTM_KEYS) {
    if (query[key]) incoming[key] = String(query[key]);
  }
  const merged = { ...incoming, ...current };
  if (Object.keys(merged).length) {
    window.localStorage.setItem(UTM_STORAGE_KEY, JSON.stringify(merged));
  }
  return merged;
}

export function getStoredUtm() {
  if (typeof window === "undefined") return {};
  try {
    const value = JSON.parse(window.localStorage.getItem(UTM_STORAGE_KEY) || "{}");
    return value && typeof value === "object" ? value : {};
  } catch {
    return {};
  }
}

export function trackEvent(name, params = {}) {
  if (typeof window === "undefined") return;
  const counterId = process.env.NEXT_PUBLIC_YANDEX_METRIKA_ID;
  if (counterId && typeof window.ym === "function") {
    window.ym(Number(counterId), "reachGoal", name, params);
  }
}
