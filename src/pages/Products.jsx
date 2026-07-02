import { useState, useRef } from "react";
import { Plus, Check, ImagePlus, Trash2 } from "lucide-react";
import { useTheme, colors } from "../context/ThemeContext";
import { Card, Button, Input, Select, Badge, Modal, Table, TabBar } from "../components/ui";
import { CATEGORIES } from "../utils/data";
import { getCategoryEmoji } from "../utils/helpers";

const emptyForm = { name: "", category: CATEGORIES[0], unit: "kg", price: "", cost: "", minStock: "", barcode: "", image: "" };

export default function Products({ products, setProducts, showToast }) {
  const { theme } = useTheme();
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [stockType, setStockType] = useState("raw"); // "raw" | "finished"
  const fileRef = useRef();

  const scopedProducts = products.filter((p) => (stockType === "raw" ? p.category === "Xom ashyo" : p.category !== "Xom ashyo"));

  const openAdd = () => { setForm(emptyForm); setEditId(null); setModalOpen(true); };

  const openEdit = (product) => {
    setForm({
      name: product.name, category: product.category, unit: product.unit,
      price: product.price, cost: product.cost, minStock: product.minStock,
      barcode: product.barcode || "", image: product.image || "",
    });
    setEditId(product.id);
    setModalOpen(true);
  };

  const confirmRemoveProduct = () => {
    setProducts(products.filter((p) => p.id !== deleteTarget.id));
    showToast(`${deleteTarget.name} o'chirildi`);
    setDeleteTarget(null);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setForm((f) => ({ ...f, image: ev.target.result }));
    reader.readAsDataURL(file);
  };

  const save = () => {
    if (!form.name.trim()) return showToast("Nom kiriting", "error");
    if (editId) {
      setProducts(products.map((p) =>
        p.id === editId
          ? { ...p, name: form.name, category: form.category, unit: form.unit, price: +form.price, cost: +form.cost, minStock: +form.minStock, barcode: form.barcode, image: form.image }
          : p
      ));
      showToast("Mahsulot yangilandi");
    } else {
      const newId = Math.max(...products.map((p) => p.id)) + 1;
      setProducts([...products, {
        id: newId, name: form.name, category: form.category, unit: form.unit,
        price: +form.price, cost: +form.cost, minStock: +form.minStock, barcode: form.barcode, image: form.image,
      }]);
      showToast("Mahsulot qo'shildi");
    }
    setModalOpen(false);
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
        <TabBar
          tabs={[{ id: "raw", label: "Xom ashyo" }, { id: "finished", label: "Tayyor mahsulot" }]}
          active={stockType}
          onChange={setStockType}
          color={colors.blue}
        />
        <Button onClick={openAdd}><Plus size={16} color="#fff" /> Yangi mahsulot</Button>
      </div>
      <div style={{ marginBottom: 12, fontSize: 14, color: theme.textTer, fontWeight: 600 }}>
        Jami: {scopedProducts.length} ta mahsulot
      </div>

      <Card style={{ padding: 0, overflow: "hidden", borderRadius: 20 }}>
        <Table columns={[
          { label: "#", render: (_, i) => <span style={{ color: theme.textQuat }}>{i + 1}</span> },
          {
            label: "Nomi",
            render: (r) => (
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                {r.image ? (
                  <img src={r.image} alt={r.name} style={{ width: 36, height: 36, borderRadius: 10, objectFit: "cover", flexShrink: 0 }} />
                ) : (
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: theme.hover, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>
                    {r.emoji || getCategoryEmoji(r.category)}
                  </div>
                )}
                <span style={{ fontWeight: 700, fontSize: 15 }}>{r.name}</span>
              </div>
            ),
          },
          { label: "Kategoriya", render: (r) => <Badge text={r.category} color={colors.purple} /> },
          { label: "O'lchov", render: (r) => <Badge text={r.unit.toUpperCase()} color={colors.orange} /> },
          {
            label: "",
            render: (r) => (
              <div style={{ display: "flex", alignItems: "center", gap: 8, justifyContent: "flex-end" }}>
                <Button onClick={() => openEdit(r)} variant="ghost" size="sm" color={colors.blue}>Tahrirlash</Button>
                <button
                  onClick={() => setDeleteTarget(r)}
                  style={{ background: `${colors.red}10`, border: `1px solid ${colors.red}30`, borderRadius: 9, width: 32, height: 32, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}
                >
                  <Trash2 size={15} color={colors.red} />
                </button>
              </div>
            ),
          },
        ]} data={scopedProducts} />
      </Card>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editId ? "Tahrirlash" : "Yangi mahsulot"}>

        {/* Rasm yuklash */}
        <div style={{ marginBottom: 18 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: theme.textSec, marginBottom: 8 }}>Rasm</div>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div
              onClick={() => fileRef.current.click()}
              style={{
                width: 90, height: 90, borderRadius: 16,
                border: `2px dashed ${form.image ? colors.blue : theme.border}`,
                background: form.image ? "transparent" : theme.hover,
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer", overflow: "hidden", flexShrink: 0,
              }}
            >
              {form.image ? (
                <img src={form.image} alt="preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : (
                <div style={{ textAlign: "center" }}>
                  <ImagePlus size={24} color={theme.textTer} />
                  <div style={{ fontSize: 11, color: theme.textTer, marginTop: 4 }}>Yuklash</div>
                </div>
              )}
            </div>
            <div>
              <Button onClick={() => fileRef.current.click()} variant="ghost" color={colors.blue} size="sm">
                <ImagePlus size={15} /> {form.image ? "Almashtirish" : "Rasm tanlash"}
              </Button>
              {form.image && (
                <div style={{ marginTop: 8 }}>
                  <Button onClick={() => setForm((f) => ({ ...f, image: "" }))} variant="ghost" color={colors.red} size="sm">
                    O'chirish
                  </Button>
                </div>
              )}
            </div>
          </div>
          <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleImageUpload} />
        </div>

        <Input label="Nomi" value={form.name} onChange={(v) => setForm({ ...form, name: v })} placeholder="Mahsulot nomi" />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <Select label="Kategoriya" value={form.category} onChange={(v) => setForm({ ...form, category: v })} options={CATEGORIES} />
          <Select label="O'lchov birligi" value={form.unit} onChange={(v) => setForm({ ...form, unit: v })} options={[
            { value: "kg", label: "Kilogramm (kg)" },
            { value: "dona", label: "Dona" },
            { value: "litr", label: "Litr" },
          ]} />
        </div>
        <div style={{ display: "flex", gap: 12, justifyContent: "flex-end", marginTop: 22 }}>
          <Button onClick={() => setModalOpen(false)} variant="ghost" color={theme.textTer}>Bekor qilish</Button>
          <Button onClick={save} color={colors.green}><Check size={16} color="#fff" /> Saqlash</Button>
        </div>
      </Modal>

      <Modal open={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Mahsulotni o'chirish">
        <div style={{ fontSize: 15, color: theme.text, marginBottom: 24 }}>
          <strong>{deleteTarget?.name}</strong> mahsulotini o'chirmoqchimisiz? Bu amalni orqaga qaytarib bo'lmaydi.
        </div>
        <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
          <Button onClick={() => setDeleteTarget(null)} variant="ghost" color={theme.textTer}>Bekor qilish</Button>
          <Button onClick={confirmRemoveProduct} color={colors.red}><Trash2 size={16} color="#fff" /> O'chirish</Button>
        </div>
      </Modal>
    </div>
  );
}
