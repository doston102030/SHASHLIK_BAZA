import { useState } from "react";
import { Send, Plus, Trash2, MapPin } from "lucide-react";
import { useTheme, colors } from "../context/ThemeContext";
import { Card, Button, Input, Badge, Modal, NumpadModal, SectionTitle } from "../components/ui";
import { BRANCH_OUT_PRODUCTS } from "../utils/data";
import { formatNumber } from "../utils/helpers";

export default function Branches({
  products, warehouse, setWarehouse, branchStock, setBranchStock,
  addHistory, showToast, branches, setBranches, setOutgoings,
}) {
  const { theme } = useTheme();
  const [selectedBranch, setSelectedBranch] = useState(branches[0]);
  const [branchModalOpen, setBranchModalOpen] = useState(false);
  const [newBranchName, setNewBranchName] = useState("");

  const outProducts = products.filter((p) => BRANCH_OUT_PRODUCTS.includes(p.id));
  const [cart, setCart] = useState([]);
  const [activeProduct, setActiveProduct] = useState(null);

  const confirmQuantity = (qty) => {
    const available = warehouse[activeProduct.id] || 0;
    if (qty > available) {
      showToast(`${activeProduct.name} omborda ${formatNumber(available)} ${activeProduct.unit} bor`, "error");
      return;
    }
    setCart((prev) => {
      const ex = prev.find((r) => r.productId === activeProduct.id);
      if (ex) return prev.map((r) => r.productId === activeProduct.id ? { ...r, quantity: qty } : r);
      return [...prev, { productId: activeProduct.id, quantity: qty }];
    });
    setActiveProduct(null);
  };

  const send = () => {
    if (!cart.length) return showToast("Mahsulot tanlang", "error");

    for (const row of cart) {
      const available = warehouse[row.productId] || 0;
      if (row.quantity > available) {
        const product = products.find((p) => p.id === row.productId);
        return showToast(`${product.name} omborda yetarli emas`, "error");
      }
    }

    const updatedWH = { ...warehouse };
    const updatedBS = { ...branchStock, [selectedBranch]: { ...(branchStock[selectedBranch] || {}) } };

    const newOutgoings = [];
    cart.forEach((row) => {
      const pid = row.productId;
      const quantity = row.quantity;
      updatedWH[pid] = (updatedWH[pid] || 0) - quantity;
      updatedBS[selectedBranch][pid] = (updatedBS[selectedBranch][pid] || 0) + quantity;
      const product = products.find((p) => p.id === pid);
      addHistory(`${formatNumber(quantity)} ${product.unit} ${product.name} ${selectedBranch} ga yuborildi`, "out", [pid]);
      newOutgoings.push({
        id: Date.now() + pid,
        branch: selectedBranch,
        productId: pid,
        quantity,
        date: new Date().toISOString(),
      });
    });

    setWarehouse(updatedWH);
    setBranchStock(updatedBS);
    setOutgoings((prev) => [...newOutgoings, ...prev]);
    setCart([]);
    showToast(`${selectedBranch} ga yuborildi`);
  };

  const addBranch = () => {
    const name = newBranchName.trim();
    if (!name) return showToast("Filial nomini kiriting", "error");
    if (branches.includes(name)) return showToast("Bu filial allaqachon mavjud", "error");
    setBranches([...branches, name]);
    setNewBranchName("");
    setBranchModalOpen(false);
    showToast(`${name} filiali qo'shildi`);
  };

  return (
    <div>
      {/* Filial tanlash */}
      <div style={{ display: "flex", gap: 12, marginBottom: 22, flexWrap: "wrap", alignItems: "center" }}>
        {branches.map((branch) => (
          <button
            key={branch}
            onClick={() => setSelectedBranch(branch)}
            style={{
              padding: "14px 28px", borderRadius: 14, cursor: "pointer", fontWeight: 800, fontSize: 15,
              background: selectedBranch === branch ? colors.blue : theme.card,
              color: selectedBranch === branch ? "#fff" : theme.text,
              border: `1.5px solid ${selectedBranch === branch ? colors.blue : theme.border}`,
              boxShadow: selectedBranch === branch ? `0 6px 18px ${colors.blue}30` : "none",
              transition: "all 0.2s",
            }}
          >
            {branch}
          </button>
        ))}
        <Button onClick={() => setBranchModalOpen(true)} variant="ghost" color={colors.purple}>
          <MapPin size={16} /> Filial qo'shish
        </Button>
      </div>

      {/* Yuborish paneli (cart tarzida) */}
      <Card style={{ borderRadius: 20 }}>
        <SectionTitle>{selectedBranch} ga yuborish</SectionTitle>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(170px, 1fr))", gap: 14, marginTop: 14, marginBottom: 16 }}>
            {outProducts.map((product) => {
              const inCart = cart.find((r) => r.productId === product.id);
              return (
                <button
                  key={product.id}
                  onClick={() => setActiveProduct(product)}
                  className="hover-lift"
                  style={{
                    textAlign: "center",
                    border: `1.5px solid ${inCart ? colors.green : theme.border}`,
                    background: inCart ? `${colors.green}10` : theme.card,
                    borderRadius: 16, padding: "18px 12px", cursor: "pointer",
                    display: "flex", flexDirection: "column", alignItems: "center", gap: 9,
                  }}
                >
                  <span style={{ fontWeight: 700, fontSize: 16, color: theme.text }}>{product.name}</span>
                  {inCart ? (
                    <Badge text={`${formatNumber(inCart.quantity)} ${product.unit}`} color={colors.green} />
                  ) : (
                    <span style={{ fontSize: 13, color: theme.textTer, fontWeight: 600 }}>
                      Omborda: {formatNumber(warehouse[product.id] || 0)} {product.unit}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {cart.length > 0 && (
            <div style={{ border: `1px solid ${theme.border}`, borderRadius: 12, overflow: "hidden", marginBottom: 16 }}>
              {cart.map((row, idx) => {
                const product = products.find((p) => p.id === row.productId);
                return (
                  <div key={row.productId} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", background: theme.card, borderBottom: idx < cart.length - 1 ? `1px solid ${theme.divider}` : "none" }}>
                    <span style={{ fontWeight: 600, color: theme.text, fontSize: 14 }}>{product.name}</span>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{ fontWeight: 800, color: colors.green, fontSize: 14 }}>{formatNumber(row.quantity)} {product.unit}</span>
                      <button onClick={() => setCart(cart.filter((r) => r.productId !== row.productId))} style={{ background: "none", border: "none", cursor: "pointer", padding: 2 }}>
                        <Trash2 size={14} color={colors.red} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <Button onClick={send} color={colors.orange} size="lg" disabled={!cart.length}>
              <Send size={16} color="#fff" /> Yuborish
            </Button>
          </div>
      </Card>

      <NumpadModal
        open={!!activeProduct}
        onClose={() => setActiveProduct(null)}
        title={activeProduct?.name}
        unit={activeProduct?.unit}
        initialValue={cart.find((r) => r.productId === activeProduct?.id)?.quantity}
        onConfirm={confirmQuantity}
        confirmLabel="Qo'shish"
        confirmColor={colors.green}
      />

      {/* Filial qo'shish modal */}
      <Modal open={branchModalOpen} onClose={() => setBranchModalOpen(false)} title="Yangi filial qo'shish">
        <Input
          label="Filial nomi"
          value={newBranchName}
          onChange={setNewBranchName}
          placeholder="Masalan: YUNUSOBOD"
        />
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <Button onClick={addBranch} color={colors.purple} size="lg"><Plus size={16} color="#fff" /> Qo'shish</Button>
        </div>
      </Modal>
    </div>
  );
}
