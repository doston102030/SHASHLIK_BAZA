import { useState, useEffect } from "react";
import { Delete, Moon, Sun } from "lucide-react";
import { useTheme, colors } from "../context/ThemeContext";
import { ROLE_PINS } from "../utils/data";

const KEYS = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];

export default function Login({ employees, onLogin }) {
  const { theme, isDark, toggleTheme } = useTheme();
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = (np) => {
    setBusy(true);
    setTimeout(() => {
      const role = Object.keys(ROLE_PINS).find((r) => ROLE_PINS[r] === np);
      const employee = role && employees.find((e) => e.role === role && e.status === "Faol");

      if (!employee) {
        setError(role ? `${role} roli uchun faol xodim topilmadi` : "PIN noto'g'ri");
        setPin("");
        setBusy(false);
        return;
      }

      setError("");
      setPin("");
      setBusy(false);
      onLogin(employee);
    }, 180);
  };

  const press = (d) => {
    if (busy) return;
    setError("");
    if (d === "del") return setPin((p) => p.slice(0, -1));
    if (pin.length >= 4) return;
    const np = pin + d;
    setPin(np);
    if (np.length === 4) submit(np);
  };

  useEffect(() => {
    const onKey = (e) => {
      if (e.key >= "0" && e.key <= "9") press(e.key);
      else if (e.key === "Backspace") press("del");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [pin, busy]);

  const keyBtnStyle = {
    height: 64,
    borderRadius: 999,
    border: `1px solid ${theme.inputBorder}`,
    background: theme.card,
    color: theme.text,
    fontSize: 24,
    fontWeight: 500,
    cursor: "pointer",
    display: "grid",
    placeItems: "center",
    boxShadow: theme.shadow,
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: theme.bg,
        color: theme.text,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        position: "relative",
      }}
    >
      <button
        className="icon-btn"
        onClick={toggleTheme}
        style={{
          position: "absolute",
          top: 24,
          right: 24,
          width: 40,
          height: 40,
          borderRadius: 12,
          border: `1px solid ${theme.inputBorder}`,
          background: theme.card,
          color: theme.text,
          cursor: "pointer",
          display: "grid",
          placeItems: "center",
        }}
      >
        {isDark ? <Sun size={18} /> : <Moon size={18} />}
      </button>

      <div className="animate-fade" style={{ width: "100%", maxWidth: 380, textAlign: "center" }}>
        <img
          src={isDark ? "/assets/DARK-logo.png" : "/assets/LITE-logo.png"}
          alt="Go'sht ERP"
          style={{ height: 130, width: "auto", margin: "0 auto 16px", display: "block" }}
        />
        <div style={{ color: theme.textTer, fontSize: 13.5, marginTop: 10 }}>
          {busy ? "Tekshirilmoqda…" : "PIN kodingizni kiriting"}
        </div>

        <div style={{ marginTop: 26 }}>
          <div
            className={error ? "animate-fade" : ""}
            style={{
              display: "flex",
              gap: 14,
              justifyContent: "center",
              marginBottom: 12,
              animation: error ? "shake 0.4s" : undefined,
            }}
          >
            {[0, 1, 2, 3].map((i) => (
              <span
                key={i}
                style={{
                  width: 14,
                  height: 14,
                  borderRadius: 999,
                  transition: "all 0.15s",
                  background: pin.length > i ? (error ? colors.red : colors.blue) : "transparent",
                  border: `2px solid ${pin.length > i ? (error ? colors.red : colors.blue) : theme.inputBorder}`,
                }}
              />
            ))}
          </div>

          {error && (
            <div style={{ color: colors.red, fontSize: 12.5, marginBottom: 10, fontWeight: 600 }}>
              {error}
            </div>
          )}

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, maxWidth: 260, margin: "0 auto" }}>
            {KEYS.map((d) => (
              <button key={d} onClick={() => press(d)} disabled={busy} className="pin-key" style={keyBtnStyle}>
                {d}
              </button>
            ))}
            <span />
            <button onClick={() => press("0")} disabled={busy} className="pin-key" style={keyBtnStyle}>
              0
            </button>
            <button
              onClick={() => press("del")}
              disabled={busy}
              className="pin-key"
              style={{ ...keyBtnStyle, background: "transparent", border: "none", boxShadow: "none", color: theme.textTer }}
            >
              <Delete size={22} />
            </button>
          </div>
        </div>

        <div style={{ marginTop: 26, color: theme.textQuat, fontSize: 12, fontWeight: 500 }}>
          Admin: 3333 &nbsp;·&nbsp; Omborchi: 8888
        </div>
      </div>
    </div>
  );
}
