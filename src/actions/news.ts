"use server";

import { database } from "@/lib/database";
import { newsFormSchema } from "@/schemas/news";
import * as z from "zod";

const mockTags = [
  { id: "2", label: "Politics", slug: "politics" },
  { id: "180", label: "Israel", slug: "israel" },
  { id: "100265", label: "Geopolitics", slug: "geopolitics" },
  { id: "61", label: "Gaza", slug: "gaza" },
  { id: "101970", label: "World", slug: "world" },
  { id: "366", label: "World Affairs", slug: "world-affairs" },
  { id: "3", label: "Sports", slug: "sports" },
  { id: "4", label: "Tech", slug: "tech" },
  { id: "5", label: "Economy", slug: "economy" },
  { id: "6", label: "Crypto", slug: "crypto" },
];

export async function createMarket(data: z.infer<typeof newsFormSchema>) {
  try {
    const result = newsFormSchema.safeParse(data);

    if (!result.success) {
      console.log("Error Occured");
      return {
        success: false,
        errors: result.error.flatten().fieldErrors,
      };
    }

    // Equal probability for each outcome
    const {
      title,
      description,
      slug,
      endDate,
      markets,
      image,
      startDate,
      variant,
      tags,
    } = result.data;

    const market = await database.news.create({
      data: {
        title,
        slug,
        description,
        image,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        markets: {
          create:
            variant && markets?.length
              ? markets.map((label) => ({
                  title,
                  outcomes: ["Yes", "No"],
                  // shares: 0,
                  // liquidity: 0,
                }))
              : {
                  title,
                  outcomes: ["Yes", "No"],
                  // liquidity: 0,
                  // shares: 0,
                },
        },
        tags: mockTags.map((tag) => tag.label),
        // tags: {
        //   connect: parsed.tagIds.map((id) => ({ id })),
        // },
        // outcomes: {
        //   create: parsed.outcomes.map((label) => ({ label, price: 0.5 })),
        // },
        // outcomes: {
        //   create: parsed.outcomes.map((label) => ({
        //     label,
        //     price: parseFloat(initialPrice.toFixed(2)),
        //   })),
        // },
      },
      include: { markets: true },
    });

    console.log({ market });
    return { success: true, market };
  } catch (error) {
    console.error("Error creating market:", error);
    return {
      success: false,
      errors: { _form: ["Failed to create market"] },
    };
  }
}

export async function listNews() {
  return await database.news.findMany({
    include: {
      markets: true,
      // tags: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function getNewsBySlug(slug: string) {
  return await database.news.findUnique({
    where: { slug },
    include: {
      markets: true,
      // tags: true,
      // comments: {
      //   include: {
      //     user: true,
      //   },
      //   orderBy: {
      //     createdAt: "desc",
      //   },
      // },
    },
  });
}

export async function getMarketChartFromTrades(marketId: string) {
  const trades = await database.trade.findMany({
    where: { marketId },
    orderBy: { timestamp: "asc" },
  });

  // Group trades by day
  const priceSnapshots: Record<
    string,
    { yesVolume: number; noVolume: number }
  > = {};

  for (const trade of trades) {
    const date = trade.timestamp.toISOString().slice(0, 10); // e.g., "2025-06-21"
    if (!priceSnapshots[date]) {
      priceSnapshots[date] = { yesVolume: 0, noVolume: 0 };
    }

    if (trade.type === "BUY") {
      priceSnapshots[date].yesVolume += trade.amount;
    } else {
      priceSnapshots[date].noVolume += trade.amount;
    }
  }

  // Convert to chart data
  const chartData = Object.entries(priceSnapshots).map(([time, volumes]) => {
    const total = volumes.yesVolume + volumes.noVolume;
    const yes = total > 0 ? (volumes.yesVolume / total) * 100 : 50;
    const no = total > 0 ? (volumes.noVolume / total) * 100 : 50;

    return {
      time,
      Yes: Math.round(yes),
      No: Math.round(no),
    };
  });

  return chartData;
}
