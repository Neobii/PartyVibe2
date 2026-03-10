import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

function createPrisma() {
  return new PrismaClient();
}

// After `prisma generate`, an old cached client may lack new models (e.g. Character).
// Replace stale singleton so API routes get a client with current schema.
function getPrisma(): PrismaClient {
  const cached = globalForPrisma.prisma;
  if (
    cached &&
    typeof (cached as unknown as { character?: unknown }).character !== "undefined"
  ) {
    return cached;
  }
  const client = createPrisma();
  if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = client;
  }
  return client;
}

export const prisma = getPrisma();
