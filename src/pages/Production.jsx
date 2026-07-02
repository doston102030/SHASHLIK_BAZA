import { useState } from "react";
import { Trash2, Check, PackagePlus, ChevronRight } from "lucide-react";
import { useTheme, colors } from "../context/ThemeContext";
import { Card, Button, Badge, NumpadModal, Modal } from "../components/ui";
import { formatNumber } from "../utils/helpers";

export default function Production({
  products, warehouse, setWarehouse,
  addHistory, showToast,
  consumptions, setConsumptions,
  onNavigate,
}) {
  const { theme } = useTheme();

  const pendingRecords = consumptions.filter((r) => !r.output);
  const doneRecords = consumptions.filter((r) => r.output);

  const [selectedId, setSelectedId] = useState(null);
  const activeRecord = pendingRecords.find((r) => r.id === selectedId) || pendingRecords[0] || null;

  const [outputCart, setOutputCart] = useState([]);
  const [activeOutput, setActiveOutput] = useState(null);
  const [detailRecord, setDetailRecord] = useState(null);
  const [showHistory, setShowHistory] = useState(false);

  const finishedGoods = products.filter((p) => p.category !== "Xom ashyo");

  const selectRecord = (rec) => {
    setSelectedId(rec.id);
    setOutputCart([]);
  };

  const confirmQuantity = (qty) => {
    setOutputCart((prev) => {
      const ex = prev.find((r) => r.productId === activeOutput.id);
      if (ex) return prev.map((r) => r.productId === activeOutput.id ? { ...r, quantity: qty } : r);
      return [...prev, { productId: activeOutput.id, quantity: qty }];
    });
    setActiveOutput(null);
  };

  const save = () => {
    if (!activeRecord || outputCart.length === 0) return showToast("Kamida bitta mahsulot kiriting", "error");

    const updatedWarehouse = { ...warehouse };
    const items = outputCart.map((row) => {
      const product = products.find((p) => p.id === row.productId);
      updatedWarehouse[row.productId] = (updatedWarehouse[row.productId] || 0) + row.quantity;
      addHistory(`${formatNumber(row.quantity)} ${product.unit} ${product.name} ishlab chiqarildi`, "prod", [row.productId]);
      return { productId: row.productId, name: product.name, quantity: row.quantity, unit: product.unit };
    });

    setWarehouse(updatedWarehouse);
    setConsumptions((prev) =>
      prev.map((rec) => rec.id === activeRecord.id ? { ...rec, output: items } : rec)
    );
    setOutputCart([]);
    setSelectedId(null);
    showToast("Ishlab chiqarish saqlandi");
  };

  const byDate = doneRecords.reduce((acc, rec) => {
    if (!acc[rec.date]) acc[rec.date] = [];
    acc[rec.date].push(rec);
    return acc;
  }, {});

  return (
    <div>
      {!activeRecord ? (
        <Card style={{ padding: "48px 24px", textAlign: "center" }}>
          <img
            src={theme.mode === "dark" ? "/assets/DARK-logo.png" : "/assets/LITE-logo.png"}
            alt="Go'sht ERP"
            style={{ height: 48, width: "auto", objectFit: "contain", opacity: 0.5, display: "block", margin: "0 auto 16px" }}
          />
          <div style={{ fontSize: 15, fontWeight: 700, color: theme.text, marginBottom: 6 }}>
            Ishlab chiqarishga kutilayotgan xom ashyo yo'q
          </div>
          <div style={{ fontSize: 13, color: theme.textTer, marginBottom: 20 }}>
            Avval "Xom ashyo sarfi" bo'limida xom ashyo sarflang, so'ng shu yerda undan nima ishlab chiqarilganini yozasiz.
          </div>
          <Button onClick={() => onNavigate?.("consumption")} color={colors.red}>
            Xom ashyo sarfiga o'tish
          </Button>
        </Card>
      ) : (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 20, alignItems: "start", marginBottom: 32 }}>
          <Card style={{ flex: "3 1 340px", minWidth: 300 }}>
            {/* Kutilayotgan partiyalar (birdan ortiq bo'lsa) */}
            {pendingRecords.length > 1 && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 18 }}>
                {pendingRecords.map((rec) => (
                  <button key={rec.id} onClick={() => selectRecord(rec)}
                    style={{ border: `1.5px solid ${rec.id === activeRecord.id ? colors.red : theme.border}`, background: rec.id === activeRecord.id ? `${colors.red}10` : theme.card, borderRadius: 20, padding: "8px 14px", cursor: "pointer", fontSize: 12.5, fontWeight: 700, color: theme.text }}>
                    {rec.time} — {rec.items.map((i) => i.name).join(", ")}
                  </button>
                ))}
              </div>
            )}

            {/* Tanlangan partiyada sarflangan xom ashyo (read-only) */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: theme.textTer, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 10 }}>
                Sarflangan xom ashyo ({activeRecord.time})
              </div>
              <div style={{ border: `1px solid ${theme.border}`, borderRadius: 12, overflow: "hidden" }}>
                {activeRecord.items.map((item, idx) => (
                  <div key={item.productId} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", background: theme.card, borderBottom: idx < activeRecord.items.length - 1 ? `1px solid ${theme.divider}` : "none" }}>
                    <span style={{ fontWeight: 600, color: theme.text, fontSize: 14 }}>{item.name}</span>
                    <span style={{ fontWeight: 800, color: colors.red, fontSize: 14 }}>{formatNumber(item.quantity)} {item.unit}</span>
                  </div>
                ))}
                <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 14px", background: `${colors.red}0d` }}>
                  <span style={{ fontWeight: 700, color: theme.textTer, fontSize: 13 }}>Jami sarflangan</span>
                  <span style={{ fontWeight: 800, color: colors.red, fontSize: 13 }}>
                    {formatNumber(activeRecord.items.reduce((s, i) => s + i.quantity, 0))} kg
                  </span>
                </div>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
              <div style={{ width: 32, height: 32, borderRadius: 10, background: `${colors.green}15`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <PackagePlus size={16} color={colors.green} />
              </div>
              <span style={{ fontSize: 15, fontWeight: 800, color: theme.text }}>Nima ishlab chiqarildi?</span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))", gap: 10, maxHeight: 300, overflowY: "auto", paddingRight: 4 }}>
              {finishedGoods.map((product) => {
                const inCart = outputCart.find((r) => r.productId === product.id);
                return (
                  <button
                    key={product.id}
                    onClick={() => setActiveOutput(product)}
                    className="hover-lift"
                    style={{
                      textAlign: "center",
                      border: `1.5px solid ${inCart ? colors.green : theme.border}`,
                      background: inCart ? `${colors.green}10` : theme.card,
                      borderRadius: 14, padding: "12px 8px", cursor: "pointer",
                      display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
                    }}
                  >
                    <span style={{ fontWeight: 700, fontSize: 13.5, color: theme.text }}>{product.name}</span>
                    {inCart ? (
                      <Badge text={`+${formatNumber(inCart.quantity)} ${product.unit}`} color={colors.green} />
                    ) : (
                      <span style={{ fontSize: 11.5, color: colors.green, fontWeight: 600 }}>
                        Omborda: {formatNumber(warehouse[product.id] || 0)} {product.unit}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </Card>

          <Card style={{ padding: 20, position: "sticky", top: 20, display: "flex", flexDirection: "column", flex: "1 1 260px", minWidth: 240, minHeight: 360 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
              <PackagePlus size={15} color={colors.green} />
              <span style={{ fontSize: 16, fontWeight: 800, color: theme.text }}>Ishlab chiqarildi</span>
            </div>
            <div style={{ flex: 1, overflowY: "auto" }}>
              {outputCart.length === 0 ? (
                <div style={{ textAlign: "center", padding: "32px 0", color: theme.textQuat, fontSize: 13 }}>
                  Mahsulot tanlanmagan
                </div>
              ) : outputCart.map((row) => {
                const product = products.find((p) => p.id === row.productId);
                return (
                  <div key={row.productId} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: `1px solid ${theme.divider}` }}>
                    <span style={{ fontWeight: 600, color: theme.text, fontSize: 14 }}>{product.name}</span>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <button onClick={() => setActiveOutput(product)} style={{ background: "none", border: "none", cursor: "pointer", fontWeight: 800, fontSize: 14, color: colors.green }}>
                        +{formatNumber(row.quantity)} {product.unit}
                      </button>
                      <button onClick={() => setOutputCart((p) => p.filter((r) => r.productId !== row.productId))} style={{ background: "none", border: "none", cursor: "pointer", padding: 2 }}>
                        <Trash2 size={14} color={colors.red} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
            {outputCart.length > 0 && (
              <div style={{ padding: "10px 0 0", borderTop: `1px solid ${theme.divider}`, fontSize: 13, color: theme.textTer, fontWeight: 600 }}>
                Jami: {outputCart.length} xil mahsulot
              </div>
            )}
            <Button onClick={save} color={colors.green} size="lg" disabled={outputCart.length === 0} fullWidth style={{ marginTop: 14 }}>
              <Check size={16} color="#fff" /> Saqlash
            </Button>
          </Card>
        </div>
      )}

      {doneRecords.length > 0 && (
        <div>
          <button
            onClick={() => setShowHistory((v) => !v)}
            style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", cursor: "pointer", padding: 0, marginBottom: showHistory ? 14 : 0 }}
          >
            <span style={{ fontSize: 16, fontWeight: 800, color: theme.text }}>Ishlab chiqarish tarixi ({doneRecords.length})</span>
            <ChevronRight size={16} color={theme.textTer} style={{ transform: showHistory ? "rotate(90deg)" : "none", transition: "transform 0.15s" }} />
          </button>
          {showHistory && Object.entries(byDate).map(([date, records]) => (
            <div key={date} style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: theme.textTer, textTransform: "uppercase", letterSpacing: 1.2, marginBottom: 8, paddingLeft: 4 }}>
                {date}
              </div>
              <Card style={{ padding: 0, overflow: "hidden" }}>
                {records.map((rec, idx) => (
                  <button
                    key={rec.id}
                    onClick={() => setDetailRecord(rec)}
                    style={{
                      width: "100%", background: "none", border: "none", cursor: "pointer",
                      display: "flex", alignItems: "center", gap: 16,
                      padding: "14px 20px", textAlign: "left",
                      borderBottom: idx < records.length - 1 ? `1px solid ${theme.divider}` : "none",
                      transition: "background 0.12s",
                    }}
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
                      <span style={{ color: theme.textQuat, fontSize: 14 }}>→</span>
                      {rec.output.map((item) => (
                        <span key={item.productId} style={{ padding: "4px 10px", borderRadius: 20, background: `${colors.green}12`, color: colors.green, fontSize: 12.5, fontWeight: 700 }}>
                          +{formatNumber(item.quantity)} {item.unit} {item.name}
                        </span>
                      ))}
                    </div>
                    <ChevronRight size={16} color={theme.textQuat} style={{ flexShrink: 0 }} />
                  </button>
                ))}
              </Card>
            </div>
          ))}
        </div>
      )}

      <NumpadModal
        open={!!activeOutput}
        onClose={() => setActiveOutput(null)}
        title={activeOutput?.name}
        unit={activeOutput?.unit}
        initialValue={outputCart.find((r) => r.productId === activeOutput?.id)?.quantity}
        onConfirm={confirmQuantity}
        confirmLabel="Qo'shish"
        confirmColor={colors.green}
      />

      <Modal open={!!detailRecord} onClose={() => setDetailRecord(null)} title={`Ishlab chiqarish — ${detailRecord?.date} ${detailRecord?.time}`}>
        {detailRecord && (
          <div>
            <div style={{ fontSize: 12, fontWeight: 800, color: theme.textTer, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 10 }}>Sarflangan xom ashyo</div>
            {detailRecord.items.map((item) => (
              <div key={item.productId} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: `1px solid ${theme.divider}` }}>
                <span style={{ fontWeight: 600, color: theme.text }}>{item.name}</span>
                <span style={{ fontWeight: 800, color: colors.red }}>{formatNumber(item.quantity)} {item.unit}</span>
              </div>
            ))}
            <div style={{ fontSize: 12, fontWeight: 800, color: theme.textTer, textTransform: "uppercase", letterSpacing: 0.8, margin: "18px 0 10px" }}>Ishlab chiqarilgan</div>
            {detailRecord.output.map((item) => (
              <div key={item.productId} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: `1px solid ${theme.divider}` }}>
                <span style={{ fontWeight: 600, color: theme.text }}>{item.name}</span>
                <span style={{ fontWeight: 800, color: colors.green }}>+{formatNumber(item.quantity)} {item.unit}</span>
              </div>
            ))}
          </div>
        )}
      </Modal>
    </div>
  );
}
