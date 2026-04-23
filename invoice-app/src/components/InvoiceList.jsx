import { useState } from "react";
import StatusBadge from "./StatusBadge";
import { EmptyIllustration } from "./Icons";
import { formatDate, addDays, calcTotal, PAYMENT_TERMS } from "../utils";

export default function InvoiceList({ invoices, filter, setFilter, onNew, onView, dark }) {
  const [filterOpen, setFilterOpen] = useState(false);
  const STATUS_OPTIONS = ["draft", "pending", "paid"];
  const filtered = filter.length === 0 ? invoices : invoices.filter((inv) => filter.includes(inv.status));

  return (
    <div style={{ flex: 1, padding: "48px 40px", maxWidth: 780, margin: "0 auto", width: "100%" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", marginBottom: 48 }}>
        <div>
          <h1 style={{ fontSize: 36, fontWeight: 700, color: "var(--text-primary)", margin: 0 }}>
            Invoices
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: 13, marginTop: 4 }}>
            {filtered.length === 0
              ? "No invoices"
              : `There are ${filtered.length} total invoice${filtered.length !== 1 ? "s" : ""}`}
          </p>
        </div>
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 24 }}>
          {/* Filter Dropdown */}
          <div style={{ position: "relative" }}>
            <button
              onClick={() => setFilterOpen(!filterOpen)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "var(--text-primary)",
                fontFamily: "inherit",
                fontWeight: 700,
                fontSize: 15,
              }}
            >
              Filter by status
              <svg width="11" height="7" viewBox="0 0 11 7" fill="none">
                <path d="M1 1L5.5 5.5L10 1" stroke="#7C5DFA" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
            {filterOpen && (
              <div
                style={{
                  position: "absolute",
                  top: "calc(100% + 12px)",
                  left: "50%",
                  transform: "translateX(-50%)",
                  background: "var(--bg-card)",
                  borderRadius: 12,
                  padding: "20px 24px",
                  boxShadow: "0 10px 40px rgba(72,84,159,0.25)",
                  zIndex: 10,
                  minWidth: 160,
                }}
              >
                {STATUS_OPTIONS.map((s) => (
                  <label
                    key={s}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      cursor: "pointer",
                      padding: "8px 0",
                      userSelect: "none",
                      fontWeight: 700,
                      fontSize: 13,
                      color: "var(--text-primary)",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={filter.includes(s)}
                      onChange={() =>
                        setFilter((prev) =>
                          prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
                        )
                      }
                      style={{ accentColor: "#7C5DFA", width: 16, height: 16, cursor: "pointer" }}
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
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              background: "#7C5DFA",
              color: "white",
              border: "none",
              borderRadius: 24,
              padding: "14px 14px",
              fontFamily: "inherit",
              fontWeight: 700,
              fontSize: 15,
              cursor: "pointer",
              transition: "background 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#9277FF")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#7C5DFA")}
          >
            <span
              style={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                background: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                <path d="M5.5 0V11M0 5.5H11" stroke="#7C5DFA" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </span>
            New Invoice
          </button>
        </div>
      </div>

      {/* Empty State */}
      {filtered.length === 0 && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            paddingTop: 80,
            gap: 24,
          }}
        >
          <EmptyIllustration />
          <h2 style={{ fontSize: 24, fontWeight: 700, color: "var(--text-primary)", margin: 0 }}>
            There is nothing here
          </h2>
          <p
            style={{
              color: "var(--text-secondary)",
              fontSize: 13,
              textAlign: "center",
              maxWidth: 220,
              lineHeight: 1.6,
              margin: 0,
            }}
          >
            Create an invoice by clicking the <strong>New Invoice</strong> button and get started
          </p>
        </div>
      )}

      {/* Invoice Cards */}
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {filtered.map((inv) => (
          <button
            key={inv.id}
            onClick={() => onView(inv.id)}
            style={{
              display: "grid",
              gridTemplateColumns: "100px 1fr 1fr 120px 120px 24px",
              alignItems: "center",
              gap: 16,
              background: "var(--bg-card)",
              border: "1px solid var(--border)",
              borderRadius: 12,
              padding: "20px 28px",
              cursor: "pointer",
              textAlign: "left",
              transition: "border-color 0.2s, transform 0.15s",
              width: "100%",
              fontFamily: "inherit",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#7C5DFA"; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border)"; }}
          >
            <span style={{ fontWeight: 700, fontSize: 13, color: "var(--text-primary)" }}>
              <span style={{ color: "var(--text-secondary)" }}>#</span>
              {inv.id}
            </span>
            <span style={{ fontSize: 12, color: "var(--text-secondary)" }}>
              Due{" "}
              {formatDate(
                inv.dueDate || addDays(inv.invoiceDate, PAYMENT_TERMS[inv.paymentTerms] || 30)
              )}
            </span>
            <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>{inv.clientName}</span>
            <span style={{ fontWeight: 700, fontSize: 16, color: "var(--text-primary)", textAlign: "right" }}>
              £{" "}
              {calcTotal(inv.items).toLocaleString("en-GB", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
            <StatusBadge status={inv.status} dark={dark} />
            <svg width="7" height="11" viewBox="0 0 7 11" fill="none">
              <path
                d="M1 1L6 5.5L1 10"
                stroke="#7C5DFA"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        ))}
      </div>
    </div>
  );
}
