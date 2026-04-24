export function Logo() {
  return (
    <img
      src="/logo.png"
      alt="Logo"
      style={{ width: 40, height: 40, objectFit: "contain" }}
    />
  );
}

export function EmptyIllustration() {
  return (
    <img
      src="/empty.png"
      alt="No invoices"
      style={{ width: 240, height: "auto", objectFit: "contain" }}
    />
  );
}
