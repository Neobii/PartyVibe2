import CharacterPage from "@/components/CharacterPage";
import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

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
