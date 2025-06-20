export function getMarketPrices(yesVolume: number, noVolume: number) {
  const total = yesVolume + noVolume;

  if (total === 0) return { yesPrice: 0.5, noPrice: 0.5 };

  let yes = yesVolume / total;
  let no = noVolume / total;

  // Clamp prices between 0.01 and 0.99 to avoid extremes
  yes = Math.max(0.01, Math.min(yes, 0.99));
  no = Math.max(0.01, Math.min(no, 0.99));

  return {
    yesPrice: Number(yes.toFixed(2)),
    noPrice: Number(no.toFixed(2)),
  };
}
