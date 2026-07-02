import { useState, useEffect } from "react";
import { ThemeProvider, useTheme } from "./context/ThemeContext";
import { LanguageProvider } from "./context/LanguageContext";
import { KeyboardProvider } from "./context/KeyboardContext";
import { Toast } from "./components/ui";
import Sidebar, { NAV_ITEMS } from "./components/Sidebar";
import Topbar from "./components/Topbar";
import VirtualKeyboard from "./components/VirtualKeyboard";
import {
  INITIAL_PRODUCTS,
  INITIAL_WAREHOUSE,
  INITIAL_BRANCH_STOCK,
  INITIAL_HISTORY,
  INITIAL_INCOMINGS,
  BRANCHES,
  USERS,
  ROLE_PERMISSIONS,
  SUPPLIERS,
  SUPPLIER_PRODUCTS,
} from "./utils/data";
import { getCurrentTime } from "./utils/helpers";
import { usePersistedState } from "./utils/usePersistedState";
import { playClickSound, playSuccessSound } from "./utils/clickSound";

// Pages
import Dashboard from "./pages/Dashboard";
import Supplier from "./pages/Supplier";
import RawConsumption from "./pages/RawConsumption";
import Production from "./pages/Production";
import Warehouse from "./pages/Warehouse";
import Products from "./pages/Products";
import Branches from "./pages/Branches";
import History from "./pages/History";
import Reports from "./pages/Reports";
import Users from "./pages/Users";
import Login from "./pages/Login";

function AppContent() {
  const { theme } = useTheme();

  // ── State (localStorage'da saqlanadi — tok/internet uzilib qolsa ham ma'lumot yo'qolmaydi) ──
  const [activePage, setActivePage] = usePersistedState("activePage", "dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(() => window.innerWidth >= 900);
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 640);
  const [products, setProducts] = usePersistedState("products", INITIAL_PRODUCTS);
  const [warehouse, setWarehouse] = usePersistedState("warehouse", INITIAL_WAREHOUSE);
  const [branchStock, setBranchStock] = usePersistedState("branchStock", INITIAL_BRANCH_STOCK);
  const [history, setHistory] = usePersistedState("history", INITIAL_HISTORY);
  const [branches, setBranches] = usePersistedState("branches", BRANCHES);
  const [suppliers, setSuppliers] = usePersistedState("suppliers", SUPPLIERS);
  const [supplierProducts, setSupplierProducts] = usePersistedState("supplierProducts", SUPPLIER_PRODUCTS);
  const [employees, setEmployees] = usePersistedState("employees", USERS);
  const [incomings, setIncomings] = usePersistedState("incomings", INITIAL_INCOMINGS);
  const [outgoings, setOutgoings] = usePersistedState("outgoings", []);
  const [consumptions, setConsumptions] = usePersistedState("consumptions", []);
  const [toast, setToast] = useState(null);
  const [currentUser, setCurrentUser] = usePersistedState("currentUser", null);

  const currentRole = currentUser?.role;
  const allowedPages = ROLE_PERMISSIONS[currentRole] || [];

  // ── Helpers ──
  const showToast = (message, type = "success") => {
    setToast({ message, type });
    if (type === "success") playSuccessSound();
    setTimeout(() => setToast(null), 2800);
  };

  // Rol almashganda ruxsat etilmagan sahifadan birinchi ruxsat etilgan sahifaga qaytarish
  useEffect(() => {
    if (currentRole && !allowedPages.includes(activePage)) setActivePage(allowedPages[0]);
  }, [currentRole]);

  // Eski brauzerlarda saqlangan chalkashtiruvchi namuna yozuvlarini bir martalik tozalash
  useEffect(() => {
    const STALE_HISTORY_TEXTS = [
      "250 kg Mol go'shti qabul qilindi (Fayzillo aka)",
      "120 kg Qiyma (mol yog'li) ishlab chiqarildi",
      "50 dona Shashlik SOXIL filialiga yuborildi",
    ];
    setHistory((prev) => prev.filter((h) => !STALE_HISTORY_TEXTS.includes(h.text)));
    if (incomings.length === 0) setIncomings(INITIAL_INCOMINGS);
  }, []);

  // Barcha qoldiqlarni 0 ga tushirish (bir martalik, keyingi yuklashlarda qayta ishlamaydi)
  useEffect(() => {
    const RESET_FLAG = "meat-erp:stockResetToZero_v1";
    if (!localStorage.getItem(RESET_FLAG)) {
      setWarehouse(INITIAL_WAREHOUSE);
      setBranchStock(INITIAL_BRANCH_STOCK);
      setIncomings(INITIAL_INCOMINGS);
      localStorage.setItem(RESET_FLAG, "1");
    }
  }, []);

  // Tor ekranda yon panelni avtomatik yopish
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 900) setSidebarOpen(false);
      setIsMobile(window.innerWidth < 640);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Har qanday tugma bosilganda ovoz chiqarish
  useEffect(() => {
    const handleClick = (e) => {
      if (e.target.closest?.("button")) playClickSound();
    };
    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, []);

  const handleLogout = () => {
    setCurrentUser(null);
    setActivePage("dashboard");
  };

  const addHistory = (text, type, productIds = []) => {
    const now = new Date();
    const date = `${String(now.getDate()).padStart(2, "0")}.${String(now.getMonth() + 1).padStart(2, "0")}.${now.getFullYear()}`;
    setHistory((prev) => [{ time: getCurrentTime(), date, text, type, productIds }, ...prev]);
  };

  // ── Sahifa nomi ──
  const getPageTitle = () => {
    const navItem = NAV_ITEMS.find((n) => n.id === activePage);
    return navItem ? navItem.label : "Foydalanuvchilar";
  };

  // ── Barcha sahifalarga uzatiladigan props ──
  const sharedProps = {
    products,
    setProducts,
    warehouse,
    setWarehouse,
    branchStock,
    setBranchStock,
    history,
    addHistory,
    showToast,
    branches,
    setBranches,
    suppliers,
    setSuppliers,
    supplierProducts,
    setSupplierProducts,
    employees,
    setEmployees,
    incomings,
    setIncomings,
    outgoings,
    setOutgoings,
    consumptions,
    setConsumptions,
    onNavigate: setActivePage,
    currentUser,
  };

  if (!currentUser) {
    return <Login employees={employees} onLogin={setCurrentUser} />;
  }

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', 'Helvetica Neue', sans-serif",
        background: theme.bg,
        color: theme.text,
        overflow: "hidden",
        transition: "background 0.35s, color 0.35s",
      }}
    >
      {/* Mobil overlay (sidebar ochiq bo'lganda fonni qorong'ulashtirib, tashqarisiga bosilsa yopadi) */}
      {isMobile && sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 15 }}
        />
      )}

      {/* Sidebar */}
      <div
        style={
          isMobile
            ? { position: "fixed", top: 0, bottom: 0, left: 0, zIndex: 20, transform: sidebarOpen ? "translateX(0)" : "translateX(-100%)", transition: "transform 0.28s cubic-bezier(.4,0,.2,1)" }
            : undefined
        }
      >
        <Sidebar
          activePage={activePage}
          onPageChange={(page) => {
            setActivePage(page);
            if (isMobile) setSidebarOpen(false);
          }}
          isOpen={isMobile ? true : sidebarOpen}
          allowedPages={allowedPages}
          currentUser={currentUser}
          onLogout={handleLogout}
        />
      </div>

      {/* Main Content */}
      <main style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", minWidth: 0 }}>
        {/* Top Bar */}
        <Topbar title={getPageTitle()} onMenuClick={() => setSidebarOpen((v) => !v)} isMobile={isMobile} />

        {/* Page Content */}
        <div style={{ flex: 1, overflow: "auto", padding: isMobile ? 14 : 28 }}>
          {activePage === "dashboard"  && allowedPages.includes("dashboard")  && <Dashboard {...sharedProps} />}
          {activePage === "supplier"   && allowedPages.includes("supplier")   && <Supplier {...sharedProps} />}
          {activePage === "warehouse"   && allowedPages.includes("warehouse")   && <Warehouse {...sharedProps} />}
          {activePage === "consumption" && allowedPages.includes("consumption") && <RawConsumption {...sharedProps} />}
          {activePage === "production"  && allowedPages.includes("production")  && <Production {...sharedProps} />}
          {activePage === "products"   && allowedPages.includes("products")   && <Products {...sharedProps} />}
          {activePage === "branches"   && allowedPages.includes("branches")   && <Branches {...sharedProps} />}
          {activePage === "history"    && allowedPages.includes("history")    && <History history={history} suppliers={suppliers} />}
          {activePage === "reports"    && allowedPages.includes("reports")    && <Reports {...sharedProps} />}
          {activePage === "users"      && allowedPages.includes("users")      && <Users {...sharedProps} />}
        </div>
      </main>

      {/* Toast */}
      {toast && <Toast message={toast.message} type={toast.type} />}

      {/* Ekrandagi klaviatura (POS uslubida) */}
      <VirtualKeyboard />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <KeyboardProvider>
          <AppContent />
        </KeyboardProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
