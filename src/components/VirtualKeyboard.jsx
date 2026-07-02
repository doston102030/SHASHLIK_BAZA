import { useState } from "react";
import { Delete, ArrowUp, X } from "lucide-react";
import { useTheme, colors } from "../context/ThemeContext";
import { useKeyboard } from "../context/KeyboardContext";

const ROWS = [
  ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"],
  ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
  ["a", "s", "d", "f", "g", "h", "j", "k", "l"],
  ["z", "x", "c", "v", "b", "n", "m", "o'", "g'"],
];

export default function VirtualKeyboard() {
  const { theme } = useTheme();
  const { activeField, clearActiveField } = useKeyboard();
  const [shift, setShift] = useState(false);

  if (!activeField) return null;

  const type = (char) => {
    const c = shift ? char.toUpperCase() : char;
    activeField.onChange((activeField.value || "") + c);
  };

  const backspace = () => activeField.onChange((activeField.value || "").slice(0, -1));
  const space = () => activeField.onChange((activeField.value || "") + " ");

  const keyStyle = {
    flex: 1,
    minWidth: 34,
    height: 46,
    borderRadius: 10,
    border: `1px solid ${theme.inputBorder}`,
    background: theme.card,
    color: theme.text,
    fontSize: 16,
    fontWeight: 600,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  const preventBlur = (e) => e.preventDefault();

  return (
    <div
      onMouseDown={preventBlur}
      style={{
        position: "fixed",
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 80,
        background: theme.sidebar,
        borderTop: `1px solid ${theme.sidebarBorder}`,
        boxShadow: "0 -8px 24px rgba(0,0,0,0.12)",
        padding: "10px 14px 14px",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <span style={{ fontSize: 12, fontWeight: 700, color: theme.textTer, textTransform: "uppercase", letterSpacing: 0.4 }}>
          {activeField.label || "Klaviatura"}
        </span>
        <button
          onMouseDown={preventBlur}
          onClick={clearActiveField}
          style={{
            width: 30, height: 30, borderRadius: 9, border: "none",
            background: `${colors.red}15`, color: colors.red, cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >
          <X size={15} />
        </button>
      </div>

      {ROWS.map((row, i) => (
        <div key={i} style={{ display: "flex", gap: 6, marginBottom: 6 }}>
          {row.map((key) => (
            <button key={key} onMouseDown={preventBlur} onClick={() => type(key)} style={keyStyle}>
              {shift ? key.toUpperCase() : key}
            </button>
          ))}
          {i === 2 && (
            <button
              onMouseDown={preventBlur}
              onClick={() => setShift((v) => !v)}
              style={{ ...keyStyle, flex: 1.5, background: shift ? colors.blue : theme.card, color: shift ? "#fff" : theme.text }}
            >
              <ArrowUp size={17} />
            </button>
          )}
          {i === 3 && (
            <button onMouseDown={preventBlur} onClick={backspace} style={{ ...keyStyle, flex: 1.5 }}>
              <Delete size={17} />
            </button>
          )}
        </div>
      ))}

      <div style={{ display: "flex", gap: 6 }}>
        <button onMouseDown={preventBlur} onClick={space} style={{ ...keyStyle, flex: 6 }}>
          Bo'sh joy
        </button>
        <button
          onMouseDown={preventBlur}
          onClick={clearActiveField}
          style={{ ...keyStyle, flex: 2, background: colors.blue, color: "#fff", border: "none" }}
        >
          Tayyor
        </button>
      </div>
    </div>
  );
}
