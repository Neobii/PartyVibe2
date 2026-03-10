import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const history = searchParams.get("history") === "true";

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

    if (value !== 0 && value !== 1) {
      return NextResponse.json(
        { error: "value must be 0 or 1" },
        { status: 400 }
      );
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
    // Temporarily allow without login — uncomment to re-enable auth
    // const session = await auth();
    // if (!session?.user) {
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    // }

    const body = await request.json();
    const mood = body?.mood;

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
