import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

async function getCharacterBySlug(slug: string) {
  return prisma.character.findFirst({
    where: { slug: slug.trim().toLowerCase() },
  });
}

async function appendCharacterMoodHistory(characterId: number, mood: number) {
  await prisma.characterMoodEntry.create({
    data: { characterId, mood },
  });
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const characterSlug = searchParams.get("characterSlug");
    const history = searchParams.get("history") === "true";

    if (characterSlug) {
      const c = await getCharacterBySlug(characterSlug);
      if (!c) {
        return NextResponse.json({ error: "Character not found" }, { status: 404 });
      }
      if (history) {
        const entries = await prisma.characterMoodEntry.findMany({
          where: { characterId: c.id },
          orderBy: { createdAt: "asc" },
        });
        if (entries.length === 0) {
          // One point so chart has something until first change
          return NextResponse.json({
            history: [
              { mood: c.mood, createdAt: c.updatedAt.toISOString() },
            ],
          });
        }
        return NextResponse.json({
          history: entries.map((e) => ({
            mood: e.mood,
            createdAt: e.createdAt.toISOString(),
          })),
        });
      }
      return NextResponse.json({ mood: c.mood });
    }

    if (history) {
      const entries = await prisma.moodEntry.findMany({
        orderBy: { createdAt: "asc" },
      });
      return NextResponse.json({
        history: entries.map((e) => ({
          mood: e.mood,
          createdAt: e.createdAt.toISOString(),
        })),
      });
    }

    const latest = await prisma.moodEntry.findFirst({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ mood: latest?.mood ?? 0 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const value = body?.value;
    const characterSlug =
      typeof body?.characterSlug === "string" ? body.characterSlug : null;

    if (value !== 0 && value !== 1) {
      return NextResponse.json(
        { error: "value must be 0 or 1" },
        { status: 400 }
      );
    }

    if (characterSlug) {
      const c = await getCharacterBySlug(characterSlug);
      if (!c) {
        return NextResponse.json({ error: "Character not found" }, { status: 404 });
      }
      const delta = value === 1 ? 1 : -1;
      const newMood = Math.max(-100, Math.min(100, c.mood + delta));
      const updated = await prisma.character.update({
        where: { id: c.id },
        data: { mood: newMood },
      });
      await appendCharacterMoodHistory(c.id, updated.mood);
      return NextResponse.json({ mood: updated.mood });
    }

    const delta = value === 1 ? 1 : -1;
    const latest = await prisma.moodEntry.findFirst({
      orderBy: { createdAt: "desc" },
    });
    const currentMood = latest?.mood ?? 0;
    const newMood = Math.max(-100, Math.min(100, currentMood + delta));

    const created = await prisma.moodEntry.create({
      data: { mood: newMood },
    });

    return NextResponse.json({ mood: created.mood });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const mood = body?.mood;
    const characterSlug =
      typeof body?.characterSlug === "string" ? body.characterSlug : null;

    if (typeof mood !== "number" || !Number.isInteger(mood)) {
      return NextResponse.json(
        { error: "mood must be an integer" },
        { status: 400 }
      );
    }
    if (mood < -100 || mood > 100) {
      return NextResponse.json(
        { error: "mood must be between -100 and 100" },
        { status: 400 }
      );
    }

    if (characterSlug) {
      const c = await getCharacterBySlug(characterSlug);
      if (!c) {
        return NextResponse.json({ error: "Character not found" }, { status: 404 });
      }
      const updated = await prisma.character.update({
        where: { id: c.id },
        data: { mood },
      });
      await appendCharacterMoodHistory(c.id, updated.mood);
      return NextResponse.json({ mood: updated.mood });
    }

    const created = await prisma.moodEntry.create({
      data: { mood },
    });

    return NextResponse.json({ mood: created.mood });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
