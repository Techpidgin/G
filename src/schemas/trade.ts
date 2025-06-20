import * as z from "zod";

export const tradeSchema = z.object({
  marketId: z.string(),
  side: z.enum(["buy", "sell"]),
  outcome: z.enum(["yes", "no"]),
  amount: z.number(),
  shares: z
    .number({ invalid_type_error: "Shares must be a number" })
    .min(1, "Minimum 1 share"),
  limitPrice: z
    .number({ invalid_type_error: "Price must be a number" })
    .min(0.01, "Minimum price is 0.01")
    .max(1, "Maximum price is 1"),
});
