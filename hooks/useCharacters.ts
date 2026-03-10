import { useQuery } from "@tanstack/react-query";

export type CharacterDto = {
  id: number;
  slug: string;
  name: string | null;
  mood: number;
  createdAt: string;
  updatedAt: string;
};

export function useCharacters() {
  return useQuery({
    queryKey: ["characters"],
    queryFn: async () => {
      const res = await fetch("/api/characters");
      if (!res.ok) throw new Error("Failed to fetch characters");
      const data = (await res.json()) as { characters: CharacterDto[] };
      return data.characters;
    },
  });
}
