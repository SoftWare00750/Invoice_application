import { useState, useEffect, useRef } from "react";
import { lightTheme, darkTheme, SAMPLE_INVOICES } from "./constants";
import { generateId, addDays, PAYMENT_TERMS } from "./utils";
import InvoiceList from "./components/InvoiceList";
import InvoiceDetail from "./components/InvoiceDetail";
import InvoiceForm from "./components/InvoiceForm";
import DeleteModal from "./components/DeleteModal";

/* ── Logo SVG ───────────────────────────────────────────────────────────────── */
function LogoMark() {
  return (
    <div className="relative flex items-center justify-center w-10 h-10">
      <svg viewBox="0 0 40 40" width="40" height="40" fill="none">
        <rect width="40" height="40" rx="12" fill="#7C5DFA"/>
        <path d="M20 8L27.5 20L20 26L12.5 20L20 8Z" fill="white" opacity="0.9"/>
        <path d="M20 26L27.5 20L20 32L12.5 20L20 26Z" fill="white" opacity="0.5"/>
      </svg>
    </div>
  );
}

/* ── Moon Icon ──────────────────────────────────────────────────────────────── */
function MoonIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M18.9 13.1a8 8 0 01-11-11 8 8 0 1011 11z"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}

function SunIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <circle cx="11" cy="11" r="5" stroke="currentColor" strokeWidth="2"/>
      <path d="M11 1v2M11 19v2M1 11h2M19 11h2M3.22 3.22l1.42 1.42M17.36 17.36l1.42 1.42M3.22 18.78l1.42-1.42M17.36 4.64l1.42-1.42"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}

/* ── Avatar ──────────────────────────────────────────────────────────────────── */
function Avatar() {
  return (
    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#7C5DFA] to-[#9277FF]
                    flex items-center justify-center text-white font-bold text-sm border-2 border-[#7C5DFA]">
      U
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────── */
export default function App() {
  const rootRef = useRef(null);

  const [dark, setDark] = useState(() => {
    try { return localStorage.getItem("invoice_theme") === "dark"; } catch { return false; }
  });

  const [invoices, setInvoices] = useState(() => {
    try {
      const saved = localStorage.getItem("invoice_data");
      return saved ? JSON.parse(saved) : SAMPLE_INVOICES;
    } catch { return SAMPLE_INVOICES; }
  });

  const [view, setView]               = useState("list");
  const [selectedId, setSelectedId]   = useState(null);
  const [formOpen, setFormOpen]       = useState(false);
  const [editingInvoice, setEditingInvoice] = useState(null);
  const [showDelete, setShowDelete]   = useState(false);
  const [filter, setFilter]           = useState([]);

  /* persist to localStorage */
  useEffect(() => {
    try { localStorage.setItem("invoice_data", JSON.stringify(invoices)); } catch {}
  }, [invoices]);

  useEffect(() => {
    try { localStorage.setItem("invoice_theme", dark ? "dark" : "light"); } catch {}
  }, [dark]);

  /* apply CSS vars */
  const theme = dark ? darkTheme : lightTheme;
  useEffect(() => {
    if (!rootRef.current) return;
    Object.entries(theme).forEach(([k, v]) => rootRef.current.style.setProperty(k, v));
  }, [dark]);

  const selectedInvoice = invoices.find((i) => i.id === selectedId);

  /* handlers */
  const handleCreate = (data) => {
    setInvoices((prev) => [{ ...data, id: generateId(), status: "pending" }, ...prev]);
    setFormOpen(false);
  };
  const handleDraft = (data) => {
    setInvoices((prev) => [{ ...data, id: generateId(), status: "draft" }, ...prev]);
    setFormOpen(false);
  };
  const handleUpdate = (data) => {
    setInvoices((prev) =>
      prev.map((inv) => (inv.id === editingInvoice.id ? { ...inv, ...data } : inv))
    );
    setEditingInvoice(null);
    setFormOpen(false);
  };
  const handleDelete = () => {
    setInvoices((prev) => prev.filter((inv) => inv.id !== selectedId));
    setShowDelete(false);
    setView("list");
    setSelectedId(null);
  };
  const handleMarkPaid = () => {
    setInvoices((prev) =>
      prev.map((inv) => (inv.id === selectedId ? { ...inv, status: "paid" } : inv))
    );
  };

  /* CSS variable string for :root injection */
  const cssVars = Object.entries(theme).map(([k, v]) => `${k}:${v}`).join(";");

  return (
    <div
      ref={rootRef}
      className="app-layout min-h-screen"
      style={{ background: "var(--bg)", color: "var(--text-primary)", fontFamily: "'League Spartan', sans-serif" }}
    >
      {/* Global CSS vars + date picker fix */}
      <style>{`
        :root { ${cssVars} }
        input[type="date"]::-webkit-calendar-picker-indicator {
          filter: ${dark ? "invert(1)" : "none"};
          cursor: pointer;
        }
      `}</style>

      {/* ── DESKTOP SIDEBAR (≥1025px) ───────────────────────────────────────── */}
      <nav
        className="
          hidden lg:flex
          fixed left-0 top-0 h-screen w-24 z-[100]
          flex-col items-center
          rounded-r-[20px] overflow-hidden
        "
        style={{ background: "#373B53" }}
      >
        {/* Logo block */}
        <div
          className="w-full flex justify-center pt-7 pb-7 rounded-br-[20px] mb-1"
          style={{ background: "#7C5DFA" }}
        >
          <LogoMark />
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Theme toggle */}
        <button
          onClick={() => setDark((d) => !d)}
          className="p-4 mb-2 bg-transparent border-none cursor-pointer transition-colors duration-200"
          style={{ color: dark ? "#858BB2" : "#7E88C3" }}
          aria-label="Toggle theme"
        >
          {dark ? <SunIcon /> : <MoonIcon />}
        </button>

        {/* Divider */}
        <div className="w-full h-px mb-4" style={{ background: "#494E6E" }} />

        {/* Avatar */}
        <div className="mb-6">
          <Avatar />
        </div>
      </nav>

      {/* ── TABLET TOP NAV (≤1024px) ────────────────────────────────────────── */}
      <header
        className="
          flex lg:hidden
          w-full h-[72px] items-center
          sticky top-0 z-[100]
        "
        style={{ background: "#373B53" }}
      >
        {/* Logo block - rounded bottom-right only */}
        <div
          className="h-full w-[72px] flex items-center justify-center flex-shrink-0 rounded-br-[20px]"
          style={{ background: "#7C5DFA" }}
        >
          <LogoMark />
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Right controls */}
        <div className="flex items-center h-full">
          {/* Theme toggle */}
          <button
            onClick={() => setDark((d) => !d)}
            className="h-full px-6 bg-transparent border-none cursor-pointer flex items-center justify-center transition-colors duration-200"
            style={{ color: dark ? "#858BB2" : "#7E88C3" }}
            aria-label="Toggle theme"
          >
            {dark ? <SunIcon /> : <MoonIcon />}
          </button>

          {/* Vertical divider */}
          <div className="w-px h-full" style={{ background: "#494E6E" }} />

          {/* Avatar */}
          <div className="px-6 flex items-center justify-center h-full">
            <Avatar />
          </div>
        </div>
      </header>

      {/* ── MAIN CONTENT ────────────────────────────────────────────────────── */}
      <main className="lg:ml-24 flex-1 flex">
        {view === "list" && (
          <InvoiceList
            invoices={invoices}
            filter={filter}
            setFilter={setFilter}
            onNew={() => { setEditingInvoice(null); setFormOpen(true); }}
            onView={(id) => { setSelectedId(id); setView("detail"); }}
            dark={dark}
          />
        )}
        {view === "detail" && selectedInvoice && (
          <InvoiceDetail
            invoice={selectedInvoice}
            onBack={() => setView("list")}
            onEdit={() => { setEditingInvoice(selectedInvoice); setFormOpen(true); }}
            onDelete={() => setShowDelete(true)}
            onMarkPaid={handleMarkPaid}
            dark={dark}
          />
        )}
      </main>

      {/* ── FORM OVERLAY ────────────────────────────────────────────────────── */}
      {formOpen && (
        <>
          <div
            onClick={() => setFormOpen(false)}
            className="fixed inset-0 z-[150] fade-in"
            style={{ background: "var(--overlay)" }}
          />
          <InvoiceForm
            invoice={editingInvoice}
            onSave={editingInvoice ? handleUpdate : handleCreate}
            onDraft={handleDraft}
            onCancel={() => { setFormOpen(false); setEditingInvoice(null); }}
            dark={dark}
          />
        </>
      )}

      {/* ── DELETE MODAL ────────────────────────────────────────────────────── */}
      {showDelete && (
        <DeleteModal
          invoiceId={selectedId}
          onConfirm={handleDelete}
          onCancel={() => setShowDelete(false)}
        />
      )}
    </div>
  );
}
