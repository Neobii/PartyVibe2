import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { isValidCharacterSlug } from "@/lib/character-slug";
import { isValidAvatarStyle } from "@/lib/avatar-styles";

const MIN_MOOD = -100;
const MAX_MOOD = 100;

function clampMood(m: number) {
  return Math.max(MIN_MOOD, Math.min(MAX_MOOD, m));
}

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, { params }: Params) {
  try {
    const id = parseInt((await params).id, 10);
    if (Number.isNaN(id)) {
      return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    }
    const c = await prisma.character.findUnique({ where: { id } });
    if (!c) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({
      character: {
        id: c.id,
        slug: c.slug,
        name: c.name,
        mood: c.mood,
        avatarStyle: c.avatarStyle,
        createdAt: c.createdAt.toISOString(),
        updatedAt: c.updatedAt.toISOString(),
      },
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to get character" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, { params }: Params) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const id = parseInt((await params).id, 10);
    if (Number.isNaN(id)) {
      return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    }
    const body = await request.json();
    const data: { slug?: string; name?: string | null; mood?: number; avatarStyle?: string } = {};

    if (body.slug != null) {
      const slug = String(body.slug).trim().toLowerCase();
      if (!isValidCharacterSlug(slug)) {
        return NextResponse.json({ error: "Invalid slug" }, { status: 400 });
      }
      data.slug = slug;
    }
    if (body.name !== undefined) {
      data.name =
        body.name === null || body.name === ""
          ? null
          : String(body.name).trim() || null;
    }
    if (body.avatarStyle != null) {
      const s = String(body.avatarStyle).trim();
      if (!isValidAvatarStyle(s)) {
        return NextResponse.json({ error: "Invalid avatarStyle" }, { status: 400 });
      }
      data.avatarStyle = s;
    }
    if (body.mood != null) {
      const n = Number(body.mood);
      if (!Number.isInteger(n)) {
        return NextResponse.json({ error: "mood must be an integer" }, { status: 400 });
      }
      data.mood = clampMood(n);
    }

    if (Object.keys(data).length === 0) {
      return NextResponse.json({ error: "No fields to update" }, { status: 400 });
    }

    const updated = await prisma.character.update({
      where: { id },
      data,
    });
    if (data.mood !== undefined) {
      await prisma.characterMoodEntry.create({
        data: { characterId: id, mood: updated.mood },
      });
    }
    return NextResponse.json({
      character: {
        id: updated.id,
        slug: updated.slug,
        name: updated.name,
        mood: updated.mood,
        avatarStyle: updated.avatarStyle,
        createdAt: updated.createdAt.toISOString(),
        updatedAt: updated.updatedAt.toISOString(),
      },
    });
  } catch (e: unknown) {
    if (e && typeof e === "object" && "code" in e && e.code === "P2025") {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    if (e && typeof e === "object" && "code" in e && e.code === "P2002") {
      return NextResponse.json({ error: "Slug already exists" }, { status: 409 });
    }
    console.error(e);
    return NextResponse.json({ error: "Failed to update character" }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const id = parseInt((await params).id, 10);
    if (Number.isNaN(id)) {
      return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    }
    await prisma.character.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (e: unknown) {
    if (e && typeof e === "object" && "code" in e && e.code === "P2025") {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    console.error(e);
    return NextResponse.json({ error: "Failed to delete character" }, { status: 500 });
  }
}
