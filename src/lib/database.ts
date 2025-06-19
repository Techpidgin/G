import { PrismaClient } from "@prisma/client";

declare global {
  var prisma: PrismaClient | undefined;
}

export const database = global.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") global.prisma = database;

export * from "@prisma/client";
