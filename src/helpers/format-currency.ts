export function formatCurrency(value: number): string {
  // Ensure value is in cents (e.g., 0.635 * 100 = 63.5¢)
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
    currency: "USD",
  });

  return `${formatter.format(value)}`;
}
