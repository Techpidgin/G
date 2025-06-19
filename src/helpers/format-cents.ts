export function formatCents(value: number): string {
  // Ensure value is in cents (e.g., 0.635 * 100 = 63.5¢)
  const formatter = new Intl.NumberFormat("en-US", {
    style: "decimal",
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });

  return `${formatter.format(value)}¢`;
}
