import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

// ⚡ Important pour Neon + Next.js 16 + Turbopack
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasourceUrl: process.env.DATABASE_URL,
    log: ["error", "warn"], // tu peux remettre "query" pour debug
  });

// ⚡ Évite la recréation multiple des instances Prisma (cause connexion CLOSE)
if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
