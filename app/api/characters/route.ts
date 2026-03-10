import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { isValidCharacterSlug } from "@/lib/character-slug";

const MIN_MOOD = -100;
const MAX_MOOD = 100;

function clampMood(m: number) {
  return Math.max(MIN_MOOD, Math.min(MAX_MOOD, m));
}

export async function GET() {
  try {
    const list = await prisma.character.findMany({
      orderBy: { id: "asc" },
    });
    return NextResponse.json({
      characters: list.map((c) => ({
        id: c.id,
        slug: c.slug,
        name: c.name,
        mood: c.mood,
        createdAt: c.createdAt.toISOString(),
        updatedAt: c.updatedAt.toISOString(),
      })),
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to list characters" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const slug = typeof body?.slug === "string" ? body.slug.trim().toLowerCase() : "";
    const name = typeof body?.name === "string" ? body.name.trim() || null : null;
    let mood = 0;
    if (body?.mood != null) {
      const n = Number(body.mood);
      if (!Number.isInteger(n)) {
        return NextResponse.json({ error: "mood must be an integer" }, { status: 400 });
      }
      mood = clampMood(n);
    }

    if (!isValidCharacterSlug(slug)) {
      return NextResponse.json(
        { error: "Invalid slug (letters, numbers, hyphens; not reserved paths)." },
        { status: 400 }
      );
    }

    const created = await prisma.character.create({
      data: { slug, name, mood },
    });
    await prisma.characterMoodEntry.create({
      data: { characterId: created.id, mood: created.mood },
    });
    return NextResponse.json({
      character: {
        id: created.id,
        slug: created.slug,
        name: created.name,
        mood: created.mood,
        createdAt: created.createdAt.toISOString(),
        updatedAt: created.updatedAt.toISOString(),
      },
    });
  } catch (e: unknown) {
    if (e && typeof e === "object" && "code" in e && e.code === "P2002") {
      return NextResponse.json({ error: "Slug already exists" }, { status: 409 });
    }
    console.error(e);
    return NextResponse.json({ error: "Failed to create character" }, { status: 500 });
  }
}
