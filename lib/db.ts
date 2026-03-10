import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

function createPrisma() {
  return new PrismaClient();
}

// After `prisma generate`, an old cached client may lack new models.
// Replace stale singleton so API routes get a client with current schema.
function hasDelegate(client: PrismaClient, name: string): boolean {
  return typeof (client as unknown as Record<string, unknown>)[name] !== "undefined";
}

function getPrisma(): PrismaClient {
  const cached = globalForPrisma.prisma;
  if (
    cached &&
    hasDelegate(cached, "character") &&
    hasDelegate(cached, "characterMoodEntry")
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
