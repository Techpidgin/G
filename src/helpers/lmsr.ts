export function calculateLMSRPrice(
  yesShares: number,
  noShares: number,
  b: number
) {
  const expYes = Math.exp(yesShares / b);
  const expNo = Math.exp(noShares / b);
  const total = expYes + expNo;

  return {
    yesPrice: expYes / total,
    noPrice: expNo / total,
  };
}

// export function getLMSRCost(qYes: number, qNo: number, b: number) {
//   return b * Math.log(exp(qYes / b) + exp(qNo / b));
// }

export function getLMSRCost(
  outcome: "yes" | "no",
  yesShares: number,
  noShares: number,
  sharesToBuy: number,
  b: number
): number {
  const oldCost =
    b * Math.log(Math.exp(yesShares / b) + Math.exp(noShares / b));

  const newYes = outcome === "yes" ? yesShares + sharesToBuy : yesShares;
  const newNo = outcome === "no" ? noShares + sharesToBuy : noShares;

  const newCost = b * Math.log(Math.exp(newYes / b) + Math.exp(newNo / b));

  return newCost - oldCost; // amount user must pay
}

/**
 * Calculates cost to buy `deltaShares` of a given outcome ("yes" or "no").
 */
// export function getTradeCost(
//   outcome: "yes" | "no",
//   deltaShares: number,
//   market: {
//     yesShares: number;
//     noShares: number;
//     liquidityParam: number;
//   }
// ) {
//   const b = market.liquidityParam;

//   const qYesBefore = market.yesShares;
//   const qNoBefore = market.noShares;

//   const qYesAfter = outcome === "yes" ? qYesBefore + deltaShares : qYesBefore;
//   const qNoAfter = outcome === "no" ? qNoBefore + deltaShares : qNoBefore;

//   const costBefore = getLMSRCost(qYesBefore, qNoBefore, b);
//   const costAfter = getLMSRCost(qYesAfter, qNoAfter, b);

//   return Number((costAfter - costBefore).toFixed(4));
// }
