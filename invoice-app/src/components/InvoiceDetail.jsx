import StatusBadge from "./StatusBadge";
import { formatDate, addDays, calcTotal, PAYMENT_TERMS } from "../utils";

export default function InvoiceDetail({ invoice, onBack, onEdit, onDelete, onMarkPaid, dark }) {
  const total = calcTotal(invoice.items);
  const dueDate =
    invoice.dueDate || addDays(invoice.invoiceDate, PAYMENT_TERMS[invoice.paymentTerms] || 30);

  return (
    <div style={{ flex: 1, padding: "48px 40px", maxWidth: 780, margin: "0 auto", width: "100%" }}>
      {/* Back Button */}
      <button
        onClick={onBack}
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
          marginBottom: 28,
          padding: 0,
        }}
      >
        <svg width="7" height="11" viewBox="0 0 7 11" fill="none">
          <path
            d="M6 1L1 5.5L6 10"
            stroke="#7C5DFA"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        Go back
      </button>

      {/* Action Bar */}
      <div
        style={{
          background: "var(--bg-card)",
          borderRadius: 12,
          padding: "20px 28px",
          display: "flex",
          alignItems: "center",
          gap: 16,
          marginBottom: 20,
        }}
      >
        <span style={{ color: "var(--text-secondary)", fontSize: 13 }}>Status</span>
        <StatusBadge status={invoice.status} dark={dark} />
        <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
          {invoice.status !== "paid" && (
            <button
              onClick={onEdit}
              style={{
                padding: "14px 24px",
                borderRadius: 24,
                border: "none",
                background: dark ? "#252945" : "#F9FAFE",
                color: dark ? "#DFE3FA" : "#7E88C3",
                fontFamily: "inherit",
                fontWeight: 700,
                fontSize: 13,
                cursor: "pointer",
              }}
            >
              Edit
            </button>
          )}
          <button
            onClick={onDelete}
            style={{
              padding: "14px 24px",
              borderRadius: 24,
              border: "none",
              background: "#EC5757",
              color: "white",
              fontFamily: "inherit",
              fontWeight: 700,
              fontSize: 13,
              cursor: "pointer",
              transition: "background 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#FF9797")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#EC5757")}
          >
            Delete
          </button>
          {invoice.status === "pending" && (
            <button
              onClick={onMarkPaid}
              style={{
                padding: "14px 24px",
                borderRadius: 24,
                border: "none",
                background: "#7C5DFA",
                color: "white",
                fontFamily: "inherit",
                fontWeight: 700,
                fontSize: 13,
                cursor: "pointer",
                transition: "background 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#9277FF")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "#7C5DFA")}
            >
              Mark as Paid
            </button>
          )}
        </div>
      </div>

      {/* Invoice Body */}
      <div style={{ background: "var(--bg-card)", borderRadius: 12, padding: "48px" }}>
        {/* Top Row */}
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 40 }}>
          <div>
            <p style={{ fontSize: 16, fontWeight: 700, color: "var(--text-primary)", margin: "0 0 6px" }}>
              <span style={{ color: "var(--text-secondary)" }}>#</span>
              {invoice.id}
            </p>
            <p style={{ fontSize: 13, color: "var(--text-secondary)", margin: 0 }}>
              {invoice.description}
            </p>
          </div>
          <div style={{ textAlign: "right", fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.8 }}>
            <p style={{ margin: 0 }}>{invoice.billFrom?.street}</p>
            <p style={{ margin: 0 }}>{invoice.billFrom?.city}</p>
            <p style={{ margin: 0 }}>{invoice.billFrom?.postCode}</p>
            <p style={{ margin: 0 }}>{invoice.billFrom?.country}</p>
          </div>
        </div>

        {/* Meta Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 40, marginBottom: 40 }}>
          <div>
            <p style={{ fontSize: 12, color: "var(--text-secondary)", marginBottom: 8 }}>Invoice Date</p>
            <p style={{ fontWeight: 700, fontSize: 15, color: "var(--text-primary)", margin: 0 }}>
              {formatDate(invoice.invoiceDate)}
            </p>
            <p style={{ fontSize: 12, color: "var(--text-secondary)", marginBottom: 8, marginTop: 28 }}>
              Payment Due
            </p>
            <p style={{ fontWeight: 700, fontSize: 15, color: "var(--text-primary)", margin: 0 }}>
              {formatDate(dueDate)}
            </p>
          </div>
          <div>
            <p style={{ fontSize: 12, color: "var(--text-secondary)", marginBottom: 8 }}>Bill To</p>
            <p style={{ fontWeight: 700, fontSize: 15, color: "var(--text-primary)", margin: "0 0 8px" }}>
              {invoice.clientName}
            </p>
            <div style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.8 }}>
              <p style={{ margin: 0 }}>{invoice.billTo?.street}</p>
              <p style={{ margin: 0 }}>{invoice.billTo?.city}</p>
              <p style={{ margin: 0 }}>{invoice.billTo?.postCode}</p>
              <p style={{ margin: 0 }}>{invoice.billTo?.country}</p>
            </div>
          </div>
          <div>
            <p style={{ fontSize: 12, color: "var(--text-secondary)", marginBottom: 8 }}>Sent to</p>
            <p style={{ fontWeight: 700, fontSize: 15, color: "var(--text-primary)", margin: 0 }}>
              {invoice.clientEmail}
            </p>
          </div>
        </div>

        {/* Items Table */}
        <div
          style={{
            background: dark ? "#252945" : "#F9FAFE",
            borderRadius: "12px 12px 0 0",
            overflow: "hidden",
          }}
        >
          <div style={{ padding: "24px 32px" }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 80px 120px 100px",
                gap: 16,
                marginBottom: 20,
              }}
            >
              {["Item Name", "QTY.", "Price", "Total"].map((h, i) => (
                <span
                  key={i}
                  style={{
                    fontSize: 12,
                    color: "var(--text-secondary)",
                    textAlign: i > 0 ? "right" : "left",
                  }}
                >
                  {h}
                </span>
              ))}
            </div>
            {invoice.items.map((item, i) => (
              <div
                key={i}
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 80px 120px 100px",
                  gap: 16,
                  marginBottom: 16,
                }}
              >
                <span style={{ fontWeight: 700, fontSize: 13, color: "var(--text-primary)" }}>
                  {item.name}
                </span>
                <span style={{ fontSize: 13, color: "var(--text-secondary)", textAlign: "right" }}>
                  {item.qty}
                </span>
                <span style={{ fontSize: 13, color: "var(--text-secondary)", textAlign: "right" }}>
                  £ {parseFloat(item.price).toFixed(2)}
                </span>
                <span
                  style={{ fontWeight: 700, fontSize: 13, color: "var(--text-primary)", textAlign: "right" }}
                >
                  £ {(item.qty * item.price).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Amount Due */}
        <div
          style={{
            background: "var(--bg-total)",
            padding: "24px 32px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderRadius: "0 0 12px 12px",
          }}
        >
          <span style={{ fontSize: 13, color: "var(--text-on-total)", opacity: 0.8 }}>Amount Due</span>
          <span style={{ fontSize: 28, fontWeight: 700, color: "var(--text-on-total)" }}>
            £{" "}
            {total.toLocaleString("en-GB", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </span>
        </div>
      </div>
    </div>
  );
}
