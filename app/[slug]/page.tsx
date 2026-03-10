import CharacterPage from "@/components/CharacterPage";
import { getCharacterSlug } from "@/lib/character-slug";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export default async function SlugPage({ params }: Props) {
  const { slug } = await params;
  const configured = await getCharacterSlug();
  if (slug.toLowerCase() !== configured.toLowerCase()) {
    notFound();
  }
  return <CharacterPage />;
}
