import {
  Home, Users, Package, Tag, MapPin,
  Clock, BarChart3, User, LogOut, Factory, Boxes,
} from "lucide-react";
import { useTheme, colors } from "../context/ThemeContext";

const ROLE_TONE = {
  Admin: colors.purple,
  Omborchi: colors.green,
};

const NAV_ITEMS = [
  { id: "dashboard",   label: "Dashboard",        icon: Home },
  { id: "supplier",    label: "Kirim",             icon: Users },
  { id: "warehouse",   label: "Ombor",             icon: Package },
  { id: "consumption", label: "Xom ashyo sarfi",   icon: Boxes },
  { id: "production",  label: "Ishlab chiqarish",  icon: Factory },
  { id: "products",    label: "Mahsulotlar",       icon: Tag },
  { id: "branches",    label: "Filiallar",         icon: MapPin },
  { id: "history",     label: "Tarix",             icon: Clock },
  { id: "reports",     label: "Hisobotlar",        icon: BarChart3 },
];

export default function Sidebar({ activePage, onPageChange, isOpen, allowedPages = [], currentUser, onLogout }) {
  const { theme } = useTheme();
  const visibleNavItems = NAV_ITEMS.filter((item) => allowedPages.includes(item.id));
  const roleColor = ROLE_TONE[currentUser?.role] || colors.blue;

  return (
    <aside
      className="sidebar-transition"
      style={{
        width: isOpen ? 196 : 56,
        background: theme.sidebar,
        borderRight: `1px solid ${theme.sidebarBorder}`,
        display: "flex",
        flexDirection: "column",
        zIndex: 20,
        flexShrink: 0,
        overflow: "hidden",
        boxShadow: "2px 0 12px rgba(0,0,0,0.03)",
      }}
    >
      {/* Logo */}
      <div
        style={{
          height: 72,
          padding: isOpen ? "0 14px" : "0 8px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderBottom: `1px solid ${theme.sidebarBorder}`,
          boxSizing: "border-box",
        }}
      >
        <img
          src={theme.mode === "dark" ? "/assets/DARK-logo.png" : "/assets/LITE-logo.png"}
          alt="Go'sht ERP"
          style={{ height: isOpen ? 54 : 42, width: isOpen ? "auto" : 42, objectFit: "contain" }}
        />
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1, padding: "12px 8px", overflowY: "auto", display: "flex", flexDirection: "column", gap: 8 }}>
        {visibleNavItems.map((item) => {
          const isActive = activePage === item.id;
          const IconComponent = item.icon;

          return (
            <button
              key={item.id}
              onClick={() => onPageChange(item.id)}
              className="app-btn"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                width: "100%",
                padding: isOpen ? "20px 12px" : "20px 12px",
                border: "none",
                borderRadius: 12,
                cursor: "pointer",
                background: colors.gray,
                boxShadow: isActive ? `0 6px 16px ${colors.gray}40` : "none",
                color: "#fff",
                fontWeight: isActive ? 700 : 500,
                fontSize: 14,
                textAlign: "left",
              }}
            >
              <IconComponent size={19} color="#fff" style={{ flexShrink: 0 }} />
              {isOpen && (
                <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", minWidth: 0 }}>
                  {item.label}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Foydalanuvchilar */}
      {allowedPages.includes("users") && (
        <div style={{ padding: "12px 12px", borderTop: `1px solid ${theme.sidebarBorder}` }}>
          <button
            onClick={() => onPageChange("users")}
            className="app-btn"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              width: "100%",
              padding: isOpen ? "20px 12px" : "20px 12px",
              border: "none",
              borderRadius: 12,
              cursor: "pointer",
              background: colors.gray,
              boxShadow: activePage === "users" ? `0 6px 16px ${colors.gray}40` : "none",
              color: "#fff",
              fontWeight: activePage === "users" ? 700 : 500,
              fontSize: 14,
            }}
          >
            <User size={19} color="#fff" style={{ flexShrink: 0 }} />
            {isOpen && (
              <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", minWidth: 0 }}>
                Foydalanuvchilar
              </span>
            )}
          </button>
        </div>
      )}

      {/* Foydalanuvchi profili */}
      <div style={{ padding: 10, borderTop: `1px solid ${theme.sidebarBorder}` }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: isOpen ? "6px" : 0,
            justifyContent: isOpen ? "flex-start" : "center",
          }}
        >
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: 9,
              background: `linear-gradient(135deg, ${colors.blue}, ${colors.green})`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontWeight: 800,
              fontSize: 12,
              flexShrink: 0,
            }}
          >
            {currentUser?.name?.[0] || "?"}
          </div>
          {isOpen && (
            <div style={{ lineHeight: 1.2, flex: 1, minWidth: 0, overflow: "hidden" }}>
              <div style={{ color: theme.text, fontSize: 12.5, fontWeight: 700, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {currentUser?.name}
              </div>
              <div style={{ color: roleColor, fontSize: 10.5, fontWeight: 700, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {currentUser?.role}
              </div>
            </div>
          )}
          {isOpen && (
            <button
              className="icon-btn"
              onClick={onLogout}
              title="Chiqish"
              style={{
                width: 26, height: 26, borderRadius: 9, border: `1px solid ${theme.sidebarBorder}`,
                background: theme.hover, cursor: "pointer", display: "flex", alignItems: "center",
                justifyContent: "center", flexShrink: 0,
              }}
            >
              <LogOut size={12} color={colors.red} />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}

export { NAV_ITEMS };
