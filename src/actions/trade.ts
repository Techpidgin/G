"use server";

import { database } from "@/lib/database";
import { cookies } from "next/headers";
import privy from "@/lib/privy";
import * as z from "zod";
import { tradeSchema } from "@/schemas/trade";
import { calculateLMSRPrice } from "@/helpers/lmsr";

type TradeFormValues = z.infer<typeof tradeSchema>;

export async function placeTrade(values: TradeFormValues) {
  try {
    const cookieStore = await cookies();
    const authToken = cookieStore.get("privy-token")?.value;

    if (!authToken) {
      return {
        success: false,
        errors: "Unauthenticated User",
      };
    }
    const verifiedClaims = await privy.verifyAuthToken(authToken);

    let user = await database.user.findUnique({
      where: {
        privyId: verifiedClaims.userId,
      },
    });
    if (!user) {
      user = await database.user.create({
        data: {
          privyId: verifiedClaims.userId,
        },
      });
    }

    const result = tradeSchema.safeParse(values);

    if (!result.success) {
      return {
        success: false,
        errors: result.error.flatten().fieldErrors,
      };
    }
    const { marketId, shares, outcome } = result.data;

    const market = await database.market.findUnique({
      where: { id: marketId },
    });

    if (!market) {
      return {
        success: false,
        error: "Market does not exist",
      };
    }

    const { yesPrice, noPrice } = calculateLMSRPrice(
      market.yesShares,
      market.noShares,
      market.liquidityParam
    );

    const pricePerShare = outcome === "yes" ? yesPrice : noPrice;
    const cost = pricePerShare * shares;

    // Check user balance, etc...

    // 1. Create the trade
    const trade = await database.trade.create({
      data: {
        userId: user.id,
        marketId,
        amount: cost,
        shares,
        type: outcome === "yes" ? "BUY" : "SELL",
        //   outcome,
      },
    });

    // // 2. Increment market's yes/no volume

    // Update market shares

    console.log({ outcome });
    console.log(`Got outcome: ${outcome} and shares of ${shares}`);
    const marketData = await database.market.update({
      where: { id: market.id },
      data: {
        yesVolume: outcome === "yes" ? { increment: cost } : undefined,
        noVolume: outcome === "no" ? { increment: cost } : undefined,
        yesShares: outcome === "yes" ? { increment: shares } : undefined,
        noShares: outcome === "no" ? { increment: shares } : undefined,
      },
    });
    // if (outcome === "yes") {
    //   await database.market.update({
    //     where: { id: marketId },
    //     data: {
    //       yesVolume: { increment: amount },
    //       yesShares: outcome === "yes" ? { increment: shares } : undefined,
    //     },
    //   });
    // } else {
    //   await database.market.update({
    //     where: { id: marketId },
    //     data: {
    //       noVolume: { increment: amount },
    //       noShares: outcome === "no" ? { increment: shares } : undefined,
    //     },
    //   });
    // }
    console.log({ trade, marketData });
    return { success: true };
  } catch (error) {
    console.error("Error creating trade:", error);
    return {
      success: false,
      errors: { _form: ["Failed to create trade"] },
    };
  }
}
