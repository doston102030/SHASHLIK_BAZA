import { useState } from "react";
import { useTheme, colors } from "../context/ThemeContext";
import { Card, Badge, TabBar, Input } from "../components/ui";
import { HISTORY_TYPES } from "../utils/data";

const TYPE_ICONS = {
  in:     "↓",
  prod:   "⚙",
  out:    "→",
  sale:   "✓",
  chiqim: "−",
  info:   "i",
};

const SUPPLIER_COLORS = [colors.blue, colors.orange, colors.purple, colors.teal, colors.pink, colors.green, colors.red];

function parseHistoryDate(dateStr) {
  const [d, m, y] = (dateStr || "").split(".").map(Number);
  return d && m && y ? new Date(y, m - 1, d) : null;
}

export default function History({ history, suppliers = [] }) {
  const { theme } = useTheme();
  const [filter, setFilter] = useState("all");
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [datePreset, setDatePreset] = useState("today"); // "today" | "week" | "month"
  const [customFrom, setCustomFrom] = useState("");
  const [customTo, setCustomTo] = useState("");

  const selectSupplier = (name) => {
    if (name === selectedSupplier) return;
    setSelectedSupplier(name);
    if (name) setFilter("in");
  };

  const changeDatePreset = (id) => {
    setDatePreset(id);
    setCustomFrom("");
    setCustomTo("");
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let rangeFrom = null, rangeTo = null;
  if (customFrom && customTo) {
    rangeFrom = new Date(`${customFrom}T00:00:00`);
    rangeTo = new Date(`${customTo}T00:00:00`);
  } else if (datePreset === "today") {
    rangeFrom = today; rangeTo = today;
  } else if (datePreset === "week") {
    rangeFrom = new Date(today); rangeFrom.setDate(rangeFrom.getDate() - 6);
    rangeTo = today;
  } else if (datePreset === "month") {
    rangeFrom = new Date(today); rangeFrom.setDate(rangeFrom.getDate() - 29);
    rangeTo = today;
  }

  const byType = filter === "all" ? history : history.filter((h) => h.type === filter);
  const byDate = !rangeFrom || !rangeTo ? byType : byType.filter((h) => {
    const entryDate = parseHistoryDate(h.date);
    return entryDate && entryDate >= rangeFrom && entryDate <= rangeTo;
  });
  const filtered = selectedSupplier
    ? byDate.filter((h) => h.text.includes(`(${selectedSupplier})`))
    : byDate;

  const groupedByDate = filtered.reduce((acc, item) => {
    const key = item.date || "Bugun";
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {});

  const dateGroups = Object.entries(groupedByDate);

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 20, alignItems: "start" }}>
      {/* ── Yetkazib beruvchilar bo'yicha ── */}
      {suppliers.length > 0 && (
        <Card style={{ flex: "0 0 220px", minWidth: 200, maxWidth: 240, padding: 16 }}>
          <div style={{ fontSize: 12, fontWeight: 800, color: theme.textTer, textTransform: "uppercase", letterSpacing: 0.4, marginBottom: 14 }}>
            Yetkazib beruvchi
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <button
              onClick={() => selectSupplier(null)}
              className="hover-lift"
              style={{
                display: "flex", alignItems: "center", gap: 14, textAlign: "left",
                border: `2px solid ${!selectedSupplier ? colors.blue : theme.border}`,
                background: !selectedSupplier ? `${colors.blue}12` : theme.card,
                borderRadius: 16, padding: "14px 14px", cursor: "pointer", transition: "all 0.15s",
                boxShadow: !selectedSupplier ? `0 4px 14px ${colors.blue}25` : "none",
              }}
            >
              <div style={{
                width: 42, height: 42, borderRadius: 13, flexShrink: 0,
                background: !selectedSupplier ? colors.blue : `${colors.blue}20`,
                color: !selectedSupplier ? "#fff" : colors.blue,
                display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 17,
              }}>
                ★
              </div>
              <span style={{ fontWeight: 700, fontSize: 14.5, color: !selectedSupplier ? colors.blue : theme.text }}>
                Barchasi
              </span>
            </button>

            {suppliers.map((name, index) => {
              const color = SUPPLIER_COLORS[index % SUPPLIER_COLORS.length];
              const isActive = selectedSupplier === name;
              return (
                <button
                  key={name}
                  onClick={() => selectSupplier(name)}
                  className="hover-lift"
                  style={{
                    display: "flex", alignItems: "center", gap: 14, textAlign: "left",
                    border: `2px solid ${isActive ? color : theme.border}`,
                    background: isActive ? `${color}12` : theme.card,
                    borderRadius: 16, padding: "14px 14px", cursor: "pointer", transition: "all 0.15s",
                    boxShadow: isActive ? `0 4px 14px ${color}25` : "none",
                  }}
                >
                  <div style={{
                    width: 42, height: 42, borderRadius: 13, flexShrink: 0,
                    background: isActive ? color : `${color}20`,
                    color: isActive ? "#fff" : color,
                    display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 19,
                  }}>
                    {name.charAt(0)}
                  </div>
                  <span style={{ fontWeight: 700, fontSize: 14.5, color: isActive ? color : theme.text, lineHeight: 1.2 }}>
                    {name}
                  </span>
                </button>
              );
            })}
          </div>
        </Card>
      )}

      {/* ── Tarix ro'yxati ── */}
      <div style={{ flex: "1 1 500px", minWidth: 300 }}>
        {/* Sana bo'yicha filtr */}
        <div style={{ display: "flex", gap: 14, flexWrap: "wrap", alignItems: "center", marginBottom: 14 }}>
          <TabBar
            tabs={[
              { id: "today", label: "Bugun" },
              { id: "week", label: "Hafta" },
              { id: "month", label: "Oy" },
            ]}
            active={customFrom && customTo ? null : datePreset}
            onChange={changeDatePreset}
            color={colors.blue}
          />
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <Input type="date" value={customFrom} onChange={setCustomFrom} style={{ marginBottom: 0 }} />
            <span style={{ color: theme.textTer, fontSize: 13, fontWeight: 700 }}>—</span>
            <Input type="date" value={customTo} onChange={setCustomTo} style={{ marginBottom: 0 }} />
          </div>
        </div>

        {/* Turi bo'yicha filtr */}
        <div style={{ display: "flex", gap: 8, marginBottom: 22, flexWrap: "wrap", background: theme.hover, padding: 5, borderRadius: 16, width: "fit-content" }}>
          {Object.entries(HISTORY_TYPES).filter(([key]) => key !== "sale").map(([key, { label, color }]) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              style={{
                padding: "9px 18px",
                borderRadius: 12,
                border: "none",
                cursor: "pointer",
                fontSize: 14,
                fontWeight: 700,
                background: filter === key ? color : "transparent",
                color: filter === key ? "#fff" : theme.textSec,
                transition: "all 0.18s",
                boxShadow: filter === key ? `0 2px 8px ${color}30` : "none",
              }}
            >
              {label}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <Card>
            <div style={{ textAlign: "center", padding: 56, color: theme.textQuat, fontSize: 16 }}>
              Tarix bo'sh
            </div>
          </Card>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {dateGroups.map(([date, items]) => (
              <div key={date}>
                <div style={{
                  fontSize: 12,
                  fontWeight: 800,
                  color: theme.textTer,
                  textTransform: "uppercase",
                  letterSpacing: 1.2,
                  marginBottom: 8,
                  paddingLeft: 4,
                }}>
                  {date}
                </div>

                <Card style={{ padding: 0, overflow: "hidden" }}>
                  {items.map((item, index) => {
                    const typeInfo = HISTORY_TYPES[item.type] || HISTORY_TYPES.info;
                    const icon = TYPE_ICONS[item.type] || "•";
                    return (
                      <div
                        key={index}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 14,
                          padding: "14px 20px",
                          borderBottom: index < items.length - 1 ? `1px solid ${theme.divider}` : "none",
                        }}
                      >
                        <div style={{
                          width: 38,
                          height: 38,
                          borderRadius: 11,
                          background: `${typeInfo.color}18`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 17,
                          fontWeight: 900,
                          color: typeInfo.color,
                          flexShrink: 0,
                          fontStyle: icon === "i" ? "italic" : "normal",
                        }}>
                          {icon}
                        </div>

                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 14.5, color: theme.text, fontWeight: 600, lineHeight: 1.4 }}>
                            {item.text}
                          </div>
                          <div style={{ marginTop: 4 }}>
                            <Badge text={typeInfo.label} color={typeInfo.color} />
                          </div>
                        </div>

                        <span style={{
                          fontSize: 13,
                          color: theme.textTer,
                          fontWeight: 700,
                          flexShrink: 0,
                          fontVariantNumeric: "tabular-nums",
                        }}>
                          {item.time}
                        </span>
                      </div>
                    );
                  })}
                </Card>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
