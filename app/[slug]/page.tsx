import CharacterPage from "@/components/CharacterPage";
import { prisma } from "@/lib/db";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const character = await prisma.character.findFirst({
    where: { slug: slug.trim().toLowerCase() },
  });
  if (!character) {
    return { title: "Not found" };
  }
  const label = character.name?.trim() || character.slug;
  return {
    title: label,
    description: `Mood character ${character.slug}`,
    openGraph: { title: label },
  };
}

export default async function SlugPage({ params }: Props) {
  const { slug } = await params;
  const character = await prisma.character.findFirst({
    where: { slug: slug.trim().toLowerCase() },
  });
  if (!character) {
    notFound();
  }
  return (
    <CharacterPage
      characterSlug={character.slug}
      characterName={character.name ?? character.slug}
    />
  );
}
