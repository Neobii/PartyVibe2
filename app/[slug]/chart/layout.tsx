import { prisma } from "@/lib/db";
import type { Metadata } from "next";

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const character = await prisma.character.findFirst({
    where: { slug: slug.trim().toLowerCase() },
  });
  if (!character) {
    return { title: "Chart" };
  }
  const label = character.name?.trim() || character.slug;
  const title = `${label} — Mood chart`;
  return {
    title,
    description: `Mood over time for ${character.slug}`,
    openGraph: { title },
  };
}

export default function CharacterChartLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
