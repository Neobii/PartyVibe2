import { useQuery } from "@tanstack/react-query";

export function useCharacterSlug() {
  return useQuery({
    queryKey: ["character-slug"],
    queryFn: async () => {
      const res = await fetch("/api/settings/character-slug");
      if (!res.ok) throw new Error("Failed to fetch character slug");
      const data = (await res.json()) as { slug: string };
      return data.slug;
    },
  });
}
