import { useState } from "react";
import { Field, Input, Select } from "./FormFields";
import { addDays, PAYMENT_TERMS } from "../utils";

export default function InvoiceForm({ invoice, onSave, onDraft, onCancel, dark }) {
  const isEdit = !!invoice;
  const blank = { street: "", city: "", postCode: "", country: "" };

  const [form, setForm] = useState({
    billFrom: invoice?.billFrom || { ...blank },
    billTo: invoice?.billTo || { ...blank },
    clientName: invoice?.clientName || "",
    clientEmail: invoice?.clientEmail || "",
    invoiceDate: invoice?.invoiceDate || new Date().toISOString().split("T")[0],
    paymentTerms: invoice?.paymentTerms || "Net 30 Days",
    description: invoice?.description || "",
    items: invoice?.items?.map((i) => ({ ...i })) || [{ name: "", qty: 1, price: 0 }],
  });

  const [errors, setErrors] = useState({});

  const set = (path, value) => {
    setForm((prev) => {
      const parts = path.split(".");
      if (parts.length === 1) return { ...prev, [path]: value };
      if (parts.length === 2)
        return { ...prev, [parts[0]]: { ...prev[parts[0]], [parts[1]]: value } };
      return prev;
    });
  };

  const setItem = (idx, field, value) => {
    setForm((prev) => {
      const items = prev.items.map((it, i) => (i === idx ? { ...it, [field]: value } : it));
      return { ...prev, items };
    });
  };

  const addItem = () =>
    setForm((prev) => ({ ...prev, items: [...prev.items, { name: "", qty: 1, price: 0 }] }));

  const removeItem = (idx) =>
    setForm((prev) => ({ ...prev, items: prev.items.filter((_, i) => i !== idx) }));

  const validate = (draft = false) => {
    const e = {};
    if (draft) return e;
    if (!form.clientName.trim()) e.clientName = "can't be empty";
    if (!form.clientEmail.trim()) e.clientEmail = "can't be empty";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.clientEmail)) e.clientEmail = "invalid email";
    if (!form.billFrom.street.trim()) e.fromStreet = "can't be empty";
    if (!form.billTo.street.trim()) e.toStreet = "can't be empty";
    if (!form.description.trim()) e.description = "can't be empty";
    if (form.items.length === 0) e.items = "add at least one item";
    form.items.forEach((it, i) => {
      if (!it.name.trim()) e[`item_name_${i}`] = "can't be empty";
      if (!it.qty || it.qty <= 0) e[`item_qty_${i}`] = "invalid";
      if (!it.price || it.price < 0) e[`item_price_${i}`] = "invalid";
    });
    return e;
  };

  const handleSave = (asDraft = false) => {
    const e = validate(asDraft);
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    const dueDate = addDays(form.invoiceDate, PAYMENT_TERMS[form.paymentTerms] || 30);
    const data = {
      ...form,
      dueDate,
      status: asDraft ? "draft" : invoice?.status === "paid" ? "paid" : "pending",
    };
    if (asDraft) onDraft(data);
    else onSave(data);
  };

  const inputStyle = { fontFamily: "inherit" };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 96,
        width: "min(616px, calc(100vw - 96px))",
        height: "100vh",
        background: "var(--bg-form)",
        zIndex: 200,
        display: "flex",
        flexDirection: "column",
        boxShadow: "10px 0 60px rgba(0,0,0,0.3)",
        borderRadius: "0 20px 20px 0",
        animation: "slideIn 0.3s ease",
      }}
    >
      <style>{`@keyframes slideIn { from { transform: translateX(-100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }`}</style>

      <div style={{ padding: "48px 48px 0", overflowY: "auto", flex: 1 }}>
        <h2 style={{ fontSize: 24, fontWeight: 700, color: "var(--text-primary)", marginBottom: 44 }}>
          {isEdit ? (
            <>
              <span style={{ color: "var(--text-muted)" }}>#</span>
              {invoice.id}
            </>
          ) : (
            "New Invoice"
          )}
        </h2>

        {/* Bill From */}
        <p style={{ fontSize: 12, fontWeight: 700, color: "#7C5DFA", marginBottom: 20 }}>Bill From</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 20, marginBottom: 40 }}>
          <Field label="Street Address" error={errors.fromStreet}>
            <Input
              value={form.billFrom.street}
              onChange={(e) => set("billFrom.street", e.target.value)}
              error={errors.fromStreet}
              style={inputStyle}
            />
          </Field>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
            <Field label="City">
              <Input value={form.billFrom.city} onChange={(e) => set("billFrom.city", e.target.value)} style={inputStyle} />
            </Field>
            <Field label="Post Code">
              <Input value={form.billFrom.postCode} onChange={(e) => set("billFrom.postCode", e.target.value)} style={inputStyle} />
            </Field>
            <Field label="Country">
              <Input value={form.billFrom.country} onChange={(e) => set("billFrom.country", e.target.value)} style={inputStyle} />
            </Field>
          </div>
        </div>

        {/* Bill To */}
        <p style={{ fontSize: 12, fontWeight: 700, color: "#7C5DFA", marginBottom: 20 }}>Bill To</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 20, marginBottom: 40 }}>
          <Field label="Client's Name" error={errors.clientName}>
            <Input
              value={form.clientName}
              onChange={(e) => set("clientName", e.target.value)}
              error={errors.clientName}
              style={inputStyle}
            />
          </Field>
          <Field label="Client's Email" error={errors.clientEmail}>
            <Input
              type="email"
              value={form.clientEmail}
              onChange={(e) => set("clientEmail", e.target.value)}
              error={errors.clientEmail}
              style={inputStyle}
            />
          </Field>
          <Field label="Street Address" error={errors.toStreet}>
            <Input
              value={form.billTo.street}
              onChange={(e) => set("billTo.street", e.target.value)}
              error={errors.toStreet}
              style={inputStyle}
            />
          </Field>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
            <Field label="City">
              <Input value={form.billTo.city} onChange={(e) => set("billTo.city", e.target.value)} style={inputStyle} />
            </Field>
            <Field label="Post Code">
              <Input value={form.billTo.postCode} onChange={(e) => set("billTo.postCode", e.target.value)} style={inputStyle} />
            </Field>
            <Field label="Country">
              <Input value={form.billTo.country} onChange={(e) => set("billTo.country", e.target.value)} style={inputStyle} />
            </Field>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <Field label="Invoice Date">
              <Input
                type="date"
                value={form.invoiceDate}
                onChange={(e) => set("invoiceDate", e.target.value)}
                disabled={isEdit}
                style={{ ...inputStyle, opacity: isEdit ? 0.6 : 1 }}
              />
            </Field>
            <Field label="Payment Terms">
              <Select value={form.paymentTerms} onChange={(e) => set("paymentTerms", e.target.value)}>
                {Object.keys(PAYMENT_TERMS).map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </Select>
            </Field>
          </div>
          <Field label="Project Description" error={errors.description}>
            <Input
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              error={errors.description}
              style={inputStyle}
              placeholder="e.g. Graphic Design Service"
            />
          </Field>
        </div>

        {/* Item List */}
        <p style={{ fontSize: 18, fontWeight: 700, color: "#777F98", marginBottom: 20 }}>Item List</p>
        {errors.items && (
          <p style={{ color: "#EC5757", fontSize: 12, marginBottom: 12 }}>{errors.items}</p>
        )}
        <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 16 }}>
          {form.items.length > 0 && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 60px 100px 80px 24px", gap: 10 }}>
              {["Item Name", "Qty.", "Price", "Total", ""].map((h, i) => (
                <span key={i} style={{ fontSize: 12, color: "var(--text-secondary)", fontWeight: 500 }}>
                  {h}
                </span>
              ))}
            </div>
          )}
          {form.items.map((item, idx) => (
            <div
              key={idx}
              style={{ display: "grid", gridTemplateColumns: "1fr 60px 100px 80px 24px", gap: 10, alignItems: "center" }}
            >
              <Input
                value={item.name}
                onChange={(e) => setItem(idx, "name", e.target.value)}
                error={errors[`item_name_${idx}`]}
                style={inputStyle}
              />
              <Input
                type="number"
                value={item.qty}
                onChange={(e) => setItem(idx, "qty", e.target.value)}
                error={errors[`item_qty_${idx}`]}
                style={{ ...inputStyle, padding: "14px 8px", textAlign: "center" }}
              />
              <Input
                type="number"
                step="0.01"
                value={item.price}
                onChange={(e) => setItem(idx, "price", e.target.value)}
                error={errors[`item_price_${idx}`]}
                style={inputStyle}
              />
              <span style={{ color: "var(--text-secondary)", fontWeight: 700, fontSize: 13 }}>
                {(item.qty * item.price).toFixed(2)}
              </span>
              <button
                onClick={() => removeItem(idx)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: 0,
                  color: "#888EB0",
                  fontSize: 18,
                  display: "flex",
                  alignItems: "center",
                }}
                aria-label="Remove item"
              >
                <svg width="13" height="16" viewBox="0 0 13 16" fill="none">
                  <path
                    d="M11.583 3.556H8.944V2.25a1.25 1.25 0 00-1.25-1.25H5.306a1.25 1.25 0 00-1.25 1.25v1.306H1.417A.417.417 0 001 3.972v.417c0 .23.186.417.417.417h.277L2.625 14.1a1.25 1.25 0 001.25 1.15h5.25a1.25 1.25 0 001.25-1.15l.931-9.294h.277a.417.417 0 00.417-.417v-.417a.417.417 0 00-.417-.416zm-7.36-1.306a.139.139 0 01.139-.139h2.276a.139.139 0 01.139.14v1.305H4.222V2.25zm5.8 11.76a.139.139 0 01-.139.128H3.875a.139.139 0 01-.14-.128L2.83 4.806H10.17l-.946 9.204z"
                    fill="currentColor"
                  />
                </svg>
              </button>
            </div>
          ))}
        </div>
        <button
          onClick={addItem}
          style={{
            width: "100%",
            padding: "14px",
            borderRadius: 24,
            border: "none",
            background: dark ? "#252945" : "#F9FAFE",
            color: "var(--text-secondary)",
            fontFamily: "inherit",
            fontWeight: 700,
            fontSize: 13,
            cursor: "pointer",
            transition: "background 0.2s, color 0.2s",
            marginBottom: 48,
          }}
          onMouseEnter={(e) => { e.target.style.background = dark ? "#0C0E16" : "#DFE3FA"; }}
          onMouseLeave={(e) => { e.target.style.background = dark ? "#252945" : "#F9FAFE"; }}
        >
          + Add New Item
        </button>
      </div>

      {/* Footer Buttons */}
      <div
        style={{
          padding: "20px 48px",
          display: "flex",
          alignItems: "center",
          gap: 8,
          background: "var(--bg-form)",
          borderTop: "1px solid var(--border)",
          boxShadow: "0 -4px 24px rgba(0,0,0,0.06)",
        }}
      >
        <button
          onClick={onCancel}
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
            marginRight: "auto",
          }}
        >
          {isEdit ? "Cancel" : "Discard"}
        </button>
        {!isEdit && (
          <button
            onClick={() => handleSave(true)}
            style={{
              padding: "14px 24px",
              borderRadius: 24,
              border: "none",
              background: dark ? "#252945" : "#373B53",
              color: dark ? "#888EB0" : "#888EB0",
              fontFamily: "inherit",
              fontWeight: 700,
              fontSize: 13,
              cursor: "pointer",
            }}
          >
            Save as Draft
          </button>
        )}
        <button
          onClick={() => handleSave(false)}
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
          }}
        >
          {isEdit ? "Save Changes" : "Save & Send"}
        </button>
      </div>
    </div>
  );
}
