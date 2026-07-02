// ────────────────────────────────────────────────────────────
// Yetkazib beruvchilar
// ────────────────────────────────────────────────────────────
export const SUPPLIERS = [
  "Fayzillo aka",
  "Sardor qassob",
  "Sherzod qassob",
  "Hoji aka",
  "Dilmurod",
];

// ────────────────────────────────────────────────────────────
// Filiallar
// ────────────────────────────────────────────────────────────
export const BRANCHES = ["SOXIL", "SHASHLIK HOUSE", "ASATBERK"];

// ────────────────────────────────────────────────────────────
// Kategoriyalar
// ────────────────────────────────────────────────────────────
export const CATEGORIES = ["Xom ashyo", "Qiyma", "Go'sht", "Kabob", "Boshqa"];

// ────────────────────────────────────────────────────────────
// Mahsulotlar
// ────────────────────────────────────────────────────────────
export const INITIAL_PRODUCTS = [
  { id: 1,  name: "Mol go'shti",        emoji: "🥩", category: "Xom ashyo", unit: "kg",   price: 95000,  cost: 80000,  minStock: 50, barcode: "4901234567890" },
  { id: 2,  name: "Mol yog'i",          emoji: "🫙", category: "Xom ashyo", unit: "kg",   price: 45000,  cost: 35000,  minStock: 20, barcode: "4901234567891" },
  { id: 3,  name: "Qo'y go'shti",       emoji: "🍖", category: "Xom ashyo", unit: "kg",   price: 110000, cost: 95000,  minStock: 30, barcode: "4901234567892" },
  { id: 4,  name: "Qo'y dumbasi",       emoji: "🥓", category: "Xom ashyo", unit: "kg",   price: 55000,  cost: 40000,  minStock: 10, barcode: "4901234567893" },
  { id: 5,  name: "Tovuq qanoti",       emoji: "🍗", category: "Xom ashyo", unit: "kg",   price: 38000,  cost: 28000,  minStock: 20, barcode: "4901234567894" },
  { id: 6,  name: "Tovuq filesi",       emoji: "🐔", category: "Xom ashyo", unit: "kg",   price: 65000,  cost: 52000,  minStock: 15, barcode: "4901234567895" },
  { id: 7,  name: "Qiyma (mol yog'li)", emoji: "🫕", category: "Qiyma",     unit: "dona", price: 85000,  cost: 70000,  minStock: 20, barcode: "4901234567896" },
  { id: 8,  name: "Qiyma (mol yog'siz)",emoji: "🫕", category: "Qiyma",     unit: "dona", price: 95000,  cost: 78000,  minStock: 15, barcode: "4901234567897" },
  { id: 9,  name: "O'rama qiyma",       emoji: "🌯", category: "Qiyma",     unit: "dona", price: 75000,  cost: 60000,  minStock: 10, barcode: "4901234567898" },
  { id: 10, name: "Sirli qiyma",        emoji: "🫕", category: "Qiyma",     unit: "dona", price: 70000,  cost: 55000,  minStock: 10, barcode: "4901234567899" },
  { id: 11, name: "Arzon qiyma",        emoji: "🫕", category: "Qiyma",     unit: "dona", price: 55000,  cost: 42000,  minStock: 15, barcode: "4901234567900" },
  { id: 12, name: "Jigar",              emoji: "🫀", category: "Go'sht",    unit: "dona", price: 50000,  cost: 35000,  minStock: 5,  barcode: "4901234567901" },
  { id: 13, name: "Shashlik",           emoji: "🍢", category: "Kabob",     unit: "dona", price: 18000,  cost: 12000,  minStock: 50, barcode: "4901234567902" },
  { id: 14, name: "Six kabob",          emoji: "🍢", category: "Kabob",     unit: "dona", price: 15000,  cost: 10000,  minStock: 30, barcode: "4901234567903" },
  { id: 15, name: "Kotlet",             emoji: "🍔", category: "Boshqa",    unit: "dona", price: 12000,  cost: 8000,   minStock: 30, barcode: "4901234567904" },
  { id: 16, name: "Qazi",               emoji: "🌭", category: "Xom ashyo", unit: "kg",   price: 35000,  cost: 25000,  minStock: 10, barcode: "4901234567905" },
  { id: 17, name: "Burger kotleti",     emoji: "🍔", category: "Boshqa",    unit: "dona", price: 14000,  cost: 9000,   minStock: 20, barcode: "4901234567906" },
  { id: 18, name: "File",               emoji: "🥩", category: "Go'sht",    unit: "dona", price: 105000, cost: 88000,  minStock: 10, barcode: "4901234567907" },
  { id: 19, name: "Qo'y chovrisi",      emoji: "🍖", category: "Xom ashyo", unit: "kg",   price: 60000,  cost: 45000,  minStock: 10, barcode: "4901234567908" },
  { id: 20, name: "Qanot",              emoji: "🍗", category: "Go'sht",    unit: "dona", price: 8000,   cost: 5000,   minStock: 50, barcode: "4901234567909" },
  { id: 21, name: "Qo'y go'shti",       emoji: "🍖", category: "Go'sht",    unit: "dona", price: 130000, cost: 110000, minStock: 20, barcode: "4901234567910" },
];

// ────────────────────────────────────────────────────────────
// Yetkazib beruvchi qaysi mahsulotlarni olib keladi
// ────────────────────────────────────────────────────────────
export const SUPPLIER_PRODUCTS = {
  "Fayzillo aka":  ["Mol go'shti", "Mol yog'i", "Qazi"],
  "Sardor qassob": ["Mol go'shti", "Mol yog'i"],
  "Sherzod qassob":["Qo'y go'shti", "Qo'y dumbasi", "Qo'y chovrisi"],
  "Hoji aka":      ["Qazi"],
  "Dilmurod":      ["Tovuq qanoti", "Tovuq filesi"],
};

// ────────────────────────────────────────────────────────────
// Filiallarga chiqariladigan (tayyor) mahsulotlar (ID ro'yxati)
// ────────────────────────────────────────────────────────────
export const BRANCH_OUT_PRODUCTS = [
  7,   // Qiyma (mol yog'li)
  8,   // Qiyma (mol yog'siz)
  9,   // O'rama qiyma
  10,  // Sirli qiyma
  11,  // Arzon qiyma
  12,  // Jigar
  13,  // Shashlik
  14,  // Six kabob
  15,  // Kotlet
  17,  // Burger kotleti
  18,  // File
  20,  // Qanot
  21,  // Qo'y go'shti (tayyor)
];

// ────────────────────────────────────────────────────────────
// Markaziy ombor boshlang'ich qoldiqlari
// ────────────────────────────────────────────────────────────
export const INITIAL_WAREHOUSE = {
  1: 0, 2: 0,  3: 0, 4: 0,
  5: 0, 6: 0,  7: 0, 8: 0,
  9: 0,  10: 0, 11: 0, 12: 0,
  13: 0, 14: 0, 15: 0, 16: 0,
  17: 0, 18: 0, 19: 0, 20: 0, 21: 0,
};

// ────────────────────────────────────────────────────────────
// Boshlang'ich qoldiqlarning kirim tarixi
// (hisobotlarda "kimdan qancha keldi" har doim mos chiqishi uchun)
// ────────────────────────────────────────────────────────────
export const INITIAL_INCOMINGS = Object.entries(INITIAL_WAREHOUSE)
  .filter(([, qty]) => qty > 0)
  .map(([productId, qty]) => ({
    id: `initial-${productId}`,
    supplier: "Boshlang'ich qoldiq",
    productId: Number(productId),
    quantity: qty,
    date: "2026-06-30T00:00:00.000Z",
  }));

// ────────────────────────────────────────────────────────────
// Filial omborlari boshlang'ich qoldiqlari
// ────────────────────────────────────────────────────────────
export const INITIAL_BRANCH_STOCK = {
  "SOXIL": {},
  "SHASHLIK HOUSE": {},
  "ASATBERK": {},
};

// ────────────────────────────────────────────────────────────
// Boshlang'ich tarix
// ────────────────────────────────────────────────────────────
export const INITIAL_HISTORY = [
  { time: "08:30", date: "30.06.2026", text: "Tizim ishga tushirildi", type: "info" },
];

// ────────────────────────────────────────────────────────────
// Tarix turi ranglari va nomlari
// ────────────────────────────────────────────────────────────
export const HISTORY_TYPES = {
  all:    { label: "Barchasi",         color: "#2563EB" },
  in:     { label: "Kirim",            color: "#2563EB" },
  prod:   { label: "Ishlab chiqarish", color: "#AF52DE" },
  out:    { label: "Yuborish",         color: "#FF9500" },
  sale:   { label: "Sotuv",            color: "#10B981" },
  chiqim: { label: "Chiqim",           color: "#FF3B30" },
  info:   { label: "Tizim",            color: "#8E8E93" },
};

// ────────────────────────────────────────────────────────────
// Rollar va ruxsat etilgan sahifalar
// ────────────────────────────────────────────────────────────
export const ROLES = ["Admin", "Omborchi"];

export const ROLE_PERMISSIONS = {
  Admin: ["dashboard", "warehouse", "products", "history", "reports", "users"],
  Omborchi: ["supplier", "warehouse", "consumption", "production", "branches", "history"],
};

// ────────────────────────────────────────────────────────────
// Login parollari (PIN)
// ────────────────────────────────────────────────────────────
export const ROLE_PINS = {
  Admin: "3333",
  Omborchi: "8888",
};

// ────────────────────────────────────────────────────────────
// Foydalanuvchilar / Xodimlar
// ────────────────────────────────────────────────────────────
export const USERS = [
  { id: 1, name: "Admin",    role: "Admin",    status: "Faol", color: "#2563EB", permissions: "Dashboard, Ombor, Mahsulotlar, Tarix, Hisobotlar, Foydalanuvchilar" },
  { id: 2, name: "Omborchi", role: "Omborchi", status: "Faol", color: "#10B981", permissions: "Kirim, Ombor, Xom ashyo sarfi, Ishlab chiqarish, Filiallar, Tarix" },
];
