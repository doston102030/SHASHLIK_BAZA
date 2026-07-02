import { useState } from "react";
import { Trash2, Check, Boxes } from "lucide-react";
import { useTheme, colors } from "../context/ThemeContext";
import { Card, Button, Badge, NumpadModal, Modal } from "../components/ui";
import { formatNumber, getCurrentTime } from "../utils/helpers";

export default function RawConsumption({
  products, warehouse, setWarehouse,
  addHistory, showToast,
  consumptions, setConsumptions,
  onNavigate,
}) {
  const { theme } = useTheme();

  // ── Xom ashyo tanlash ──
  const [cart, setCart] = useState([]);
  const [activeRaw, setActiveRaw] = useState(null);

  const rawMaterials = products.filter((p) => p.category === "Xom ashyo");

  // ── Xom ashyo saqlash ──
  const confirmRaw = (qty) => {
    const available = warehouse[activeRaw.id] || 0;
    if (qty > available) {
      setActiveRaw(null);
      return showToast(`Omborda ${formatNumber(available)} ${activeRaw.unit} bor`, "error");
    }
    setCart((prev) => {
      const ex = prev.find((r) => r.productId === activeRaw.id);
      if (ex) return prev.map((r) => r.productId === activeRaw.id ? { ...r, quantity: qty } : r);
      return [...prev, { productId: activeRaw.id, quantity: qty }];
    });
    setActiveRaw(null);
  };

  const saveConsumption = () => {
    if (cart.length === 0) return showToast("Kamida bitta xom ashyo kiriting", "error");

    for (const row of cart) {
      const available = warehouse[row.productId] || 0;
      if (row.quantity > available) {
        const product = products.find((p) => p.id === row.productId);
        return showToast(`${product.name} omborda yetarli emas`, "error");
      }
    }

    const now = new Date();
    const date = `${String(now.getDate()).padStart(2, "0")}.${String(now.getMonth() + 1).padStart(2, "0")}.${now.getFullYear()}`;
    const time = getCurrentTime();

    const updatedWarehouse = { ...warehouse };
    const items = cart.map((row) => {
      const product = products.find((p) => p.id === row.productId);
      updatedWarehouse[row.productId] = (updatedWarehouse[row.productId] || 0) - row.quantity;
      addHistory(`${formatNumber(row.quantity)} ${product.unit} ${product.name} sarflandi`, "prod", [row.productId]);
      return { productId: row.productId, name: product.name, quantity: row.quantity, unit: product.unit };
    });

    const record = { id: Date.now(), date, time, items, output: null };
    setWarehouse(updatedWarehouse);
    setConsumptions((prev) => [record, ...prev]);
    setCart([]);
    showToast("Xom ashyo sarflandi");
  };

  // ── Tarix qatorini bosish: bajarilgan bo'lsa ko'rsatish, aks holda Ishlab chiqarishga o'tish ──
  const [viewRecord, setViewRecord] = useState(null);

  const openForOutput = (rec) => {
    if (rec.output) {
      setViewRecord(rec);
    } else {
      onNavigate?.("production");
    }
  };

  const byDate = consumptions.reduce((acc, rec) => {
    if (!acc[rec.date]) acc[rec.date] = [];
    acc[rec.date].push(rec);
    return acc;
  }, {});

  return (
    <div>
      {/* ── Xom ashyo tanlash ── */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 20, alignItems: "start", marginBottom: 32 }}>
        <Card style={{ flex: "3 1 340px", minWidth: 300 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
            <div style={{ width: 36, height: 36, borderRadius: 12, background: `${colors.red}15`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Boxes size={18} color={colors.red} />
            </div>
            <span style={{ fontSize: 16, fontWeight: 800, color: theme.text }}>Xom ashyoni tanlang</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(155px, 1fr))", gap: 14 }}>
            {rawMaterials.map((product) => {
              const inCart = cart.find((r) => r.productId === product.id);
              return (
                <button key={product.id} onClick={() => setActiveRaw(product)} className="hover-lift"
                  style={{ textAlign: "center", border: `1.5px solid ${inCart ? colors.red : theme.border}`, background: inCart ? `${colors.red}10` : theme.card, borderRadius: 16, padding: "22px 12px", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
                  <span style={{ fontWeight: 700, fontSize: 15, color: theme.text }}>{product.name}</span>
                  {inCart
                    ? <Badge text={`${formatNumber(inCart.quantity)} ${product.unit}`} color={colors.red} />
                    : <span style={{ fontSize: 12.5, color: colors.green, fontWeight: 600 }}>Omborda: {formatNumber(warehouse[product.id] || 0)} {product.unit}</span>
                  }
                </button>
              );
            })}
          </div>
        </Card>

        <Card style={{ padding: 20, position: "sticky", top: 20, display: "flex", flexDirection: "column", flex: "1 1 260px", minWidth: 240, minHeight: 360 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
            <Boxes size={15} color={colors.red} />
            <span style={{ fontSize: 16, fontWeight: 800, color: theme.text }}>Sarflangan</span>
          </div>
          <div style={{ flex: 1, overflowY: "auto" }}>
            {cart.length === 0
              ? (
                <div style={{ textAlign: "center", padding: "32px 0" }}>
                  <img
                    src={theme.mode === "dark" ? "/assets/DARK-logo.png" : "/assets/LITE-logo.png"}
                    alt="Go'sht ERP"
                    style={{ height: 36, width: "auto", objectFit: "contain", opacity: 0.5, display: "block", margin: "0 auto 12px" }}
                  />
                  <div style={{ color: theme.textQuat, fontSize: 13 }}>Xom ashyo tanlanmagan</div>
                </div>
              )
              : cart.map((row) => {
                const product = products.find((p) => p.id === row.productId);
                return (
                  <div key={row.productId} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: `1px solid ${theme.divider}` }}>
                    <span style={{ fontWeight: 600, color: theme.text, fontSize: 14 }}>{product.name}</span>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <button onClick={() => setActiveRaw(product)} style={{ background: "none", border: "none", cursor: "pointer", fontWeight: 800, fontSize: 14, color: colors.red }}>
                        {formatNumber(row.quantity)} {product.unit}
                      </button>
                      <button onClick={() => setCart((p) => p.filter((r) => r.productId !== row.productId))} style={{ background: "none", border: "none", cursor: "pointer", padding: 2 }}>
                        <Trash2 size={14} color={colors.red} />
                      </button>
                    </div>
                  </div>
                );
              })
            }
          </div>
          {cart.length > 0 && (
            <div style={{ padding: "10px 0 0", borderTop: `1px solid ${theme.divider}`, fontSize: 13, color: theme.textTer, fontWeight: 600 }}>
              Jami: {formatNumber(cart.reduce((s, r) => s + r.quantity, 0))} kg
            </div>
          )}
          <Button onClick={saveConsumption} color={colors.red} size="lg" disabled={cart.length === 0} fullWidth style={{ marginTop: 14 }}>
            <Check size={16} color="#fff" /> Sarflash
          </Button>
        </Card>
      </div>

      {/* ── Sarflash tarixi ── */}
      {consumptions.length > 0 && (
        <div>
          <div style={{ fontSize: 16, fontWeight: 800, color: theme.text, marginBottom: 14 }}>Sarflash tarixi</div>
          {Object.entries(byDate).map(([date, records]) => (
            <div key={date} style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: theme.textTer, textTransform: "uppercase", letterSpacing: 1.2, marginBottom: 8, paddingLeft: 4 }}>
                {date}
              </div>
              <Card style={{ padding: 0, overflow: "hidden" }}>
                {records.map((rec, idx) => (
                  <button key={rec.id} onClick={() => openForOutput(rec)}
                    style={{ width: "100%", background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 14, padding: "14px 20px", textAlign: "left", borderBottom: idx < records.length - 1 ? `1px solid ${theme.divider}` : "none", transition: "background 0.12s" }}
                    onMouseEnter={(e) => e.currentTarget.style.background = theme.hover}
                    onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                  >
                    <span style={{ fontSize: 13, color: theme.textTer, fontWeight: 700, minWidth: 44 }}>{rec.time}</span>
                    <div style={{ flex: 1, display: "flex", flexWrap: "wrap", gap: 6, alignItems: "center" }}>
                      {rec.items.map((item) => (
                        <span key={item.productId} style={{ padding: "4px 10px", borderRadius: 20, background: `${colors.red}12`, color: colors.red, fontSize: 12.5, fontWeight: 700 }}>
                          {formatNumber(item.quantity)} {item.unit} {item.name}
                        </span>
                      ))}
                      {rec.output && rec.output.length > 0 && (
                        <>
                          <span style={{ color: theme.textQuat, fontSize: 14 }}>→</span>
                          {rec.output.map((item) => (
                            <span key={item.productId} style={{ padding: "4px 10px", borderRadius: 20, background: `${colors.green}12`, color: colors.green, fontSize: 12.5, fontWeight: 700 }}>
                              +{formatNumber(item.quantity)} {item.unit} {item.name}
                            </span>
                          ))}
                        </>
                      )}
                    </div>
                    {rec.output
                      ? <span style={{ fontSize: 11, fontWeight: 800, color: colors.green, background: `${colors.green}15`, padding: "4px 10px", borderRadius: 20, flexShrink: 0 }}>✓ Bajarildi</span>
                      : <span style={{ fontSize: 11, fontWeight: 800, color: colors.orange, background: `${colors.orange}15`, padding: "4px 10px", borderRadius: 20, flexShrink: 0 }}>Ishlab chiqarish →</span>
                    }
                  </button>
                ))}
              </Card>
            </div>
          ))}
        </div>
      )}

      {/* ── Xom ashyo numpad ── */}
      <NumpadModal
        open={!!activeRaw}
        onClose={() => setActiveRaw(null)}
        title={activeRaw?.name}
        unit={activeRaw?.unit}
        initialValue={cart.find((r) => r.productId === activeRaw?.id)?.quantity}
        onConfirm={confirmRaw}
        confirmLabel="Saqlash"
        confirmColor={colors.red}
      />

      {/* ── Ko'rish modali (bajarilgan yozuv) ── */}
      <Modal open={!!viewRecord} onClose={() => setViewRecord(null)} title={`${viewRecord?.date} ${viewRecord?.time}`}>
        {viewRecord && (
          <div>
            <div style={{ fontSize: 12, fontWeight: 800, color: theme.textTer, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 10 }}>Sarflangan xom ashyo</div>
            {viewRecord.items.map((item) => (
              <div key={item.productId} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: `1px solid ${theme.divider}` }}>
                <span style={{ fontWeight: 600, color: theme.text }}>{item.name}</span>
                <span style={{ fontWeight: 800, color: colors.red }}>{formatNumber(item.quantity)} {item.unit}</span>
              </div>
            ))}
            {viewRecord.output && viewRecord.output.length > 0 && (
              <div style={{ marginTop: 18 }}>
                <div style={{ fontSize: 12, fontWeight: 800, color: theme.textTer, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 10 }}>Ishlab chiqarilgan</div>
                {viewRecord.output.map((item) => (
                  <div key={item.productId} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: `1px solid ${theme.divider}` }}>
                    <span style={{ fontWeight: 600, color: theme.text }}>{item.name}</span>
                    <span style={{ fontWeight: 800, color: colors.green }}>+{formatNumber(item.quantity)} {item.unit}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
