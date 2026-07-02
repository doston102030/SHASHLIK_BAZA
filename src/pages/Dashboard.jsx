import { Users, Send, AlertTriangle } from "lucide-react";
import { useTheme, colors } from "../context/ThemeContext";
import { Card, StatCard, Badge, SectionTitle } from "../components/ui";
import { HISTORY_TYPES } from "../utils/data";
import { formatNumber, getCategoryEmoji } from "../utils/helpers";

export default function Dashboard({ products, warehouse, branchStock, history, branches }) {
  const { theme } = useTheme();

  // Statistika
  const lowStockProducts = products.filter((p) => (warehouse[p.id] || 0) < p.minStock);
  const inCount = history.filter((h) => h.type === "in").length;
  const outCount = history.filter((h) => h.type === "out").length;

  return (
    <div>
      {/* ── Statistika kartalari ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))", gap: 16, marginBottom: 28 }}>
        <StatCard label="Kirim operatsiyalari" value={inCount} subtitle="jami" color={colors.blue} icon={Users} />
        <StatCard label="Filialga yuborish" value={outCount} subtitle="ta operatsiya" color={colors.orange} icon={Send} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 20, marginBottom: 24 }}>
        {/* ── Ombor holati ── */}
        <Card>
          <SectionTitle>Ombor holati</SectionTitle>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {products.slice(0, 12).map((product) => {
              const quantity = warehouse[product.id] || 0;
              const isLow = quantity < product.minStock;
              return (
                <div
                  key={product.id}
                  style={{
                    padding: "14px 18px",
                    borderRadius: 16,
                    background: isLow ? `${colors.red}06` : `${colors.green}06`,
                    border: `1.5px solid ${isLow ? `${colors.red}20` : `${colors.green}18`}`,
                  }}
                >
                  <div style={{ fontSize: 14, fontWeight: 600, color: theme.text, marginBottom: 4 }}>
                    {getCategoryEmoji(product.category)} {product.name}
                  </div>
                  <div style={{ fontSize: 18, fontWeight: 800, color: isLow ? colors.red : colors.green }}>
                    {formatNumber(quantity)} {product.unit}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* ── O'ng ustun ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Filiallar */}
          <Card>
            <SectionTitle>Filiallar</SectionTitle>
            {branches.map((branch, index) => {
              const stock = branchStock[branch] || {};
              const total = Object.values(stock).reduce((a, v) => a + v, 0);
              return (
                <div
                  key={branch}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "16px 0",
                    borderBottom: index < branches.length - 1 ? `1px solid ${theme.divider}` : "none",
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 800, fontSize: 16, color: theme.text }}>{branch}</div>
                    <div style={{ fontSize: 13, color: theme.textTer }}>{Object.keys(stock).length} xil mahsulot</div>
                  </div>
                  <Badge text={`${formatNumber(total)} birlik`} color={colors.orange} />
                </div>
              );
            })}
          </Card>

          {/* Kam qolgan */}
          {lowStockProducts.length > 0 && (
            <Card accent={colors.red}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                <AlertTriangle size={22} color={colors.red} />
                <span style={{ fontWeight: 800, fontSize: 16, color: colors.red }}>Kam qolgan</span>
              </div>
              {lowStockProducts.map((product) => (
                <div
                  key={product.id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "10px 0",
                    fontSize: 15,
                    color: theme.text,
                    borderBottom: `1px solid ${theme.divider}`,
                  }}
                >
                  <span style={{ fontWeight: 600 }}>{product.name}</span>
                  <span style={{ color: colors.red, fontWeight: 800 }}>
                    {formatNumber(warehouse[product.id] || 0)} / {product.minStock} {product.unit}
                  </span>
                </div>
              ))}
            </Card>
          )}
        </div>
      </div>

      {/* ── So'nggi harakatlar ── */}
      <Card>
        <SectionTitle>So'nggi harakatlar</SectionTitle>
        {history.slice(0, 10).map((item, index) => {
          const typeInfo = HISTORY_TYPES[item.type] || HISTORY_TYPES.info;
          return (
            <div
              key={index}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 16,
                padding: "12px 0",
                borderBottom: index < 9 ? `1px solid ${theme.divider}` : "none",
              }}
            >
              <div
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: "50%",
                  background: typeInfo.color,
                  flexShrink: 0,
                }}
              />
              <span style={{ fontSize: 14, color: theme.textTer, fontWeight: 700, minWidth: 54 }}>{item.time}</span>
              <Badge text={typeInfo.label} color={typeInfo.color} />
              <span style={{ fontSize: 15, color: theme.text, fontWeight: 500 }}>{item.text}</span>
            </div>
          );
        })}
      </Card>
    </div>
  );
}
