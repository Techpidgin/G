"use server";

import { database } from "@/lib/database";
import { newsFormSchema } from "@/schemas/news";
import * as z from "zod";

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
        tags,
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
  console.log({ slug });
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
