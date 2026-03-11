import { describe, it, expect, vi, beforeEach } from "vitest";

const findUnique = vi.fn();
const upsert = vi.fn();

vi.mock("@/lib/db", () => ({
  prisma: {
    setting: {
      findUnique: (...args: unknown[]) => findUnique(...args),
      upsert: (...args: unknown[]) => upsert(...args),
    },
  },
}));

import {
  isValidCharacterSlug,
  getCharacterSlug,
  setCharacterSlug,
} from "./character-slug";

describe("isValidCharacterSlug", () => {
  it("false for empty or too long", () => {
    expect(isValidCharacterSlug("")).toBe(false);
    expect(isValidCharacterSlug("a".repeat(65))).toBe(false);
  });

  it("false for reserved", () => {
    expect(isValidCharacterSlug("admin")).toBe(false);
    expect(isValidCharacterSlug("login")).toBe(false);
    expect(isValidCharacterSlug("api")).toBe(false);
    expect(isValidCharacterSlug("_next")).toBe(false);
    expect(isValidCharacterSlug("favicon.ico")).toBe(false);
    expect(isValidCharacterSlug("ADMIN")).toBe(false);
  });

  it("false for invalid chars", () => {
    expect(isValidCharacterSlug("foo bar")).toBe(false);
    expect(isValidCharacterSlug("foo_bar")).toBe(false);
    expect(isValidCharacterSlug("foo.bar")).toBe(false);
    expect(isValidCharacterSlug("-foo")).toBe(false);
    expect(isValidCharacterSlug("foo-")).toBe(false);
  });

  it("true for valid slugs", () => {
    expect(isValidCharacterSlug("a")).toBe(true);
    expect(isValidCharacterSlug("party-cat")).toBe(true);
    expect(isValidCharacterSlug("Foo-Bar")).toBe(true);
    expect(isValidCharacterSlug("slug123")).toBe(true);
  });
});

describe("getCharacterSlug", () => {
  beforeEach(() => {
    findUnique.mockReset();
  });

  it("returns DEFAULT when no row", async () => {
    findUnique.mockResolvedValue(null);
    await expect(getCharacterSlug()).resolves.toBe("character");
  });

  it("returns DEFAULT when row value invalid", async () => {
    findUnique.mockResolvedValue({ value: "admin" });
    await expect(getCharacterSlug()).resolves.toBe("character");
    findUnique.mockResolvedValue({ value: "  " });
    await expect(getCharacterSlug()).resolves.toBe("character");
  });

  it("returns slug when row has valid slug", async () => {
    findUnique.mockResolvedValue({ value: "my-party" });
    await expect(getCharacterSlug()).resolves.toBe("my-party");
  });
});

describe("setCharacterSlug", () => {
  beforeEach(() => {
    upsert.mockReset();
    upsert.mockResolvedValue({});
  });

  it("throws when slug invalid", async () => {
    await expect(setCharacterSlug("admin")).rejects.toThrow("Invalid slug");
    await expect(setCharacterSlug("")).rejects.toThrow("Invalid slug");
  });

  it("normalizes and upserts", async () => {
    await expect(setCharacterSlug("  My-Slug  ")).resolves.toBe("my-slug");
    expect(upsert).toHaveBeenCalledWith({
      where: { key: "character_slug" },
      create: { key: "character_slug", value: "my-slug" },
      update: { value: "my-slug" },
    });
  });
});
