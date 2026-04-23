import { useRef, useEffect } from "react";

export default function DeleteModal({ invoiceId, onConfirm, onCancel }) {
  const ref = useRef(null);

  useEffect(() => {
    ref.current?.focus();
    const handler = (e) => e.key === "Escape" && onCancel();
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onCancel]);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "var(--overlay)",
        zIndex: 300,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      onClick={onCancel}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        ref={ref}
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "var(--bg-card)",
          borderRadius: 16,
          padding: "48px",
          maxWidth: 480,
          width: "90%",
          boxShadow: "0 10px 40px rgba(0,0,0,0.2)",
          outline: "none",
        }}
      >
        <h2
          id="modal-title"
          style={{ fontSize: 24, fontWeight: 700, color: "var(--text-primary)", marginBottom: 12 }}
        >
          Confirm Deletion
        </h2>
        <p style={{ color: "var(--text-secondary)", fontSize: 13, lineHeight: 1.6, marginBottom: 24 }}>
          Are you sure you want to delete invoice #{invoiceId}? This action cannot be undone.
        </p>
        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
          <button
            onClick={onCancel}
            style={{
              padding: "14px 24px",
              borderRadius: 24,
              border: "none",
              background: "#F9FAFE",
              color: "#7E88C3",
              fontFamily: "inherit",
              fontWeight: 700,
              fontSize: 13,
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
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
            }}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
