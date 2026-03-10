import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { isValidCharacterSlug } from "@/lib/character-slug";
import { DEFAULT_AVATAR_STYLE, isValidAvatarStyle } from "@/lib/avatar-styles";

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
        avatarStyle: c.avatarStyle,
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
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
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

    let avatarStyle = DEFAULT_AVATAR_STYLE;
    if (body?.avatarStyle != null) {
      const s = String(body.avatarStyle).trim();
      if (!isValidAvatarStyle(s)) {
        return NextResponse.json({ error: "Invalid avatarStyle" }, { status: 400 });
      }
      avatarStyle = s;
    }

    if (!isValidCharacterSlug(slug)) {
      return NextResponse.json(
        { error: "Invalid slug (letters, numbers, hyphens; not reserved paths)." },
        { status: 400 }
      );
    }

    const created = await prisma.character.create({
      data: { slug, name, mood, avatarStyle },
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
        avatarStyle: created.avatarStyle,
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
