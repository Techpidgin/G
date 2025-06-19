import * as z from "zod";

// Define market item structure
const marketItemSchema = z.object({
  title: z.string().min(1, "Market title is required"),
  question: z.string().optional(),
});

// Zod schema for news form validation
export const newsFormBaseSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(200, "Title must be less than 200 characters"),
  slug: z
    .string()
    .min(1, "Slug is required")
    .max(100, "Slug must be less than 100 characters")
    .regex(
      /^[a-z0-9-]+$/,
      "Slug must contain only lowercase letters, numbers, and hyphens"
    ),
  description: z
    .string()
    .min(1, "Description is required")
    .max(1000, "Description must be less than 1000 characters"),
  image: z.string().optional(),
  icon: z.string().optional(),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid date format",
  }),
  active: z.boolean().default(true),
  new: z.boolean().default(false),
  archived: z.boolean().default(false),
  featured: z.boolean().default(false),
  restricted: z.boolean().default(false),
  tags: z.array(z.string()).min(1, "At least one tag is required"),
  variant: z.boolean().default(false),
  markets: z.array(marketItemSchema).optional(),
});

export const newsFormSchema = newsFormBaseSchema.superRefine((data, ctx) => {
  if (data.variant) {
    if (!data.markets || data.markets.length < 2) {
      ctx.addIssue({
        path: ["markets"],
        code: z.ZodIssueCode.custom,
        message: "At least 2 markets are required if variant is true",
      });
    }
  }
});

// export const marketFormSchema = z.object({
//   title: z.string().min(3, "Title is required"),
//   slug: z
//     .string()
//     .min(1, "Slug is required")
//     .max(100, "Slug must be less than 100 characters")
//     .regex(
//       /^[a-z0-9-]+$/,
//       "Slug must contain only lowercase letters, numbers, and hyphens"
//     ),
//   image: z.string().optional(),
//   icon: z.string().optional(),
//   description: z.string().min(10, "Description is required"),
//   startDate: z.string().min(1, "Start date is required"),
//   endDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
//     message: "Invalid date format",
//   }),
//   subMarkets: z
//     .array(z.string().min(1, "SubMarket name is required"))
//     .min(2, "At least 2 submarkets are required"),
// });
