export function getMarketPrices(yesVolume: number, noVolume: number) {
  const total = yesVolume + noVolume;
  const yesPrice = total > 0 ? (yesVolume / total) * 100 : 50;
  const noPrice = total > 0 ? (noVolume / total) * 100 : 50;
  return {
    yesPrice: Number(yesPrice.toFixed(1)), // e.g., 60.0
    noPrice: Number(noPrice.toFixed(1)), // e.g., 40.0
  };
}
