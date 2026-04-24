import { useState } from "react";
import StatusBadge from "./StatusBadge";
import { formatDate, addDays, calcTotal, PAYMENT_TERMS } from "../utils";

function EmptyIllustration() {
  return (
    <svg viewBox="0 0 160 160" width="200" height="200" fill="none">
      <ellipse cx="80" cy="150" rx="60" ry="6" fill="#DFE3FA" opacity="0.4"/>
      {/* Envelope body */}
      <rect x="20" y="60" width="120" height="80" rx="8" fill="#7C5DFA" opacity="0.15"/>
      <rect x="20" y="60" width="120" height="80" rx="8" stroke="#7C5DFA" strokeWidth="2"/>
      {/* Envelope flap */}
      <path d="M20 60L80 105L140 60" stroke="#7C5DFA" strokeWidth="2" fill="none"/>
      {/* Paper airplanes */}
      <path d="M130 45L145 30L135 50L130 45Z" fill="#9277FF" opacity="0.7"/>
      <path d="M135 30L155 22L140 42L135 30Z" stroke="#9277FF" strokeWidth="1.5" fill="none"/>
      {/* Envelope decoration lines */}
      <line x1="45" y1="90" x2="95" y2="90" stroke="#7C5DFA" strokeWidth="2" opacity="0.4" strokeLinecap="round"/>
      <line x1="45" y1="103" x2="80" y2="103" stroke="#7C5DFA" strokeWidth="2" opacity="0.4" strokeLinecap="round"/>
      {/* Small dots */}
      <circle cx="25" cy="45" r="3" fill="#9277FF" opacity="0.5"/>
      <circle cx="140" cy="55" r="2" fill="#7C5DFA" opacity="0.4"/>
      <circle cx="15" cy="75" r="2" fill="#9277FF" opacity="0.3"/>
    </svg>
  );
}

export default function InvoiceList({ invoices, filter, setFilter, onNew, onView, dark }) {
  const [filterOpen, setFilterOpen] = useState(false);
  const STATUS_OPTIONS = ["draft", "pending", "paid"];
  const filtered = filter.length === 0 ? invoices : invoices.filter((inv) => filter.includes(inv.status));

  return (
    <div className="flex-1 w-full">
      {/* Content wrapper — centered with max-width, responsive padding */}
      <div className="mx-auto w-full max-w-[780px] px-6 md:px-10 py-8 md:py-12">

        {/* ── Header ─────────────────────────────────────────────────────── */}
        <div className="flex items-center mb-10 md:mb-12">
          <div>
            <h1
              className="text-3xl md:text-4xl font-bold"
              style={{ color: "var(--text-primary)" }}
            >
              Invoices
            </h1>
            <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
              {filtered.length === 0
                ? "No invoices"
                : `There are ${filtered.length} total invoice${filtered.length !== 1 ? "s" : ""}`}
            </p>
          </div>

          <div className="ml-auto flex items-center gap-4 md:gap-6">
            {/* Filter dropdown */}
            <div className="relative">
              <button
                onClick={() => setFilterOpen(!filterOpen)}
                className="flex items-center gap-2 md:gap-3 bg-transparent border-none cursor-pointer font-bold text-sm md:text-base"
                style={{ color: "var(--text-primary)", fontFamily: "inherit" }}
              >
                <span className="hidden sm:inline">Filter by status</span>
                <span className="sm:hidden">Filter</span>
                <svg width="11" height="7" viewBox="0 0 11 7" fill="none">
                  <path d="M1 1L5.5 5.5L10 1" stroke="#7C5DFA" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </button>

              {filterOpen && (
                <div
                  className="absolute top-[calc(100%+12px)] left-1/2 -translate-x-1/2 rounded-xl z-10 min-w-[160px] fade-in"
                  style={{
                    background: "var(--bg-card)",
                    boxShadow: "0 10px 40px rgba(72,84,159,0.25)",
                    padding: "20px 24px",
                  }}
                >
                  {STATUS_OPTIONS.map((s) => (
                    <label
                      key={s}
                      className="flex items-center gap-3 cursor-pointer py-2 select-none font-bold text-sm"
                      style={{ color: "var(--text-primary)" }}
                    >
                      <input
                        type="checkbox"
                        checked={filter.includes(s)}
                        onChange={() =>
                          setFilter((prev) =>
                            prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
                          )
                        }
                        className="w-4 h-4 cursor-pointer accent-[#7C5DFA]"
                      />
                      {s.charAt(0).toUpperCase() + s.slice(1)}
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* New Invoice button */}
            <button
              onClick={onNew}
              className="flex items-center gap-2 md:gap-3 rounded-3xl px-3.5 py-3 font-bold text-sm md:text-base text-white border-none cursor-pointer transition-colors duration-200"
              style={{ background: "#7C5DFA", fontFamily: "inherit" }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#9277FF")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "#7C5DFA")}
            >
              <span
                className="w-8 h-8 rounded-full bg-white flex items-center justify-center flex-shrink-0"
              >
                <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                  <path d="M5.5 0V11M0 5.5H11" stroke="#7C5DFA" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </span>
              New Invoice
            </button>
          </div>
        </div>

        {/* ── Empty State ─────────────────────────────────────────────────── */}
        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center pt-20 gap-6">
            <EmptyIllustration />
            <h2 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>
              There is nothing here
            </h2>
            <p
              className="text-sm text-center max-w-[220px] leading-relaxed"
              style={{ color: "var(--text-secondary)" }}
            >
              Create a new invoice by clicking the{" "}
              <strong>New Invoice</strong> button and get started
            </p>
          </div>
        )}

        {/* ── Invoice Cards ───────────────────────────────────────────────── */}
        <div className="flex flex-col gap-3.5">
          {filtered.map((inv) => (
            <InvoiceCard
              key={inv.id}
              inv={inv}
              onView={onView}
              dark={dark}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Invoice Card — responsive layout ─────────────────────────────────────── */
function InvoiceCard({ inv, onView, dark }) {
  const total = calcTotal(inv.items);
  const dueDate = inv.dueDate || addDays(inv.invoiceDate, PAYMENT_TERMS[inv.paymentTerms] || 30);

  return (
    <button
      onClick={() => onView(inv.id)}
      className="
        w-full text-left rounded-xl cursor-pointer
        border transition-all duration-200
        px-6 py-5
        /* Desktop: single-row grid */
        hidden md:grid
      "
      style={{
        gridTemplateColumns: "100px 1fr 1fr 120px 120px 24px",
        alignItems: "center",
        gap: 16,
        background: "var(--bg-card)",
        borderColor: "var(--border)",
        fontFamily: "inherit",
      }}
      onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#7C5DFA"; }}
      onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border)"; }}
    >
      <InvoiceCardContent inv={inv} dueDate={dueDate} total={total} dark={dark} layout="desktop" />
    </button>
  );
}

/* Tablet card — two rows */
function InvoiceCard({ inv, onView, dark }) {
  const total = calcTotal(inv.items);
  const dueDate = inv.dueDate || addDays(inv.invoiceDate, PAYMENT_TERMS[inv.paymentTerms] || 30);

  return (
    <>
      {/* ── Tablet & Mobile card ───────────────────────────────────────── */}
      <button
        onClick={() => onView(inv.id)}
        className="
          md:hidden
          w-full text-left rounded-xl cursor-pointer border
          transition-all duration-200 px-6 py-5
          flex flex-col gap-4
        "
        style={{
          background: "var(--bg-card)",
          borderColor: "var(--border)",
          fontFamily: "inherit",
        }}
        onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#7C5DFA"; }}
        onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border)"; }}
      >
        {/* Row 1: ID + client name */}
        <div className="flex items-center justify-between">
          <span className="font-bold text-sm" style={{ color: "var(--text-primary)" }}>
            <span style={{ color: "var(--text-secondary)" }}>#</span>{inv.id}
          </span>
          <span className="text-sm" style={{ color: "var(--text-secondary)" }}>{inv.clientName}</span>
        </div>
        {/* Row 2: due date + amount + status */}
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <span className="text-xs" style={{ color: "var(--text-secondary)" }}>
              Due {formatDate(dueDate)}
            </span>
            <span className="font-bold text-base" style={{ color: "var(--text-primary)" }}>
              £ {total.toLocaleString("en-GB", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
          <StatusBadge status={inv.status} dark={dark} />
        </div>
      </button>

      {/* ── Desktop card ──────────────────────────────────────────────── */}
      <button
        onClick={() => onView(inv.id)}
        className="
          hidden md:grid
          w-full text-left rounded-xl cursor-pointer border
          transition-all duration-200 px-6 py-5
        "
        style={{
          gridTemplateColumns: "100px 1fr 1fr 120px 120px 24px",
          alignItems: "center",
          gap: 16,
          background: "var(--bg-card)",
          borderColor: "var(--border)",
          fontFamily: "inherit",
        }}
        onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#7C5DFA"; }}
        onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border)"; }}
      >
        <span className="font-bold text-sm" style={{ color: "var(--text-primary)" }}>
          <span style={{ color: "var(--text-secondary)" }}>#</span>{inv.id}
        </span>
        <span className="text-xs" style={{ color: "var(--text-secondary)" }}>
          Due {formatDate(dueDate)}
        </span>
        <span className="text-sm" style={{ color: "var(--text-secondary)" }}>
          {inv.clientName}
        </span>
        <span className="font-bold text-base text-right" style={{ color: "var(--text-primary)" }}>
          £ {total.toLocaleString("en-GB", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </span>
        <StatusBadge status={inv.status} dark={dark} />
        <svg width="7" height="11" viewBox="0 0 7 11" fill="none">
          <path d="M1 1L6 5.5L1 10" stroke="#7C5DFA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
    </>
  );
}
