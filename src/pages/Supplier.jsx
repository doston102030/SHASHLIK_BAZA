import { useState } from "react";
import { Trash2, Check, Tag, ShoppingCart, Plus, UserPlus, PackagePlus } from "lucide-react";
import { useTheme, colors } from "../context/ThemeContext";
import { Card, Button, Badge, SectionTitle, NumpadModal, Modal, Input, Select } from "../components/ui";

const SUPPLIER_COLORS = [colors.blue, colors.orange, colors.purple, colors.teal, colors.pink, colors.green, colors.red];

export default function Supplier({
  products, setProducts, warehouse, setWarehouse, addHistory, showToast, setIncomings,
  suppliers, setSuppliers, supplierProducts, setSupplierProducts,
}) {
  const { theme } = useTheme();
  const [supplier, setSupplier] = useState(suppliers[0]);
  const [cart, setCart] = useState([]);
  const [activeProduct, setActiveProduct] = useState(null);
  const [addSupplierOpen, setAddSupplierOpen] = useState(false);
  const [newSupplierName, setNewSupplierName] = useState("");
  const [addProductOpen, setAddProductOpen] = useState(false);
  const [newProductForm, setNewProductForm] = useState(null);

  const getSupplierProducts = (sup) =>
    products.filter((p) => p.category === "Xom ashyo" && (supplierProducts[sup] || []).includes(p.name));

  const handleSupplierChange = (name) => {
    setSupplier(name);
    setCart([]);
  };

  const addSupplier = () => {
    const name = newSupplierName.trim();
    if (!name) return showToast("Ism kiriting", "error");
    if (suppliers.includes(name)) return showToast("Bu yetkazib beruvchi allaqachon bor", "error");
    setSuppliers([...suppliers, name]);
    setSupplierProducts((prev) => ({ ...prev, [name]: [] }));
    setNewSupplierName("");
    setAddSupplierOpen(false);
    showToast(`${name} qo'shildi`);
  };

  const addProductToSupplier = (product) => {
    const existing = supplierProducts[supplier] || [];
    if (existing.includes(product.name)) {
      setSupplierProducts((prev) => ({
        ...prev,
        [supplier]: existing.filter((n) => n !== product.name),
      }));
    } else {
      setSupplierProducts((prev) => ({
        ...prev,
        [supplier]: [...existing, product.name],
      }));
    }
  };

  const saveProductChanges = () => {
    setAddProductOpen(false);
    showToast("Mahsulotlar saqlandi");
  };

  const openNewProductForm = () => setNewProductForm({ name: "", unit: "kg" });

  const addNewRawProduct = () => {
    const name = newProductForm.name.trim();
    if (!name) return showToast("Nom kiriting", "error");
    if (products.some((p) => p.name === name)) return showToast("Bu mahsulot allaqachon bor", "error");

    const newId = Math.max(...products.map((p) => p.id)) + 1;
    const newProduct = {
      id: newId, name, category: "Xom ashyo", unit: newProductForm.unit,
      price: 0, cost: 0, minStock: 0, barcode: "",
    };
    setProducts([...products, newProduct]);
    setSupplierProducts((prev) => ({
      ...prev,
      [supplier]: [...(prev[supplier] || []), name],
    }));
    setNewProductForm(null);
    showToast(`${name} qo'shildi`);
  };

  const confirmQuantity = (qty) => {
    setCart((prev) => {
      const existing = prev.find((row) => row.productId === activeProduct.id);
      if (existing) return prev.map((row) => (row.productId === activeProduct.id ? { ...row, quantity: qty } : row));
      return [...prev, { productId: activeProduct.id, quantity: qty }];
    });
    setActiveProduct(null);
  };

  const removeFromCart = (productId) => setCart((prev) => prev.filter((row) => row.productId !== productId));

  const save = () => {
    if (cart.length === 0) return showToast("Kamida bitta mahsulot kiriting", "error");

    const updatedWarehouse = { ...warehouse };
    const newIncomings = [];
    cart.forEach((row) => {
      const product = products.find((p) => p.id === row.productId);
      updatedWarehouse[row.productId] = (updatedWarehouse[row.productId] || 0) + row.quantity;
      addHistory(`${row.quantity} ${product.unit} ${product.name} qabul qilindi (${supplier})`, "in", [row.productId]);
      newIncomings.push({
        id: Date.now() + row.productId,
        supplier,
        productId: row.productId,
        quantity: row.quantity,
        date: new Date().toISOString(),
      });
    });

    setWarehouse(updatedWarehouse);
    setIncomings((prev) => [...newIncomings, ...prev]);
    const count = cart.length;
    setCart([]);
    showToast(`${count} ta mahsulot qabul qilindi`);
  };

  const totalQty = cart.reduce((sum, row) => sum + row.quantity, 0);
  const currentProducts = getSupplierProducts(supplier);

  return (
    <div>
      <SectionTitle>Yangi kirim</SectionTitle>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 20, alignItems: "start" }}>

        {/* CHAP: Yetkazib beruvchilar */}
        <Card style={{ flex: "0 0 220px", minWidth: 200, maxWidth: 240, padding: 16 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
            <span style={{ fontSize: 12, fontWeight: 800, color: theme.textTer, textTransform: "uppercase", letterSpacing: 0.4 }}>
              Yetkazib beruvchi
            </span>
            <button
              onClick={() => setAddSupplierOpen(true)}
              title="Yangi qo'shish"
              style={{
                width: 26, height: 26, borderRadius: 8,
                background: `${colors.blue}15`,
                border: `1.5px solid ${colors.blue}30`,
                cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}
            >
              <Plus size={14} color={colors.blue} />
            </button>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {suppliers.map((name, index) => {
              const color = SUPPLIER_COLORS[index % SUPPLIER_COLORS.length];
              const isActive = supplier === name;
              return (
                <button
                  key={name}
                  onClick={() => handleSupplierChange(name)}
                  className="hover-lift"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                    textAlign: "left",
                    border: `2px solid ${isActive ? color : theme.border}`,
                    background: isActive ? `${color}12` : theme.card,
                    borderRadius: 16,
                    padding: "14px 14px",
                    cursor: "pointer",
                    transition: "all 0.15s",
                    boxShadow: isActive ? `0 4px 14px ${color}25` : "none",
                  }}
                >
                  <div style={{
                    width: 42, height: 42, borderRadius: 13, flexShrink: 0,
                    background: isActive ? color : `${color}20`,
                    color: isActive ? "#fff" : color,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontWeight: 900, fontSize: 19,
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

        {/* O'RTA: Mahsulotlar */}
        <Card style={{ flex: "2 1 320px", minWidth: 280, padding: 20 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14, flexWrap: "wrap", gap: 10 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 38, height: 38, borderRadius: 12, background: `${colors.blue}15`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Tag size={19} color={colors.blue} />
              </div>
              <span style={{ fontSize: 16, fontWeight: 800, color: theme.text }}>Mahsulot tanlang</span>
            </div>
            <button
              onClick={() => setAddProductOpen(true)}
              style={{
                display: "flex", alignItems: "center", gap: 6,
                background: `${colors.blue}15`,
                border: `1.5px solid ${colors.blue}30`,
                borderRadius: 10, padding: "7px 14px",
                cursor: "pointer", fontWeight: 700, fontSize: 13, color: colors.blue,
              }}
            >
              <Plus size={15} color={colors.blue} /> Qo'shish
            </button>
          </div>


          {currentProducts.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px 0", color: theme.textQuat, fontSize: 14 }}>
              Bu yetkazib beruvchida mahsulot yo'q.<br />
              <span style={{ fontSize: 13 }}>Yuqoridagi "+ Qo'shish" tugmasini bosing</span>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: 14 }}>
              {currentProducts.map((product) => {
                const inCart = cart.find((row) => row.productId === product.id);
                return (
                  <button
                    key={product.id}
                    onClick={() => setActiveProduct(product)}
                    className="hover-lift"
                    style={{
                      textAlign: "center",
                      border: `2px solid ${inCart ? colors.green : theme.border}`,
                      background: inCart ? `${colors.green}08` : theme.card,
                      borderRadius: 18,
                      padding: "0 0 14px 0",
                      cursor: "pointer",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: 0,
                      overflow: "hidden",
                      boxShadow: inCart ? `0 6px 18px ${colors.green}25` : "0 2px 8px rgba(0,0,0,0.05)",
                      transition: "all 0.15s",
                    }}
                  >
                    {/* Rasm qismi */}
                    <div style={{
                      width: "100%",
                      height: 90,
                      background: inCart ? `${colors.green}15` : theme.hover,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 46,
                      marginBottom: 10,
                      overflow: "hidden",
                    }}>
                      {product.image
                        ? <img src={product.image} alt={product.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        : (product.emoji || "🥩")
                      }
                    </div>
                    <span style={{ fontWeight: 800, fontSize: 13.5, color: theme.text, lineHeight: 1.3, padding: "0 8px" }}>
                      {product.name}
                    </span>
                    <div style={{ marginTop: 8 }}>
                      {inCart ? (
                        <Badge text={`${inCart.quantity} ${product.unit}`} color={colors.green} />
                      ) : (
                        <div style={{
                          width: 28, height: 28, borderRadius: "50%",
                          border: `2px solid ${theme.border}`,
                          display: "flex", alignItems: "center", justifyContent: "center",
                        }}>
                          <Plus size={14} color={theme.textTer} />
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </Card>

        {/* O'NG: Savatcha */}
        <Card style={{ flex: "1 1 250px", minWidth: 240, padding: 20, position: "sticky", top: 20, display: "flex", flexDirection: "column", minHeight: 380 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
            <div style={{ width: 36, height: 36, borderRadius: 12, background: `${colors.green}15`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <ShoppingCart size={18} color={colors.green} />
            </div>
            <span style={{ fontSize: 16, fontWeight: 800, color: theme.text }}>Savatcha</span>
          </div>

          <div style={{ flex: 1, overflowY: "auto" }}>
            {cart.length === 0 ? (
              <div style={{ textAlign: "center", padding: "40px 0" }}>
                <img
                  src={theme.mode === "dark" ? "/assets/DARK-logo.png" : "/assets/LITE-logo.png"}
                  alt="Go'sht ERP"
                  style={{ height: 40, width: "auto", objectFit: "contain", opacity: 0.5, display: "block", margin: "0 auto 14px" }}
                />
                <div style={{ color: theme.textQuat, fontSize: 14 }}>Mahsulot tanlanmagan</div>
              </div>
            ) : (
              cart.map((row) => {
                const product = products.find((p) => p.id === row.productId);
                return (
                  <div
                    key={row.productId}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "12px 0",
                      borderBottom: `1px solid ${theme.divider}`,
                    }}
                  >
                    <span style={{ fontWeight: 600, color: theme.text, fontSize: 14 }}>{product.name}</span>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <button
                        onClick={() => setActiveProduct(product)}
                        style={{ background: "none", border: "none", cursor: "pointer", fontWeight: 800, fontSize: 14, color: colors.green }}
                      >
                        {row.quantity} {product.unit}
                      </button>
                      <button onClick={() => removeFromCart(row.productId)} style={{ background: "none", border: "none", cursor: "pointer", padding: 2 }}>
                        <Trash2 size={15} color={colors.red} />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {cart.length > 0 && (
            <div style={{ display: "flex", justifyContent: "space-between", padding: "13px 0", fontWeight: 800, color: theme.text, borderTop: `1px solid ${theme.divider}`, marginTop: 6 }}>
              <span>Jami</span>
              <span>{totalQty} birlik</span>
            </div>
          )}

          <Button onClick={save} color={colors.green} size="lg" disabled={cart.length === 0} fullWidth style={{ marginTop: 10 }}>
            <Check size={16} color="#fff" /> Saqlash
          </Button>
        </Card>
      </div>

      {/* Mahsulot qo'shish modal */}
      <Modal open={addProductOpen} onClose={() => { setAddProductOpen(false); setNewProductForm(null); }} title={`${supplier} — mahsulotlar`}>
        {newProductForm ? (
          <div style={{ marginBottom: 20 }}>
            <Input label="Yangi mahsulot nomi" value={newProductForm.name} onChange={(v) => setNewProductForm((f) => ({ ...f, name: v }))} placeholder="Masalan: Qo'y jigari" />
            <Select label="O'lchov birligi" value={newProductForm.unit} onChange={(v) => setNewProductForm((f) => ({ ...f, unit: v }))} options={[
              { value: "kg", label: "Kilogramm (kg)" },
              { value: "dona", label: "Dona" },
              { value: "litr", label: "Litr" },
            ]} />
            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <Button onClick={() => setNewProductForm(null)} variant="ghost" color={theme.textTer}>Bekor qilish</Button>
              <Button onClick={addNewRawProduct} color={colors.blue}><Check size={16} color="#fff" /> Qo'shish</Button>
            </div>
          </div>
        ) : (
          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 14 }}>
            <button
              onClick={openNewProductForm}
              style={{
                display: "flex", alignItems: "center", gap: 6,
                background: `${colors.blue}15`,
                border: `1.5px solid ${colors.blue}30`,
                borderRadius: 10, padding: "7px 14px",
                cursor: "pointer", fontWeight: 700, fontSize: 13, color: colors.blue,
              }}
            >
              <PackagePlus size={15} color={colors.blue} /> Yangi mahsulot
            </button>
          </div>
        )}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))", gap: 10, marginBottom: 20 }}>
          {products.filter((p) => p.category === "Xom ashyo").map((product) => {
            const selected = (supplierProducts[supplier] || []).includes(product.name);
            return (
              <button
                key={product.id}
                onClick={() => addProductToSupplier(product)}
                className="hover-lift"
                style={{
                  textAlign: "center",
                  border: `2px solid ${selected ? colors.blue : theme.border}`,
                  background: selected ? `${colors.blue}12` : theme.card,
                  borderRadius: 14,
                  padding: "18px 10px",
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 8,
                  transition: "all 0.15s",
                  boxShadow: selected ? `0 4px 12px ${colors.blue}25` : "none",
                }}
              >
                <span style={{ fontWeight: 700, fontSize: 13.5, color: selected ? colors.blue : theme.text, lineHeight: 1.3 }}>
                  {product.name}
                </span>
                <span style={{ fontSize: 11.5, color: selected ? colors.blue : theme.textTer }}>
                  {product.unit}
                </span>
                {selected && (
                  <div style={{ width: 20, height: 20, borderRadius: "50%", background: colors.blue, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Check size={12} color="#fff" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <Button onClick={saveProductChanges} color={colors.blue} size="lg">
            <Check size={16} color="#fff" /> Saqlash
          </Button>
        </div>
      </Modal>

      {/* Yangi yetkazib beruvchi modal */}
      <Modal open={addSupplierOpen} onClose={() => setAddSupplierOpen(false)} title="Yangi yetkazib beruvchi">
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
          <div style={{ width: 48, height: 48, borderRadius: 14, background: `${colors.blue}15`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <UserPlus size={22} color={colors.blue} />
          </div>
          <div style={{ fontSize: 14, color: theme.textSec }}>
            Yangi yetkazib beruvchi qo'shing
          </div>
        </div>
        <Input
          label="Ism / Kompaniya nomi"
          value={newSupplierName}
          onChange={setNewSupplierName}
          placeholder="Masalan: Ahmadjon qassob"
        />
        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 8 }}>
          <Button onClick={addSupplier} color={colors.blue} size="lg">
            <Plus size={16} color="#fff" /> Qo'shish
          </Button>
        </div>
      </Modal>

      <NumpadModal
        open={!!activeProduct}
        onClose={() => setActiveProduct(null)}
        title={activeProduct?.name}
        unit={activeProduct?.unit}
        initialValue={cart.find((row) => row.productId === activeProduct?.id)?.quantity}
        onConfirm={confirmQuantity}
      />
    </div>
  );
}
