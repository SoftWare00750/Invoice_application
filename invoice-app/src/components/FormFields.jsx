// ─── FIELD WRAPPER ────────────────────────────────────────────────────────────
export function Field({ label, error, children, style }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6, ...style }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <label
          style={{
            fontSize: 12,
            fontWeight: 500,
            color: error ? "#EC5757" : "var(--text-secondary)",
          }}
        >
          {label}
        </label>
        {error && (
          <span style={{ fontSize: 10, color: "#EC5757", fontWeight: 600 }}>
            {error}
          </span>
        )}
      </div>
      {children}
    </div>
  );
}

// ─── INPUT ────────────────────────────────────────────────────────────────────
export function Input({ error, ...props }) {
  return (
    <input
      {...props}
      style={{
        padding: "14px 16px",
        borderRadius: 8,
        border: `1px solid ${error ? "#EC5757" : "var(--input-border)"}`,
        background: "var(--bg-card)",
        color: "var(--text-primary)",
        fontSize: 13,
        fontWeight: 700,
        fontFamily: "inherit",
        outline: "none",
        width: "100%",
        boxSizing: "border-box",
        transition: "border-color 0.2s",
        ...props.style,
      }}
      onFocus={(e) => {
        e.target.style.borderColor = error ? "#EC5757" : "var(--input-focus)";
      }}
      onBlur={(e) => {
        e.target.style.borderColor = error ? "#EC5757" : "var(--input-border)";
      }}
    />
  );
}

// ─── SELECT ───────────────────────────────────────────────────────────────────
export function Select({ children, ...props }) {
  return (
    <select
      {...props}
      style={{
        padding: "14px 16px",
        borderRadius: 8,
        border: "1px solid var(--input-border)",
        background: "var(--bg-card)",
        color: "var(--text-primary)",
        fontSize: 13,
        fontWeight: 700,
        fontFamily: "inherit",
        outline: "none",
        width: "100%",
        appearance: "none",
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1L6 7L11 1' stroke='%237C5DFA' strokeWidth='2' fill='none'/%3E%3C/svg%3E")`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "calc(100% - 16px) center",
        cursor: "pointer",
        boxSizing: "border-box",
        ...props.style,
      }}
    >
      {children}
    </select>
  );
}
