import { useState } from "react";
import StatusBadge from "./StatusBadge";
import { formatDate, addDays, calcTotal, PAYMENT_TERMS } from "../utils";

function EmptyIllustration() {
  return (
    <svg width="200" height="160" viewBox="0 0 242 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="121" cy="175" rx="80" ry="12" fill="#DFE3FA" opacity="0.3"/>
      <rect x="60" y="60" width="122" height="100" rx="8" fill="#DFE3FA" opacity="0.4"/>
      <rect x="72" y="48" width="98" height="80" rx="8" fill="#DFE3FA" opacity="0.6"/>
      <rect x="84" y="36" width="74" height="60" rx="8" fill="#7C5DFA" opacity="0.15"/>
      <rect x="92" y="44" width="58" height="6" rx="3" fill="#7C5DFA" opacity="0.4"/>
      <rect x="92" y="56" width="40" height="4" rx="2" fill="#DFE3FA"/>
      <rect x="92" y="66" width="50" height="4" rx="2" fill="#DFE3FA"/>
      <circle cx="175" cy="55" r="20" fill="#7C5DFA" opacity="0.15"/>
      <path d="M175 47v16M167 55h16" stroke="#7C5DFA" strokeWidth="2.5" strokeLinecap="round"/>
      <circle cx="60" cy="120" r="12" fill="#33D69F" opacity="0.15"/>
      <path d="M55 120l3 3 7-7" stroke="#33D69F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export default function InvoiceList({ invoices, filter, setFilter, onNew, onView, dark }) {
  const [filterOpen, setFilterOpen] = useState(false);
  const STATUS_OPTIONS = ["draft", "pending", "paid"];
  const filtered = filter.length === 0 ? invoices : invoices.filter((inv) => filter.includes(inv.status));

  const cardBg = dark ? "#1E2139" : "#FFFFFF";
  const cardBorder = dark ? "#252945" : "#FFFFFF";
  const textPrimary = dark ? "#FFFFFF" : "#0C0E16";
  const textSecondary = dark ? "#DFE3FA" : "#7E88C3";
  const dropdownBg = dark ? "#252945" : "#FFFFFF";

  return (
    <div className="flex-1 flex flex-col">
      <div className="w-full max-w-3xl mx-auto px-6 md:px-10 lg:px-10 py-8 md:py-12 lg:py-16">

        {/* ── Header ── */}
        <div className="flex items-center mb-10 md:mb-14">
          <div>
            <h1
              className="text-3xl md:text-4xl font-bold"
              style={{ color: textPrimary }}
            >
              Invoices
            </h1>
            <p className="text-xs md:text-sm mt-1" style={{ color: textSecondary }}>
              {filtered.length === 0
                ? "No invoices"
                : `There are ${filtered.length} total invoice${filtered.length !== 1 ? "s" : ""}`}
            </p>
          </div>

          <div className="ml-auto flex items-center gap-4 md:gap-6">
            {/* Filter */}
            <div className="relative">
              <button
                onClick={() => setFilterOpen(!filterOpen)}
                className="flex items-center gap-2 md:gap-3 font-bold text-sm md:text-base"
                style={{ background: "none", border: "none", cursor: "pointer", color: textPrimary }}
              >
                <span className="hidden md:inline">Filter by status</span>
                <span className="md:hidden">Filter</span>
                <svg width="11" height="7" viewBox="0 0 11 7" fill="none">
                  <path d="M1 1L5.5 5.5L10 1" stroke="#7C5DFA" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </button>

              {filterOpen && (
                <div
                  className="absolute top-full mt-3 left-1/2 -translate-x-1/2 rounded-xl p-5 z-20 min-w-40 shadow-xl fade-in"
                  style={{ background: dropdownBg }}
                >
                  {STATUS_OPTIONS.map((s) => (
                    <label
                      key={s}
                      className="flex items-center gap-3 py-2 cursor-pointer font-bold text-sm select-none"
                      style={{ color: textPrimary }}
                    >
                      <input
                        type="checkbox"
                        checked={filter.includes(s)}
                        onChange={() =>
                          setFilter((prev) =>
                            prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
                          )
                        }
                        className="w-4 h-4 cursor-pointer rounded"
                        style={{ accentColor: "#7C5DFA" }}
                      />
                      {s.charAt(0).toUpperCase() + s.slice(1)}
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* New Invoice Button */}
            <button
              onClick={onNew}
              className="flex items-center gap-2 md:gap-3 text-white font-bold text-sm md:text-base rounded-3xl px-3 md:px-4 py-2 md:py-3 transition-colors"
              style={{ background: "#7C5DFA" }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#9277FF")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "#7C5DFA")}
            >
              <span
                className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-white flex items-center justify-center flex-shrink-0"
              >
                <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                  <path d="M5.5 0V11M0 5.5H11" stroke="#7C5DFA" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </span>
              <span className="hidden md:inline">New Invoice</span>
              <span className="md:hidden">New</span>
            </button>
          </div>
        </div>

        {/* ── Empty State ── */}
        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center pt-16 gap-6">
            <EmptyIllustration />
            <h2 className="text-xl md:text-2xl font-bold" style={{ color: textPrimary }}>
              There is nothing here
            </h2>
            <p className="text-sm text-center max-w-56 leading-relaxed" style={{ color: textSecondary }}>
              Create a new invoice by clicking the{" "}
              <strong style={{ color: textPrimary }}>New Invoice</strong> button and get started
            </p>
          </div>
        )}

        {/* ── Invoice Cards ── */}
        <div className="flex flex-col gap-3 md:gap-4">
          {filtered.map((inv) => (
            <InvoiceCard
              key={inv.id}
              inv={inv}
              onView={onView}
              dark={dark}
              cardBg={cardBg}
              cardBorder={cardBorder}
              textPrimary={textPrimary}
              textSecondary={textSecondary}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function InvoiceCard({ inv, onView, dark, cardBg, cardBorder, textPrimary, textSecondary }) {
  const [hovered, setHovered] = useState(false);
  const total = calcTotal(inv.items);
  const dueDate = inv.dueDate || addDays(inv.invoiceDate, PAYMENT_TERMS[inv.paymentTerms] || 30);

  return (
    <button
      onClick={() => onView(inv.id)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="w-full text-left rounded-xl transition-all font-spartan"
      style={{
        background: cardBg,
        border: `1px solid ${hovered ? "#7C5DFA" : cardBorder}`,
        cursor: "pointer",
        padding: "0",
      }}
    >
      {/* ── Mobile Layout (< md) ── */}
      <div className="md:hidden p-6">
        <div className="flex items-start justify-between mb-6">
          <span className="font-bold text-sm" style={{ color: textPrimary }}>
            <span style={{ color: textSecondary }}>#</span>{inv.id}
          </span>
          <span className="text-sm" style={{ color: textSecondary }}>{inv.clientName}</span>
        </div>
        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs mb-2" style={{ color: textSecondary }}>
              Due {formatDate(dueDate)}
            </p>
            <p className="font-bold text-base" style={{ color: textPrimary }}>
              £ {total.toLocaleString("en-GB", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>
          <StatusBadge status={inv.status} dark={dark} />
        </div>
      </div>

      {/* ── Tablet+ Layout (md+) ── */}
      <div className="hidden md:grid items-center gap-4 px-7 py-5" style={{ gridTemplateColumns: "100px 1fr 1fr 120px 120px 24px" }}>
        <span className="font-bold text-sm" style={{ color: textPrimary }}>
          <span style={{ color: textSecondary }}>#</span>{inv.id}
        </span>
        <span className="text-xs" style={{ color: textSecondary }}>Due {formatDate(dueDate)}</span>
        <span className="text-sm" style={{ color: textSecondary }}>{inv.clientName}</span>
        <span className="font-bold text-base text-right" style={{ color: textPrimary }}>
          £ {total.toLocaleString("en-GB", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </span>
        <StatusBadge status={inv.status} dark={dark} />
        <svg width="7" height="11" viewBox="0 0 7 11" fill="none">
          <path d="M1 1L6 5.5L1 10" stroke="#7C5DFA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
    </button>
  );
}