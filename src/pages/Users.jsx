import { useState } from "react";
import { User, Plus, Trash2 } from "lucide-react";
import { useTheme, colors } from "../context/ThemeContext";
import { Card, Button, Input, Select, Badge, Table, Modal, SectionTitle } from "../components/ui";
import { ROLES, ROLE_PERMISSIONS } from "../utils/data";

const ROLE_COLORS = {
  Admin: "#2563EB",
  Omborchi: "#10B981",
};

const PAGE_LABELS = {
  dashboard:   "Dashboard",
  supplier:    "Kirim",
  warehouse:   "Ombor",
  consumption: "Xom ashyo sarfi",
  production:  "Ishlab chiqarish",
  products:    "Mahsulotlar",
  branches:    "Filiallar",
  history:     "Tarix",
  reports:     "Hisobotlar",
  users:       "Foydalanuvchilar",
};

const permissionsLabel = (role) => {
  const pages = ROLE_PERMISSIONS[role] || [];
  return pages.map((id) => PAGE_LABELS[id] || id).join(", ");
};

export default function Users({ employees, setEmployees }) {
  const { theme } = useTheme();
  const [modalOpen, setModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [role, setRole] = useState(ROLES[0]);

  const addEmployee = () => {
    if (!name.trim()) return;
    setEmployees([
      ...employees,
      {
        id: Date.now(),
        name: name.trim(),
        role,
        status: "Faol",
        color: ROLE_COLORS[role] || colors.blue,
        permissions: permissionsLabel(role),
      },
    ]);
    setName("");
    setRole(ROLES[0]);
    setModalOpen(false);
  };

  const removeEmployee = (id) => {
    setEmployees(employees.filter((e) => e.id !== id));
  };

  const toggleStatus = (id) => {
    setEmployees(
      employees.map((e) => (e.id === id ? { ...e, status: e.status === "Faol" ? "Nofaol" : "Faol" } : e))
    );
  };

  return (
    <div>
      <SectionTitle extra={
        <Button onClick={() => setModalOpen(true)} color={colors.blue}>
          <Plus size={16} color="#fff" /> Xodim qo'shish
        </Button>
      }>
        Xodimlar
      </SectionTitle>

      <Card style={{ padding: 0, overflow: "hidden", borderRadius: 20 }}>
        <Table
          columns={[
            {
              label: "Ism",
              render: (row) => (
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <div
                    style={{
                      width: 46,
                      height: 46,
                      borderRadius: 14,
                      background: `${row.color}15`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <User size={22} color={row.color} />
                  </div>
                  <span style={{ fontWeight: 700, fontSize: 16 }}>{row.name}</span>
                </div>
              ),
            },
            {
              label: "Rol",
              render: (row) => <Badge text={row.role} color={row.color} />,
            },
            {
              label: "Holat",
              render: (row) => (
                <button
                  onClick={() => toggleStatus(row.id)}
                  style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}
                >
                  <Badge text={row.status} color={row.status === "Faol" ? colors.green : colors.red} />
                </button>
              ),
            },
            {
              label: "Ruxsatlar",
              render: (row) => (
                <span style={{ fontSize: 14, color: theme.textSec }}>{row.permissions}</span>
              ),
            },
            {
              label: "",
              align: "right",
              render: (row) => (
                <button
                  onClick={() => removeEmployee(row.id)}
                  style={{ background: "none", border: "none", cursor: "pointer", padding: 8 }}
                >
                  <Trash2 size={18} color={colors.red} />
                </button>
              ),
            },
          ]}
          data={employees}
        />
      </Card>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Yangi xodim qo'shish">
        <Input label="Ism" value={name} onChange={setName} placeholder="Ism familiya" />
        <Select label="Rol" value={role} onChange={setRole} options={ROLES} />
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <Button onClick={addEmployee} color={colors.blue} size="lg">
            <Plus size={16} color="#fff" /> Qo'shish
          </Button>
        </div>
      </Modal>
    </div>
  );
}
