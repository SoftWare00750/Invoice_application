import { STATUS_STYLES, STATUS_STYLES_DARK } from "../constants";

export default function StatusBadge({ status, dark }) {
  const styles = dark ? STATUS_STYLES_DARK[status] : STATUS_STYLES[status];
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        background: styles.bg,
        color: styles.color,
        padding: "8px 18px",
        borderRadius: 24,
        fontWeight: 700,
        fontSize: 12,
        letterSpacing: 0.25,
        minWidth: 104,
        justifyContent: "center",
      }}
    >
      <span
        style={{
          width: 8,
          height: 8,
          borderRadius: "50%",
          background: styles.dot,
          flexShrink: 0,
        }}
      />
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}
