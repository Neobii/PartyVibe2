import { prisma } from "@/lib/db";

const SETTING_KEY = "character_slug";
const DEFAULT_SLUG = "character";

const RESERVED = new Set([
  "admin",
  "login",
  "api",
  "_next",
  "favicon.ico",
]);

export function isValidCharacterSlug(slug: string): boolean {
  if (!slug || slug.length > 64) return false;
  if (RESERVED.has(slug.toLowerCase())) return false;
  // URL segment: letters, numbers, hyphens only
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/i.test(slug);
}

export async function getCharacterSlug(): Promise<string> {
  const row = await prisma.setting.findUnique({
    where: { key: SETTING_KEY },
  });
  const slug = row?.value?.trim();
  if (slug && isValidCharacterSlug(slug)) return slug;
  return DEFAULT_SLUG;
}

export async function setCharacterSlug(slug: string): Promise<string> {
  const normalized = slug.trim().toLowerCase();
  if (!isValidCharacterSlug(normalized)) {
    throw new Error("Invalid slug");
  }
  await prisma.setting.upsert({
    where: { key: SETTING_KEY },
    create: { key: SETTING_KEY, value: normalized },
    update: { value: normalized },
  });
  return normalized;
}
