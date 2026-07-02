import { useState } from "react";
import { Tag, AlertTriangle, Users, ClipboardList } from "lucide-react";
import { useTheme, colors } from "../context/ThemeContext";
import { Card, StatCard, Badge, Table, TabBar, Input, Modal } from "../components/ui";
import { formatNumber } from "../utils/helpers";

export default function Reports({ products, warehouse, branchStock, branches, incomings = [], outgoings = [] }) {
  const { theme } = useTheme();
  const [tab, setTab] = useState("stock");
  const [datePreset, setDatePreset] = useState("today"); // "today" | "week" | "month"
  const [customFrom, setCustomFrom] = useState("");
  const [customTo, setCustomTo] = useState("");
  const [viewSupplier, setViewSupplier] = useState(null);
  const [viewProduct, setViewProduct] = useState(null);

  const tabs = [
    { id: "stock", label: "Ombor" },
    { id: "incoming", label: "Kirim" },
    { id: "branches", label: "Filiallar" },
  ];

  const changeDatePreset = (id) => {
    setDatePreset(id);
    setCustomFrom("");
    setCustomTo("");
  };

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

  const inRange = (isoDate) => {
    const d = new Date(isoDate);
    d.setHours(0, 0, 0, 0);
    return d >= rangeFrom && d <= rangeTo;
  };

  const rangedIncomings = incomings.filter((inc) => inRange(inc.date));
  const rangedOutgoings = outgoings.filter((out) => inRange(out.date));

  // Yetkazib beruvchi bo'yicha kirim statistikasi
  const incomingsBySupplier = rangedIncomings.reduce((acc, inc) => {
    if (!acc[inc.supplier]) acc[inc.supplier] = { supplier: inc.supplier, count: 0, totalQuantity: 0 };
    acc[inc.supplier].count += 1;
    acc[inc.supplier].totalQuantity += inc.quantity;
    return acc;
  }, {});
  const supplierRows = Object.values(incomingsBySupplier);

  // Filial bo'yicha chiqim statistikasi
  const outgoingsByBranch = rangedOutgoings.reduce((acc, out) => {
    if (!acc[out.branch]) acc[out.branch] = 0;
    acc[out.branch] += out.quantity;
    return acc;
  }, {});

  return (
    <div>
      {/* Tab buttons */}
      <div style={{ display: "flex", gap: 6, marginBottom: 18, flexWrap: "wrap", background: theme.hover, padding: 5, borderRadius: 16, width: "fit-content" }}>
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            style={{
              padding: "10px 24px", borderRadius: 12, border: "none", cursor: "pointer",
              fontWeight: 700, fontSize: 15,
              background: tab === t.id ? colors.blue : "transparent",
              color: tab === t.id ? "#fff" : theme.textSec,
              transition: "all 0.18s",
              boxShadow: tab === t.id ? `0 2px 8px ${colors.blue}30` : "none",
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Sana bo'yicha filtr */}
      <div style={{ display: "flex", gap: 14, flexWrap: "wrap", alignItems: "center", marginBottom: 22 }}>
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

      {/* ── OMBOR ── */}
      {tab === "stock" && (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))", gap: 16, marginBottom: 24 }}>
            <StatCard label="Mahsulot turlari" value={products.length} color={colors.blue} icon={Tag} />
            <StatCard label="Kam qolgan" value={products.filter((p) => (warehouse[p.id] || 0) < p.minStock).length} color={colors.red} icon={AlertTriangle} />
          </div>
          <Card style={{ padding: 0, overflow: "hidden", borderRadius: 20 }}>
            <Table
              columns={[
                { label: "Mahsulot", render: (r) => <span style={{ fontWeight: 700 }}>{r.name}</span> },
                { label: "Qoldiq", align: "right", render: (r) => `${formatNumber(warehouse[r.id] || 0)} ${r.unit}` },
              ]}
              data={products}
              onRowClick={(r) => setViewProduct(r)}
            />
          </Card>
        </>
      )}

      {/* ── KIRIM ── */}
      {tab === "incoming" && (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>
            <StatCard label="Yetkazib beruvchilar" value={supplierRows.length} color={colors.blue} icon={Users} />
            <StatCard label="Jami kirim operatsiyalari" value={rangedIncomings.length} color={colors.purple} icon={ClipboardList} />
          </div>
          <Card style={{ padding: 0, overflow: "hidden", borderRadius: 20 }}>
            <Table
              columns={[
                { label: "Yetkazib beruvchi", render: (r) => <span style={{ fontWeight: 700 }}>{r.supplier}</span> },
                { label: "Operatsiyalar", align: "right", render: (r) => r.count },
                { label: "Jami miqdor", align: "right", render: (r) => formatNumber(r.totalQuantity) },
              ]}
              data={supplierRows}
              emptyText="Hali kirim yo'q"
              onRowClick={(r) => setViewSupplier(r.supplier)}
            />
          </Card>
        </>
      )}

      {/* ── FILIALLAR ── */}
      {tab === "branches" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: 16 }}>
          {branches.map((branch) => {
            const stock = branchStock[branch] || {};
            const items = Object.entries(stock)
              .map(([pid, qty]) => {
                const product = products.find((p) => p.id === Number(pid));
                return product ? { name: product.name, unit: product.unit, quantity: qty, value: qty * product.cost } : null;
              })
              .filter(Boolean);
            const totalValue = items.reduce((acc, item) => acc + item.value, 0);

            return (
              <Card key={branch}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <h3 style={{ fontSize: 18, fontWeight: 800, margin: 0, color: theme.text }}>{branch}</h3>
                  <Badge text={`${formatNumber(totalValue)} so'm`} color={colors.blue} />
                </div>
                <div style={{ fontSize: 13, color: theme.textTer, marginBottom: 12 }}>
                  Jami chiqarilgan: {formatNumber(outgoingsByBranch[branch] || 0)} birlik
                </div>
                {items.map((item, index) => (
                  <div key={index} style={{ display: "flex", justifyContent: "space-between", padding: "12px 0", borderBottom: `1px solid ${theme.divider}`, fontSize: 15, color: theme.text }}>
                    <span>{item.name}</span>
                    <span style={{ fontWeight: 700 }}>{formatNumber(item.quantity)} {item.unit}</span>
                  </div>
                ))}
              </Card>
            );
          })}
        </div>
      )}

      {/* Yetkazib beruvchi tafsiloti */}
      <Modal open={!!viewSupplier} onClose={() => setViewSupplier(null)} title={`${viewSupplier} — kelgan mahsulotlar`}>
        {viewSupplier && (
          <div>
            {rangedIncomings.filter((inc) => inc.supplier === viewSupplier).map((inc) => {
              const product = products.find((p) => p.id === inc.productId);
              const d = new Date(inc.date);
              return (
                <div key={inc.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: `1px solid ${theme.divider}` }}>
                  <div>
                    <div style={{ fontWeight: 700, color: theme.text, fontSize: 15 }}>{product?.name}</div>
                    <div style={{ fontSize: 12.5, color: theme.textTer, marginTop: 2 }}>
                      {d.toLocaleDateString("uz-UZ")} · {d.toLocaleTimeString("uz-UZ", { hour: "2-digit", minute: "2-digit" })}
                    </div>
                  </div>
                  <span style={{ fontWeight: 800, color: colors.blue, fontSize: 15 }}>{formatNumber(inc.quantity)} {product?.unit}</span>
                </div>
              );
            })}
          </div>
        )}
      </Modal>

      {/* Mahsulot bo'yicha — kimdan qancha kelgani */}
      <Modal open={!!viewProduct} onClose={() => setViewProduct(null)} title={`${viewProduct?.name} — kimdan qancha keldi`}>
        {viewProduct && (() => {
          const productIncomings = rangedIncomings.filter((inc) => inc.productId === viewProduct.id);
          const bySupplier = productIncomings.reduce((acc, inc) => {
            if (!acc[inc.supplier]) acc[inc.supplier] = 0;
            acc[inc.supplier] += inc.quantity;
            return acc;
          }, {});
          const rows = Object.entries(bySupplier);

          return rows.length === 0 ? (
            <div style={{ textAlign: "center", padding: 40, color: theme.textQuat, fontSize: 15 }}>
              Bu davrda kirim bo'lmagan
            </div>
          ) : (
            <div>
              {rows.map(([supplier, quantity]) => (
                <div key={supplier} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: `1px solid ${theme.divider}` }}>
                  <span style={{ fontWeight: 700, color: theme.text, fontSize: 15 }}>{supplier}</span>
                  <span style={{ fontWeight: 800, color: colors.blue, fontSize: 15 }}>{formatNumber(quantity)} {viewProduct.unit}</span>
                </div>
              ))}
            </div>
          );
        })()}
      </Modal>
    </div>
  );
}
