import { useState } from "react";
import { Package, AlertTriangle, XCircle, MinusCircle, Trash2, History as HistoryIcon } from "lucide-react";
import { useTheme, colors } from "../context/ThemeContext";
import { Card, Badge, Table, SectionTitle, Button, NumpadModal, TabBar, Input } from "../components/ui";
import { HISTORY_TYPES } from "../utils/data";
import { formatNumber, getCategoryEmoji } from "../utils/helpers";

const MOVEMENT_TYPES = ["in", "prod", "out", "chiqim"];

function parseHistoryDate(dateStr) {
  const [d, m, y] = dateStr.split(".").map(Number);
  return new Date(y, m - 1, d);
}

export default function Warehouse({ products, warehouse, setWarehouse, history, addHistory, showToast, currentUser }) {
  const { theme } = useTheme();
  const isAdmin = currentUser?.role === "Admin";
  const [stockType, setStockType] = useState("raw"); // "raw" | "finished"
  const [activeFilter, setActiveFilter] = useState(null);
  const [chiqimCart, setChiqimCart] = useState([]);
  const [activeChiqimProduct, setActiveChiqimProduct] = useState(null);
  const [datePreset, setDatePreset] = useState("today"); // "today" | "week" | "month"
  const [customFrom, setCustomFrom] = useState("");
  const [customTo, setCustomTo] = useState("");

  const changeDatePreset = (id) => {
    setDatePreset(id);
    setCustomFrom("");
    setCustomTo("");
  };

  const rawMaterials = products.filter((p) => p.category === "Xom ashyo");
  const finishedGoods = products.filter((p) => p.category !== "Xom ashyo");
  const scopedProducts = stockType === "raw" ? rawMaterials : finishedGoods;

  const emptyItems = scopedProducts.filter((p) => (warehouse[p.id] || 0) === 0);
  const lowItems   = scopedProducts.filter((p) => { const q = warehouse[p.id] || 0; return q > 0 && q < p.minStock; });
  const totalQty   = scopedProducts.reduce((acc, p) => acc + (warehouse[p.id] || 0), 0);

  // ── Sana bo'yicha kirim/chiqim harakatlari ──
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let rangeFrom = today, rangeTo = today;
  if (customFrom && customTo) {
    rangeFrom = new Date(`${customFrom}T00:00:00`);
    rangeTo = new Date(`${customTo}T00:00:00`);
  } else if (datePreset === "week") {
    rangeFrom = new Date(today); rangeFrom.setDate(rangeFrom.getDate() - 6);
    rangeTo = today;
  } else if (datePreset === "month") {
    rangeFrom = new Date(today); rangeFrom.setDate(rangeFrom.getDate() - 29);
    rangeTo = today;
  }

  const movements = (history || []).filter((h) => {
    if (!MOVEMENT_TYPES.includes(h.type)) return false;
    const isRelevant = h.productIds && h.productIds.length > 0
      ? h.productIds.some((pid) => scopedProducts.some((p) => p.id === pid))
      : scopedProducts.some((p) => h.text.includes(p.name)); // eski yozuvlar uchun (productIds saqlanmagan)
    if (!isRelevant) return false;
    if (!rangeFrom || !rangeTo) return false;
    const entryDate = parseHistoryDate(h.date);
    return entryDate >= rangeFrom && entryDate <= rangeTo;
  });

  const confirmChiqim = (qty) => {
    setChiqimCart((prev) => {
      const existing = prev.find((r) => r.productId === activeChiqimProduct.id);
      if (existing) return prev.map((r) => r.productId === activeChiqimProduct.id ? { ...r, quantity: qty } : r);
      return [...prev, { productId: activeChiqimProduct.id, quantity: qty }];
    });
    setActiveChiqimProduct(null);
  };

  const saveChiqim = () => {
    if (chiqimCart.length === 0) return showToast("Mahsulot tanlang", "error");

    for (const row of chiqimCart) {
      const available = warehouse[row.productId] || 0;
      if (row.quantity > available) {
        const product = products.find((p) => p.id === row.productId);
        return showToast(`${product.name} omborda yetarli emas`, "error");
      }
    }

    const updated = { ...warehouse };
    chiqimCart.forEach((row) => {
      const product = products.find((p) => p.id === row.productId);
      updated[row.productId] = (updated[row.productId] || 0) - row.quantity;
      addHistory(`${formatNumber(row.quantity)} ${product.unit} ${product.name} ombordan chiqim qilindi`, "chiqim", [row.productId]);
    });
    setWarehouse(updated);
    setChiqimCart([]);
    showToast(`${chiqimCart.length} ta mahsulot chiqim qilindi`);
  };

  const statCards = [
    { key: null,    label: "Ombordagi qoldiq", value: `${formatNumber(totalQty)} ${stockType === "raw" ? "kg" : "birlik"}`, icon: Package,       color: colors.blue },
    { key: "low",   label: "Kam qolgan",        value: lowItems.length,               icon: AlertTriangle, color: colors.orange },
    { key: "empty", label: "Tugagan",            value: emptyItems.length,             icon: XCircle,       color: colors.red },
  ];

  const detailItems = activeFilter === "low" ? lowItems : activeFilter === "empty" ? emptyItems : null;
  const detailTitle = activeFilter === "low" ? "Kam qolgan mahsulotlar" : "Tugagan mahsulotlar";

  const switchStockType = (type) => {
    setStockType(type);
    setActiveFilter(null);
  };

  return (
    <div>
      {/* Xom ashyo / Tayyor mahsulot */}
      <div style={{ marginBottom: 18, width: "fit-content" }}>
        <TabBar
          tabs={[{ id: "raw", label: "Xom ashyo" }, { id: "finished", label: "Tayyor mahsulot" }]}
          active={stockType}
          onChange={switchStockType}
          color={colors.blue}
        />
      </div>

      {/* Stat kartochkalar */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 14, marginBottom: 24 }}>
        {statCards.map((card, i) => {
          const IconComp = card.icon;
          const isActive = activeFilter === card.key && card.key !== null;
          const isClickable = card.key !== null;
          return (
            <div
              key={i}
              onClick={() => { if (!isClickable) return; setActiveFilter(isActive ? null : card.key); }}
              style={{
                background: theme.card, border: `1.5px solid ${isActive ? card.color : theme.border}`,
                borderRadius: 18, padding: "20px 22px", display: "flex", alignItems: "center", gap: 16,
                cursor: isClickable ? "pointer" : "default",
                boxShadow: isActive ? `0 0 0 3px ${card.color}20` : "none", transition: "all 0.18s",
              }}
            >
              <div style={{ width: 48, height: 48, borderRadius: 14, background: `${card.color}15`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <IconComp size={22} color={card.color} />
              </div>
              <div>
                <div style={{ fontSize: 22, fontWeight: 900, color: isActive ? card.color : theme.text, lineHeight: 1 }}>{card.value}</div>
                <div style={{ fontSize: 13, color: theme.textTer, marginTop: 4, fontWeight: 600 }}>{card.label}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Detail jadval */}
      {detailItems && (
        <Card style={{ marginBottom: 20 }}>
          <SectionTitle>{detailTitle}</SectionTitle>
          {detailItems.length === 0 ? (
            <div style={{ textAlign: "center", padding: "28px 0", color: theme.textQuat, fontSize: 14 }}>Mahsulot yo'q</div>
          ) : (
            <Table
              columns={[
                { label: "Mahsulot", render: (r) => <span style={{ fontWeight: 700 }}>{getCategoryEmoji(r.category)} {r.name}</span> },
                { label: "Shtrix-kod", render: (r) => <span style={{ fontSize: 13, color: theme.textTer }}>{r.barcode}</span> },
                { label: "Qoldiq", align: "right", render: (r) => { const qty = warehouse[r.id] || 0; return <span style={{ fontWeight: 800, color: qty === 0 ? colors.red : colors.orange }}>{formatNumber(qty)} {r.unit}</span>; } },
                { label: "Narxi", align: "right", render: (r) => <span style={{ fontWeight: 700 }}>{formatNumber(r.cost)} so'm</span> },
              ]}
              data={detailItems}
            />
          )}
        </Card>
      )}

      {/* Ombor harakati — sana bo'yicha */}
      <Card style={{ marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
          <HistoryIcon size={16} color={theme.textSec} />
          <span style={{ fontWeight: 800, fontSize: 15, color: theme.text }}>Ombor harakati</span>
        </div>

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

        {movements.length === 0 ? (
          <div style={{ textAlign: "center", padding: "24px 0", color: theme.textQuat, fontSize: 14 }}>
            Bu davrda harakat yo'q
          </div>
        ) : (
          <div style={{ border: `1px solid ${theme.border}`, borderRadius: 12, overflow: "hidden" }}>
            {movements.map((item, idx) => {
              const typeInfo = HISTORY_TYPES[item.type] || HISTORY_TYPES.info;
              return (
                <div key={idx} style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 16px", borderBottom: idx < movements.length - 1 ? `1px solid ${theme.divider}` : "none" }}>
                  <Badge text={typeInfo.label} color={typeInfo.color} />
                  <span style={{ flex: 1, fontSize: 14, color: theme.text, fontWeight: 600 }}>{item.text}</span>
                  <span style={{ fontSize: 13, color: theme.textTer, fontWeight: 700, flexShrink: 0 }}>{item.date} · {item.time}</span>
                </div>
              );
            })}
          </div>
        )}
      </Card>

      {/* Asosiy jadval + Chiqim */}
      <div style={{ display: "flex", gap: 16, alignItems: "start", flexWrap: "wrap" }}>

        {/* Jadval */}
        <Card style={{ flex: isAdmin ? "1 1 100%" : "3 1 400px", padding: 0, overflow: "hidden", borderRadius: 20 }}>
          <Table
            columns={[
              { label: "Mahsulot", render: (row) => <span style={{ fontWeight: 700, fontSize: 15 }}>{getCategoryEmoji(row.category)} {row.name}</span> },
              { label: "Kategoriya", render: (row) => <Badge text={row.category} color={colors.purple} /> },
              { label: "O'lchov", render: (row) => <Badge text={row.unit.toUpperCase()} color={colors.orange} /> },
              {
                label: "Qoldiq", align: "right",
                render: (row) => {
                  const qty = warehouse[row.id] || 0;
                  const color = qty === 0 ? colors.red : qty < row.minStock ? colors.orange : colors.green;
                  return <span style={{ fontWeight: 800, fontSize: 17, color }}>{formatNumber(qty)} {row.unit}</span>;
                },
              },
              { label: "Min", align: "right", render: (row) => <span style={{ color: theme.textTer, fontSize: 14 }}>{row.minStock} {row.unit}</span> },
              {
                label: "Holat", align: "center",
                render: (row) => {
                  const qty = warehouse[row.id] || 0;
                  if (qty === 0) return <Badge text="✗ Tugagan" color={colors.red} />;
                  if (qty < row.minStock) return <Badge text="⚠ Kam!" color={colors.orange} />;
                  return <Badge text="✓ Yetarli" color={colors.green} />;
                },
              },
              ...(isAdmin ? [] : [{
                label: "",
                render: (row) => {
                  const qty = warehouse[row.id] || 0;
                  if (qty === 0) return null;
                  return (
                    <button
                      onClick={() => setActiveChiqimProduct(row)}
                      style={{ background: `${colors.red}10`, border: `1px solid ${colors.red}30`, borderRadius: 9, padding: "5px 12px", cursor: "pointer", fontSize: 13, fontWeight: 700, color: colors.red }}
                    >
                      − Chiqim
                    </button>
                  );
                },
              }]),
            ]}
            data={scopedProducts}
          />
        </Card>

        {/* Chiqim savatcha (faqat Omborchi uchun) */}
        {!isAdmin && (
          <Card style={{ flex: "1 1 240px", minWidth: 220, padding: 18, position: "sticky", top: 20, display: "flex", flexDirection: "column", minHeight: 280 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
              <MinusCircle size={17} color={colors.red} />
              <span style={{ fontWeight: 800, fontSize: 15, color: theme.text }}>Chiqim ro'yxati</span>
            </div>

            <div style={{ flex: 1 }}>
              {chiqimCart.length === 0 ? (
                <div style={{ textAlign: "center", padding: "28px 0", color: theme.textQuat, fontSize: 13 }}>
                  Mahsulot tanlanmagan
                </div>
              ) : (
                chiqimCart.map((row) => {
                  const product = products.find((p) => p.id === row.productId);
                  return (
                    <div key={row.productId} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "9px 0", borderBottom: `1px solid ${theme.divider}` }}>
                      <span style={{ fontWeight: 600, fontSize: 13, color: theme.text }}>{product.name}</span>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <button onClick={() => setActiveChiqimProduct(product)} style={{ background: "none", border: "none", cursor: "pointer", fontWeight: 800, fontSize: 13, color: colors.red }}>
                          -{formatNumber(row.quantity)} {product.unit}
                        </button>
                        <button onClick={() => setChiqimCart((prev) => prev.filter((r) => r.productId !== row.productId))} style={{ background: "none", border: "none", cursor: "pointer" }}>
                          <Trash2 size={13} color={colors.red} />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <Button onClick={saveChiqim} color={colors.red} size="sm" disabled={chiqimCart.length === 0} fullWidth style={{ marginTop: 10 }}>
              <MinusCircle size={14} color="#fff" /> Chiqim qilish
            </Button>
          </Card>
        )}
      </div>

      {!isAdmin && (
        <NumpadModal
          open={!!activeChiqimProduct}
          onClose={() => setActiveChiqimProduct(null)}
          title={activeChiqimProduct?.name}
          unit={activeChiqimProduct?.unit}
          initialValue={chiqimCart.find((r) => r.productId === activeChiqimProduct?.id)?.quantity}
          onConfirm={confirmChiqim}
          confirmLabel="Chiqim"
          confirmColor={colors.red}
        />
      )}
    </div>
  );
}
