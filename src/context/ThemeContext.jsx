import { createContext, useContext, useState, useEffect } from "react";

// ────────────────────────────────────────────────────────────
// Ranglar
// ────────────────────────────────────────────────────────────
export const colors = {
  blue:   "#2563EB",
  green:  "#10B981",
  orange: "#FF9500",
  pink:   "#FF2D55",
  purple: "#AF52DE",
  red:    "#FF3B30",
  yellow: "#FFCC00",
  teal:   "#5AC8FA",
  gray:   "#6B7280",
};

// ────────────────────────────────────────────────────────────
// Light tema
// ────────────────────────────────────────────────────────────
const lightTheme = {
  mode: "light",
  bg:        "#F2F2F7",
  card:      "#FFFFFF",
  border:    "#E5E5EA",
  text:      "#1C1C1E",
  textSec:   "#636366",
  textTer:   "#8E8E93",
  textQuat:  "#AEAEB2",
  hover:     "#F9F9FB",
  input:     "#FFFFFF",
  inputBorder: "#D1D1D6",
  sidebar:   "#FFFFFF",
  sidebarBorder: "#E5E5EA",
  topbar:    "#FFFFFF",
  topbarBorder: "#E5E5EA",
  activeNav: "#EBF2FF",
  divider:   "#F2F2F7",
  overlay:   "rgba(0,0,0,0.32)",
  successSoft: "#E6F8F1",
  dangerSoft:  "#FFEBEA",
  warnSoft:    "#FFF3E2",
  purpleSoft:  "#F4E9FB",
  accentSoft:  "#EAF1FE",
  shadow:    "0 1px 2px rgba(0,0,0,.04), 0 6px 20px rgba(0,0,0,.05)",
  shadowBtn: "0 1px 2px rgba(37,99,235,.18), 0 8px 18px -6px rgba(37,99,235,.4)",
};

// ────────────────────────────────────────────────────────────
// Dark tema
// ────────────────────────────────────────────────────────────
const darkTheme = {
  mode: "dark",
  bg:        "#000000",
  card:      "#1C1C1E",
  border:    "#2C2C2E",
  text:      "#F2F2F7",
  textSec:   "#AEAEB2",
  textTer:   "#8E8E93",
  textQuat:  "#636366",
  hover:     "#2C2C2E",
  input:     "#2C2C2E",
  inputBorder: "#3A3A3C",
  sidebar:   "#1C1C1E",
  sidebarBorder: "#2C2C2E",
  topbar:    "#1C1C1E",
  topbarBorder: "#2C2C2E",
  activeNav: "#0A1A3A",
  divider:   "#2C2C2E",
  overlay:   "rgba(0,0,0,0.6)",
  successSoft: "#10271A",
  dangerSoft:  "#2C1715",
  warnSoft:    "#2A1F0C",
  purpleSoft:  "#221230",
  accentSoft:  "#16243F",
  shadow:    "0 1px 2px rgba(0,0,0,.5), 0 8px 26px rgba(0,0,0,.5)",
  shadowBtn: "0 2px 10px -2px rgba(59,130,246,.5)",
};

// ────────────────────────────────────────────────────────────
// Context
// ────────────────────────────────────────────────────────────
const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(false);
  const theme = isDark ? darkTheme : lightTheme;
  const toggleTheme = () => setIsDark(!isDark);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);

  return (
    <ThemeContext.Provider value={{ theme, isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme ThemeProvider ichida ishlatilishi kerak");
  }
  return context;
}
