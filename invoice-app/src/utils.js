// ─── UTILITIES ────────────────────────────────────────────────────────────────
export function generateId() {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const l1 = letters[Math.floor(Math.random() * 26)];
  const l2 = letters[Math.floor(Math.random() * 26)];
  const nums = String(Math.floor(Math.random() * 9000) + 1000);
  return `${l1}${l2}${nums}`;
}

export function formatDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

export function addDays(dateStr, days) {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + days);
  return d.toISOString().split("T")[0];
}

export const PAYMENT_TERMS = {
  "Net 1 Day": 1,
  "Net 7 Days": 7,
  "Net 14 Days": 14,
  "Net 30 Days": 30,
};

export function calcTotal(items) {
  return items.reduce(
    (sum, it) => sum + (parseFloat(it.qty) || 0) * (parseFloat(it.price) || 0),
    0
  );
}
