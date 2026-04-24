import { useState, useEffect } from "react";
import { lightTheme, darkTheme, SAMPLE_INVOICES } from "./constants";
import { generateId, addDays, PAYMENT_TERMS } from "./utils";
import InvoiceList from "./components/InvoiceList";
import InvoiceDetail from "./components/InvoiceDetail";
import InvoiceForm from "./components/InvoiceForm";
import DeleteModal from "./components/DeleteModal";

function Logo() {
  return (
    <svg width="28" height="28" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="40" height="40" rx="12" fill="#7C5DFA"/>
      <path d="M20 7L27 20L20 33L13 20L20 7Z" fill="white" opacity="0.9"/>
      <path d="M20 33L27 20L20 26.5L13 20L20 33Z" fill="white" opacity="0.5"/>
    </svg>
  );
}

function MoonIcon({ dark }) {
  return dark ? (
    <svg width="20" height="20" viewBox="0 0 22 22" fill="none">
      <circle cx="11" cy="11" r="5" stroke="currentColor" strokeWidth="2"/>
      <path d="M11 1v2M11 19v2M1 11h2M19 11h2M3.22 3.22l1.42 1.42M17.36 17.36l1.42 1.42M3.22 18.78l1.42-1.42M17.36 4.64l1.42-1.42" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ) : (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
      <path d="M18.9 13.1a8 8 0 01-11-11 8 8 0 1011 11z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}

export default function App() {
  const [dark, setDark] = useState(() => {
    try { return localStorage.getItem("invoice_theme") === "dark"; } catch { return false; }
  });

  const [invoices, setInvoices] = useState(() => {
    try {
      const saved = localStorage.getItem("invoice_data");
      return saved ? JSON.parse(saved) : SAMPLE_INVOICES;
    } catch { return SAMPLE_INVOICES; }
  });

  const [view, setView] = useState("list");
  const [selectedId, setSelectedId] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState(null);
  const [showDelete, setShowDelete] = useState(false);
  const [filter, setFilter] = useState([]);

  useEffect(() => {
    try { localStorage.setItem("invoice_data", JSON.stringify(invoices)); } catch {}
  }, [invoices]);

  useEffect(() => {
    try { localStorage.setItem("invoice_theme", dark ? "dark" : "light"); } catch {}
  }, [dark]);

  const theme = dark ? darkTheme : lightTheme;
  const selectedInvoice = invoices.find((i) => i.id === selectedId);

  const handleCreate = (data) => {
    const id = generateId();
    setInvoices((prev) => [{ ...data, id, status: "pending" }, ...prev]);
    setFormOpen(false);
  };

  const handleDraft = (data) => {
    const id = generateId();
    setInvoices((prev) => [{ ...data, id, status: "draft" }, ...prev]);
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

  const bgColor = dark ? "#141625" : "#F8F8FB";
  const navBg = "#373B53";

  return (
    <div
      className={`min-h-screen font-spartan ${dark ? "dark" : ""}`}
      style={{ background: bgColor, color: dark ? "#FFFFFF" : "#0C0E16" }}
    >
      {/* ── Desktop Sidebar (lg+) ── */}
      <nav
        className="hidden lg:flex fixed left-0 top-0 h-screen w-24 flex-col items-center z-50"
        style={{ background: navBg, borderRadius: "0 20px 20px 0" }}
      >
        <div
          className="w-full flex justify-center py-7 mb-1"
          style={{ background: "#7C5DFA", borderRadius: "0 20px 20px 0" }}
        >
          <Logo />
        </div>
        <div className="flex-1" />
        <button
          onClick={() => setDark(d => !d)}
          className="p-4 mb-2 transition-colors"
          style={{ background: "none", border: "none", cursor: "pointer", color: dark ? "#858BB2" : "#7E88C3" }}
          aria-label="Toggle theme"
        >
          <MoonIcon dark={dark} />
        </button>
        <div className="w-full h-px mb-4" style={{ background: "#494E6E" }} />
        <div className="mb-6">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm border-2"
            style={{ background: "linear-gradient(135deg, #7C5DFA, #9277FF)", borderColor: "#7C5DFA" }}
          >
            U
          </div>
        </div>
      </nav>

      {/* ── Tablet / Mobile Top Nav (hidden on lg+) ── */}
      <nav
        className="lg:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between h-16 md:h-20"
        style={{ background: navBg }}
      >
        {/* Logo */}
        <div
          className="flex items-center justify-center h-full aspect-square"
          style={{ background: "#7C5DFA", borderRadius: "0 0 20px 0" }}
        >
          <Logo />
        </div>

        {/* Right: theme toggle + avatar */}
        <div className="flex items-center h-full">
          <button
            onClick={() => setDark(d => !d)}
            className="px-5 flex items-center justify-center h-full transition-colors"
            style={{ background: "none", border: "none", cursor: "pointer", color: dark ? "#858BB2" : "#7E88C3" }}
            aria-label="Toggle theme"
          >
            <MoonIcon dark={dark} />
          </button>
          <div className="h-full w-px" style={{ background: "#494E6E" }} />
          <div className="flex items-center justify-center px-5 h-full">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs border-2"
              style={{ background: "linear-gradient(135deg, #7C5DFA, #9277FF)", borderColor: "#7C5DFA" }}
            >
              U
            </div>
          </div>
        </div>
      </nav>

      {/* ── Main Content ── */}
      {/* lg: offset by sidebar width; mobile/tablet: offset by top nav height */}
      <main className="lg:ml-24 pt-16 md:pt-20 lg:pt-0 min-h-screen flex flex-col">
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

      {/* ── Form Overlay ── */}
      {formOpen && (
        <>
          <div
            onClick={() => setFormOpen(false)}
            className="fixed inset-0 z-40"
            style={{ background: "rgba(0,0,0,0.5)" }}
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

      {/* ── Delete Modal ── */}
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