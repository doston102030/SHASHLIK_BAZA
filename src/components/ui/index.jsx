import { useState, useEffect } from "react";
import { Check, AlertTriangle, Info, Delete } from "lucide-react";
import { useTheme, colors } from "../../context/ThemeContext";
import { useKeyboard } from "../../context/KeyboardContext";

// ────────────────────────────────────────────────────────────
// Card
// ────────────────────────────────────────────────────────────
export function Card({ children, style = {}, accent, className = "" }) {
  const { theme } = useTheme();
  const borderSide = `1px solid ${theme.border}`;

  return (
    <div
      className={`animate-fade ${className}`}
      style={{
        background: theme.card,
        borderRadius: 20,
        padding: 24,
        borderTop: borderSide,
        borderRight: borderSide,
        borderBottom: borderSide,
        borderLeft: accent ? `4px solid ${accent}` : borderSide,
        boxShadow: "0 1px 2px rgba(0,0,0,0.03), 0 8px 24px rgba(0,0,0,0.05)",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

// ────────────────────────────────────────────────────────────
// StatCard — Dashboard statistika kartasi
// ────────────────────────────────────────────────────────────
export function StatCard({ label, value, subtitle, color = colors.blue, icon: IconComponent }) {
  const { theme } = useTheme();

  return (
    <Card className="hover-lift" style={{ padding: "22px 24px", cursor: "default" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <div
          style={{
            width: 52,
            height: 52,
            borderRadius: 16,
            background: `${color}15`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <IconComponent size={26} color={color} />
        </div>
        <div>
          <div style={{ fontSize: 13, color: theme.textTer, fontWeight: 600, marginBottom: 4, letterSpacing: 0.2 }}>
            {label}
          </div>
          <div style={{ fontSize: 26, fontWeight: 800, color: theme.text, lineHeight: 1.1 }}>
            {value}
          </div>
          {subtitle && (
            <div style={{ fontSize: 12, color: theme.textTer, marginTop: 4 }}>
              {subtitle}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}

// ────────────────────────────────────────────────────────────
// Button
// ────────────────────────────────────────────────────────────
export function Button({
  children,
  onClick,
  color = colors.blue,
  variant = "filled",
  size = "md",
  style = {},
  disabled = false,
  fullWidth = false,
}) {
  const padding = size === "sm" ? "8px 16px" : size === "lg" ? "16px 32px" : "11px 22px";
  const fontSize = size === "sm" ? 13 : size === "lg" ? 16 : 14;

  const getBackground = () => {
    if (variant === "filled") return color;
    if (variant === "outline") return "transparent";
    return `${color}10`;
  };

  return (
    <button
      className="app-btn"
      disabled={disabled}
      onClick={disabled ? undefined : onClick}
      style={{
        border: variant === "outline" ? `2px solid ${color}` : "none",
        borderRadius: 13,
        cursor: disabled ? "default" : "pointer",
        fontWeight: 700,
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        opacity: disabled ? 0.4 : 1,
        fontSize,
        padding,
        width: fullWidth ? "100%" : undefined,
        justifyContent: fullWidth ? "center" : undefined,
        background: getBackground(),
        color: variant === "filled" ? "#fff" : color,
        boxShadow: variant === "filled" ? `0 4px 14px ${color}30` : "none",
        ...style,
      }}
    >
      {children}
    </button>
  );
}

// ────────────────────────────────────────────────────────────
// Input
// ────────────────────────────────────────────────────────────
export function Input({ label, value, onChange, type = "text", placeholder, style = {} }) {
  const { theme } = useTheme();
  const { setActiveField, clearActiveField } = useKeyboard();
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    if (focused && type === "text") {
      setActiveField({ value, onChange, label });
      return () => clearActiveField();
    }
  }, [focused, value, onChange, label, type, setActiveField, clearActiveField]);

  return (
    <div style={{ marginBottom: 16, ...style }}>
      {label && (
        <label style={{ fontSize: 13, fontWeight: 700, color: theme.textSec, display: "block", marginBottom: 7 }}>
          {label}
        </label>
      )}
      <input
        type={type}
        lang={type === "date" ? "en-GB" : undefined}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={placeholder}
        style={{
          width: "100%",
          padding: "13px 16px",
          borderRadius: 13,
          border: `2px solid ${theme.inputBorder}`,
          fontSize: 15,
          outline: "none",
          boxSizing: "border-box",
          background: theme.input,
          color: theme.text,
          transition: "border 0.18s",
          fontWeight: 500,
        }}
      />
    </div>
  );
}

// ────────────────────────────────────────────────────────────
// Select
// ────────────────────────────────────────────────────────────
export function Select({ label, value, onChange, options, style = {} }) {
  const { theme } = useTheme();

  return (
    <div style={{ marginBottom: 16, ...style }}>
      {label && (
        <label style={{ fontSize: 13, fontWeight: 700, color: theme.textSec, display: "block", marginBottom: 7 }}>
          {label}
        </label>
      )}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: "100%",
          padding: "13px 16px",
          borderRadius: 13,
          border: `2px solid ${theme.inputBorder}`,
          fontSize: 15,
          outline: "none",
          boxSizing: "border-box",
          backgroundColor: theme.input,
          color: theme.text,
          appearance: "none",
          fontWeight: 500,
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%238E8E93' stroke-width='3' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "right 14px center",
        }}
      >
        {options.map((option) => {
          const val = typeof option === "string" ? option : option.value;
          const label = typeof option === "string" ? option : option.label;
          return (
            <option key={val} value={val}>
              {label}
            </option>
          );
        })}
      </select>
    </div>
  );
}

// ────────────────────────────────────────────────────────────
// OptionCards — bitta tanlovli (radio uslubidagi) bosib tanlanadigan kartochkalar
// ────────────────────────────────────────────────────────────
export function OptionCards({ options, value, onChange, minWidth = 130 }) {
  const { theme } = useTheme();

  return (
    <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${minWidth}px, 1fr))`, gap: 10 }}>
      {options.map((opt) => {
        const val = typeof opt === "string" ? opt : opt.value;
        const label = typeof opt === "string" ? opt : opt.label;
        const isActive = value === val;
        return (
          <button
            key={val}
            onClick={() => onChange(val)}
            className="hover-lift"
            style={{
              textAlign: "center",
              border: `1.5px solid ${isActive ? colors.blue : theme.border}`,
              background: isActive ? theme.activeNav : theme.card,
              borderRadius: 14,
              padding: "13px 14px",
              cursor: "pointer",
              fontWeight: 700,
              fontSize: 14,
              color: isActive ? colors.blue : theme.text,
            }}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}

// ────────────────────────────────────────────────────────────
// Badge
// ────────────────────────────────────────────────────────────
export function Badge({ text, color = colors.blue, icon: IconComponent }) {
  return (
    <span
      style={{
        padding: "5px 14px",
        borderRadius: 20,
        background: `${color}15`,
        color,
        fontSize: 12,
        fontWeight: 700,
        whiteSpace: "nowrap",
        letterSpacing: 0.1,
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
      }}
    >
      {IconComponent && <IconComponent size={11} />}
      {text}
    </span>
  );
}

// ────────────────────────────────────────────────────────────
// Modal
// ────────────────────────────────────────────────────────────
export function Modal({ open, onClose, title, children }) {
  const { theme } = useTheme();

  if (!open) return null;

  return (
    <div
      className="animate-fade"
      style={{
        position: "fixed",
        inset: 0,
        background: theme.overlay,
        backdropFilter: "blur(10px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 50,
      }}
      onClick={onClose}
    >
      <div
        className="animate-slide"
        onClick={(e) => e.stopPropagation()}
        style={{
          background: theme.card,
          borderRadius: 28,
          padding: 36,
          width: 540,
          maxHeight: "88vh",
          overflow: "auto",
          boxShadow: "0 32px 80px rgba(0,0,0,0.28)",
          border: `1px solid ${theme.border}`,
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, margin: 0, color: theme.text }}>{title}</h2>
          <button
            className="icon-btn"
            onClick={onClose}
            style={{
              background: `${colors.red}15`,
              border: "none",
              borderRadius: 12,
              width: 40,
              height: 40,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 18,
              color: colors.red,
            }}
          >
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────
// NumpadModal — POS uslubidagi miqdor kiritish klaviaturasi
// ────────────────────────────────────────────────────────────
export function NumpadModal({ open, onClose, title, unit = "kg", initialValue, onConfirm, confirmLabel = "Kirimni saqlash", confirmColor = colors.green }) {
  const { theme } = useTheme();
  const [value, setValue] = useState("");

  useEffect(() => {
    if (open) setValue(initialValue ? String(initialValue) : "");
  }, [open, initialValue]);

  if (!open) return null;

  const press = (key) => {
    if (key === "back") return setValue((v) => v.slice(0, -1));
    if (key === "." && value.includes(".")) return;
    setValue((v) => (v === "0" && key !== "." ? key : v + key));
  };

  const confirm = () => {
    const num = parseFloat(value);
    if (!num || num <= 0) {
      setValue("");
      return;
    }
    onConfirm(num);
  };

  return (
    <div
      className="animate-fade"
      style={{
        position: "fixed",
        inset: 0,
        background: theme.overlay,
        backdropFilter: "blur(10px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 60,
      }}
      onClick={onClose}
    >
      <div
        className="animate-slide"
        onClick={(e) => e.stopPropagation()}
        style={{
          background: theme.card,
          borderRadius: 24,
          padding: 24,
          width: 400,
          boxShadow: "0 32px 80px rgba(0,0,0,0.28)",
          border: `1px solid ${theme.border}`,
          position: "relative",
        }}
      >
        <button
          className="icon-btn"
          onClick={onClose}
          style={{
            position: "absolute",
            top: 14,
            right: 14,
            background: `${colors.red}15`,
            border: "none",
            borderRadius: 10,
            width: 32,
            height: 32,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 15,
            color: colors.red,
          }}
        >
          ✕
        </button>

        <div
          style={{
            background: theme.input,
            borderRadius: 16,
            padding: "20px 18px",
            textAlign: "center",
            marginBottom: 18,
          }}
        >
          <div style={{ fontSize: 13, fontWeight: 700, color: theme.textTer, marginBottom: 6 }}>{title}</div>
          <div style={{ fontSize: 36, fontWeight: 800, color: value ? theme.text : theme.textQuat }}>
            {value || "0"} <span style={{ fontSize: 17, fontWeight: 700, color: theme.textTer }}>{unit}</span>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 18 }}>
          {["1", "2", "3", "4", "5", "6", "7", "8", "9", ".", "0", "back"].map((key) => (
            <button
              key={key}
              onClick={() => press(key)}
              className="numpad-key"
              style={{
                border: `1.5px solid ${key === "back" ? `${colors.red}30` : `${colors.blue}25`}`,
                background: key === "back" ? `${colors.red}08` : `${colors.blue}08`,
                borderRadius: 16,
                padding: "22px 0",
                fontSize: 26,
                fontWeight: 800,
                color: key === "back" ? colors.red : colors.blue,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: theme.mode === "dark" ? "0 2px 0 rgba(255,255,255,0.04)" : "0 2px 0 rgba(0,0,0,0.04)",
              }}
            >
              {key === "back" ? <Delete size={22} /> : key}
            </button>
          ))}
        </div>

        <Button onClick={confirm} color={confirmColor} size="lg" fullWidth>
          <Check size={16} color="#fff" /> {confirmLabel}
        </Button>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────
// Table
// ────────────────────────────────────────────────────────────
export function Table({ columns, data, emptyText = "Ma'lumot yo'q", onRowClick }) {
  const { theme } = useTheme();

  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: 0 }}>
        <thead>
          <tr>
            {columns.map((col, index) => (
              <th
                key={index}
                style={{
                  textAlign: col.align || "left",
                  padding: "14px 18px",
                  fontSize: 13,
                  fontWeight: 700,
                  color: theme.textTer,
                  borderBottom: `2px solid ${theme.divider}`,
                  whiteSpace: "nowrap",
                  letterSpacing: 0.2,
                }}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 && (
            <tr>
              <td
                colSpan={columns.length}
                style={{ textAlign: "center", padding: 56, color: theme.textQuat, fontSize: 16 }}
              >
                {emptyText}
              </td>
            </tr>
          )}
          {data.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              onClick={onRowClick ? () => onRowClick(row) : undefined}
              style={{ transition: "background 0.12s", cursor: onRowClick ? "pointer" : "default" }}
              onMouseEnter={(e) => (e.currentTarget.style.background = theme.hover)}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >
              {columns.map((col, colIndex) => (
                <td
                  key={colIndex}
                  style={{
                    padding: "24px 18px",
                    fontSize: 15,
                    borderBottom: `1px solid ${theme.divider}`,
                    textAlign: col.align || "left",
                    color: theme.text,
                  }}
                >
                  {col.render ? col.render(row, rowIndex) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ────────────────────────────────────────────────────────────
// SectionTitle — sahifa ichidagi bo'lim sarlavhasi
// ────────────────────────────────────────────────────────────
export function SectionTitle({ children, extra }) {
  const { theme } = useTheme();

  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
      <h3 style={{ fontSize: 18, fontWeight: 800, margin: 0, color: theme.text }}>{children}</h3>
      {extra}
    </div>
  );
}

// ────────────────────────────────────────────────────────────
// SearchInput — qidirish maydoni
// ────────────────────────────────────────────────────────────
export function SearchInput({ value, onChange, placeholder = "Qidirish..." }) {
  const { theme } = useTheme();

  return (
    <div style={{ position: "relative", flex: 1, minWidth: 220 }}>
      <div style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", fontSize: 16, color: theme.textTer }}>
        🔍
      </div>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          width: "100%",
          padding: "13px 18px 13px 44px",
          borderRadius: 14,
          border: `2px solid ${theme.inputBorder}`,
          fontSize: 15,
          outline: "none",
          boxSizing: "border-box",
          background: theme.input,
          color: theme.text,
          fontWeight: 500,
        }}
      />
    </div>
  );
}

// ────────────────────────────────────────────────────────────
// TabBar — filtrlash uchun tab tugmalar
// ────────────────────────────────────────────────────────────
export function TabBar({ tabs, active, onChange, color = colors.blue }) {
  const { theme } = useTheme();

  return (
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap", background: theme.hover, padding: 5, borderRadius: 16 }}>
      {tabs.map((tab) => {
        const id = typeof tab === "string" ? tab : tab.id;
        const label = typeof tab === "string" ? tab : tab.label;
        const isActive = active === id;

        return (
          <button
            key={id}
            onClick={() => onChange(id)}
            style={{
              padding: "9px 20px",
              borderRadius: 12,
              border: "none",
              cursor: "pointer",
              fontSize: 14,
              fontWeight: 700,
              background: isActive ? color : "transparent",
              color: isActive ? "#fff" : theme.textSec,
              transition: "all 0.18s",
              boxShadow: isActive ? `0 2px 8px ${color}30` : "none",
            }}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}

// ────────────────────────────────────────────────────────────
// Toast — bildirishnoma
// ────────────────────────────────────────────────────────────
export function Toast({ message, type = "success" }) {
  if (!message) return null;

  const bgColor = type === "success" ? colors.green : type === "error" ? colors.red : colors.orange;
  const Icon = type === "success" ? Check : type === "error" ? AlertTriangle : Info;

  return (
    <div
      className="animate-toast"
      style={{
        position: "fixed",
        top: 28,
        left: "50%",
        transform: "translateX(-50%)",
        padding: "13px 26px",
        borderRadius: 16,
        background: bgColor,
        color: "#fff",
        fontWeight: 700,
        fontSize: 14.5,
        display: "flex",
        alignItems: "center",
        gap: 9,
        boxShadow: "0 14px 40px rgba(0,0,0,0.22)",
        zIndex: 100,
      }}
    >
      <Icon size={17} />
      {message}
    </div>
  );
}
