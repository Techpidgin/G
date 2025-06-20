const exp = Math.exp;

export function getPricesLMSR(qYes: number, qNo: number, b: number) {
  const expYes = exp(qYes / b);
  const expNo = exp(qNo / b);
  const sum = expYes + expNo;

  const pYes = expYes / sum;
  const pNo = expNo / sum;

  return {
    pYes: Number(pYes.toFixed(4)),
    pNo: Number(pNo.toFixed(4)),
  };
}

export function getLMSRCost(qYes: number, qNo: number, b: number) {
  return b * Math.log(exp(qYes / b) + exp(qNo / b));
}

/**
 * Calculates cost to buy `deltaShares` of a given outcome ("yes" or "no").
 */
export function getTradeCost(
  outcome: "yes" | "no",
  deltaShares: number,
  market: {
    yesShares: number;
    noShares: number;
    liquidityParam: number;
  }
) {
  const b = market.liquidityParam;

  const qYesBefore = market.yesShares;
  const qNoBefore = market.noShares;

  const qYesAfter = outcome === "yes" ? qYesBefore + deltaShares : qYesBefore;
  const qNoAfter = outcome === "no" ? qNoBefore + deltaShares : qNoBefore;

  const costBefore = getLMSRCost(qYesBefore, qNoBefore, b);
  const costAfter = getLMSRCost(qYesAfter, qNoAfter, b);

  return Number((costAfter - costBefore).toFixed(4));
}
