export function formatCents(value: number): string {
  const cents = Math.round(value * 100);

  return `${cents}¢`;
}
