export function formatINR(value: number) {
  if (value >= 10_000_000) {
    return `₹${(value / 10_000_000).toFixed(1)} Cr`;
  }

  if (value >= 100_000) {
    return `₹${(value / 100_000).toFixed(1)} L`;
  }

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}