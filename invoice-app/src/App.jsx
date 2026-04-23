import { useState, useEffect } from "react";
import { lightTheme, darkTheme, SAMPLE_INVOICES } from "./constants";
import { generateId, addDays, PAYMENT_TERMS } from "./utils";
import { Logo } from "./components/Icons";
import InvoiceList from "./components/InvoiceList";
import InvoiceDetail from "./components/InvoiceDetail";
import InvoiceForm from "./components/InvoiceForm";
import DeleteModal from "./components/DeleteModal";

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

  const cssVars = Object.entries(theme).map(([k, v]) => `${k}:${v}`).join(";");

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: "var(--bg)",
        fontFamily: "'League Spartan', sans-serif",
        color: "var(--text-primary)",
        transition: "background 0.3s, color 0.3s",
      }}
      ref={(el) => {
        if (el) Object.entries(theme).forEach(([k, v]) => el.style.setProperty(k, v));
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=League+Spartan:wght@400;500;600;700;800&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        :root { ${cssVars} }
        body { overflow-x: hidden; }
        input[type="date"]::-webkit-calendar-picker-indicator {
          filter: ${dark ? "invert(1)" : "none"};
          cursor: pointer;
        }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: var(--border); border-radius: 3px; }
      `}</style>

      {/* Sidebar */}
      <nav
        style={{
          width: 96,
          background: "#373B53",
          position: "fixed",
          left: 0,
          top: 0,
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          zIndex: 100,
          borderRadius: "0 20px 20px 0",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: "100%",
            background: "#7C5DFA",
            paddingBottom: 28,
            display: "flex",
            justifyContent: "center",
            paddingTop: 28,
            borderRadius: "0 20px 20px 0",
            marginBottom: 4,
          }}
        >
          <Logo />
        </div>
        <div style={{ flex: 1 }} />
        <button
          onClick={() => setDark((d) => !d)}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 16,
            color: dark ? "#858BB2" : "#7E88C3",
            transition: "color 0.2s",
            marginBottom: 8,
          }}
          aria-label="Toggle theme"
        >
          {dark ? (
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <circle cx="11" cy="11" r="5" stroke="currentColor" strokeWidth="2" />
              <path
                d="M11 1v2M11 19v2M1 11h2M19 11h2M3.22 3.22l1.42 1.42M17.36 17.36l1.42 1.42M3.22 18.78l1.42-1.42M17.36 4.64l1.42-1.42"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path
                d="M18.9 13.1a8 8 0 01-11-11 8 8 0 1011 11z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          )}
        </button>
        <div style={{ width: "100%", height: 1, background: "#494E6E", marginBottom: 16 }} />
        <div style={{ marginBottom: 24 }}>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              border: "2px solid #7C5DFA",
              background: "linear-gradient(135deg, #7C5DFA, #9277FF)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontWeight: 700,
              fontSize: 14,
            }}
          >
            U
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main style={{ marginLeft: 96, flex: 1, display: "flex", minHeight: "100vh" }}>
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

      {/* Form Overlay */}
      {formOpen && (
        <>
          <div
            onClick={() => setFormOpen(false)}
            style={{ position: "fixed", inset: 0, background: "var(--overlay)", zIndex: 150 }}
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

      {/* Delete Modal */}
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
