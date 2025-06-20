"use server";

import { database } from "@/lib/database";
import { cookies } from "next/headers";
import privy from "@/lib/privy";
import * as z from "zod";
import { tradeSchema } from "@/schemas/trade";
import { getTradeCost } from "@/helpers/lmsr";

type TradeFormValues = z.infer<typeof tradeSchema>;

export async function placeTrade(values: TradeFormValues) {
  try {
    const cookieStore = await cookies();
    const authToken = cookieStore.get("privy-token")?.value;
    console.log(authToken);
    if (!authToken) {
      return {
        success: false,
        errors: "Unauthenticated User",
      };
    }
    const verifiedClaims = await privy.verifyAuthToken(authToken);
    console.log(verifiedClaims);
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
      console.log("Error Occured");
      return {
        success: false,
        errors: result.error.flatten().fieldErrors,
      };
    }
    const { marketId, amount, shares, outcome } = result.data;

    const market = await database.market.findUnique({
      where: { id: marketId },
    });

    if (!market) {
      return {
        success: false,
        error: "Market does not exist",
      };
    }

    const cost = getTradeCost(outcome, shares, {
      yesShares: market?.yesShares,
      noShares: market.noShares,
      liquidityParam: market.liquidityParam,
    });

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
    await database.market.update({
      where: { id: market.id },
      data: {
        yesVolume: outcome === "yes" ? { increment: amount } : undefined,
        noVolume: outcome === "no" ? { increment: amount } : undefined,
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
    console.log(trade);
    return { success: true };
  } catch (error) {
    console.error("Error creating trade:", error);
    return {
      success: false,
      errors: { _form: ["Failed to create trade"] },
    };
  }
}
