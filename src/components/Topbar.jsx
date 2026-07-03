import { Sun, Moon, RefreshCw, Menu } from "lucide-react";
import { useTheme, colors } from "../context/ThemeContext";
import { useLanguage } from "../context/LanguageContext";

export default function Topbar({ title, onMenuClick, isMobile }) {
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
        padding: isMobile ? "0 14px" : "0 32px",
        flexShrink: 0,
        boxShadow: "0 1px 0 rgba(0,0,0,0.02), 0 4px 16px rgba(0,0,0,0.02)",
        zIndex: 10,
        gap: 12,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: isMobile ? 8 : 12, minWidth: 0, flex: "1 1 auto" }}>
        {isMobile && (
          <button
            className="icon-btn"
            onClick={onMenuClick}
            title="Menyu"
            style={{
              width: 36,
              height: 36,
              borderRadius: 12,
              border: `2px solid ${theme.inputBorder}`,
              background: theme.input,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <Menu size={18} color={colors.blue} />
          </button>
        )}
        <h1
          style={{
            fontSize: isMobile ? 15 : 24,
            fontWeight: 800,
            margin: 0,
            color: theme.text,
            letterSpacing: -0.4,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            minWidth: 0,
          }}
        >
          {title}
        </h1>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: isMobile ? 6 : 16, flexShrink: 0 }}>
        {/* Yangilash (mobilda joy tejash uchun yashiriladi) */}
        {!isMobile && (
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
        )}

        {/* Til (lotin/kirill) toggle */}
        <button
          className="icon-btn"
          onClick={toggleScript}
          title={script === "lotin" ? "Kirillchaga o'tish" : "Lotinchaga o'tish"}
          style={{
            height: isMobile ? 38 : 46,
            minWidth: isMobile ? 38 : 46,
            padding: isMobile ? "0 10px" : "0 14px",
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
            width: isMobile ? 38 : 46,
            height: isMobile ? 38 : 46,
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
