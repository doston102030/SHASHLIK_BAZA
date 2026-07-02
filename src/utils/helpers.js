/**
 * Sonni formatlash (1000 -> 1 000)
 */
export function formatNumber(number) {
  return Number(number || 0).toLocaleString("uz-UZ");
}

/**
 * Hozirgi vaqtni olish (HH:MM)
 */
export function getCurrentTime() {
  const date = new Date();
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
}

/**
 * Bugungi sanani olish
 */
export function getToday() {
  return new Date().toLocaleDateString("uz-UZ");
}

/**
 * Kategoriyaga mos emoji
 */
export function getCategoryEmoji(category) {
  const emojis = {
    "Kabob": "🍢",
    "Qiyma": "🥩",
    "Boshqa": "🌭",
    "Xom ashyo": "🍖",
    "Go'sht": "🍖",
  };
  return emojis[category] || "🍖";
}
