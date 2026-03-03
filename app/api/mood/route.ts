import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const state = await prisma.moodState.findUnique({
      where: { id: 1 },
    });
    return NextResponse.json({ mood: state?.mood ?? 0 });
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

    const updated = await prisma.moodState.upsert({
      where: { id: 1 },
      update: { mood: { increment: delta } },
      create: { id: 1, mood: delta },
    });

    return NextResponse.json({ mood: updated.mood });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
