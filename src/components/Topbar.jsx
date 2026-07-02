import { Sun, Moon, RefreshCw } from "lucide-react";
import { useTheme, colors } from "../context/ThemeContext";
import { useLanguage } from "../context/LanguageContext";

export default function Topbar({ title }) {
  const { theme, isDark, toggleTheme } = useTheme();
  const { script, toggleScript } = useLanguage();

  return (
    <header
      style={{
        height: 72,
        background: theme.topbar,
        borderBottom: `1px solid ${theme.topbarBorder}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 32px",
        flexShrink: 0,
        boxShadow: "0 1px 0 rgba(0,0,0,0.02), 0 4px 16px rgba(0,0,0,0.02)",
        zIndex: 10,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, margin: 0, color: theme.text, letterSpacing: -0.4 }}>
          {title}
        </h1>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        {/* Yangilash */}
        <button
          className="icon-btn"
          onClick={() => window.location.reload()}
          title="Yangilash"
          style={{
            width: 46,
            height: 46,
            borderRadius: 14,
            border: `2px solid ${theme.inputBorder}`,
            background: theme.input,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <RefreshCw size={20} color={colors.blue} />
        </button>

        {/* Til (lotin/kirill) toggle */}
        <button
          className="icon-btn"
          onClick={toggleScript}
          title={script === "lotin" ? "Kirillchaga o'tish" : "Lotinchaga o'tish"}
          style={{
            height: 46,
            minWidth: 46,
            padding: "0 14px",
            borderRadius: 14,
            border: `2px solid ${theme.inputBorder}`,
            background: theme.input,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 800,
            fontSize: 13,
            color: colors.blue,
            letterSpacing: 0.2,
          }}
        >
          {script === "lotin" ? "УЗ" : "UZ"}
        </button>

        {/* Dark/Light toggle */}
        <button
          className="icon-btn"
          onClick={toggleTheme}
          title={isDark ? "Light mode" : "Dark mode"}
          style={{
            width: 46,
            height: 46,
            borderRadius: 14,
            border: `2px solid ${theme.inputBorder}`,
            background: theme.input,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {isDark ? (
            <Sun size={20} color={colors.yellow} />
          ) : (
            <Moon size={20} color={colors.purple} />
          )}
        </button>
      </div>
    </header>
  );
}
