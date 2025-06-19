"use server";

import { database } from "@/lib/database";

export async function placeTrade({
  userId,
  marketId,
  outcome, // "yes" or "no"
  amount,
  shares,
}: {
  userId: string;
  marketId: string;
  outcome: "yes" | "no";
  amount: number;
  shares: number;
}) {
  // 1. Create the trade
  await database.trade.create({
    data: {
      userId,
      marketId,
      amount,
      shares,
      type: outcome === "yes" ? "BUY" : "SELL",
      //   outcome,
    },
  });

  // 2. Increment market's yes/no volume
  if (outcome === "yes") {
    await database.market.update({
      where: { id: marketId },
      data: { yesVolume: { increment: amount } },
    });
  } else {
    await database.market.update({
      where: { id: marketId },
      data: { noVolume: { increment: amount } },
    });
  }
}
