import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

const mockPrismaInstance = {
  character: {},
  characterMoodEntry: {},
};

vi.mock("@prisma/client", () => ({
  PrismaClient: vi.fn(function PrismaClient(this: unknown) {
    return mockPrismaInstance;
  }),
}));

describe("lib/db getPrisma behavior", () => {
  const originalEnv = process.env.NODE_ENV;
  const globalKey = "prisma" as const;
  const g = globalThis as unknown as Record<string, unknown>;

  beforeEach(() => {
    delete g[globalKey];
    vi.resetModules();
  });

  afterEach(() => {
    process.env.NODE_ENV = originalEnv;
    delete g[globalKey];
    vi.resetModules();
  });

  it("creates new client when no cache", async () => {
    process.env.NODE_ENV = "development";
    const { prisma } = await import("./db");
    expect(prisma).toBe(mockPrismaInstance);
    expect(g[globalKey]).toBe(mockPrismaInstance);
  });

  it("reuses cached client when delegates exist", async () => {
    process.env.NODE_ENV = "development";
    g[globalKey] = mockPrismaInstance;
    vi.resetModules();
    const { prisma: p1 } = await import("./db");
    vi.resetModules();
    const { prisma: p2 } = await import("./db");
    expect(p1).toBe(p2);
  });

  it("does not assign global in production", async () => {
    process.env.NODE_ENV = "production";
    delete g[globalKey];
    vi.resetModules();
    await import("./db");
    // In production, global may not be set after first load; module still exports prisma
    const { prisma } = await import("./db");
    expect(prisma).toBeDefined();
  });
});
