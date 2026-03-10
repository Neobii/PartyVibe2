import { NextRequest, NextResponse } from "next/server";
import {
  getCharacterSlug,
  setCharacterSlug,
  isValidCharacterSlug,
} from "@/lib/character-slug";

export async function GET() {
  try {
    const slug = await getCharacterSlug();
    return NextResponse.json({ slug });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Failed to read character slug" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const slug = body?.slug;
    if (typeof slug !== "string") {
      return NextResponse.json({ error: "slug must be a string" }, { status: 400 });
    }
    if (!isValidCharacterSlug(slug.trim())) {
      return NextResponse.json(
        {
          error:
            "Invalid slug. Use letters, numbers, hyphens only; not reserved (admin, login, api).",
        },
        { status: 400 }
      );
    }
    const saved = await setCharacterSlug(slug);
    return NextResponse.json({ slug: saved });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Failed to save character slug" },
      { status: 500 }
    );
  }
}
