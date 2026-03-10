import { useQuery } from "@tanstack/react-query";

type MoodResponse = { mood: number };

export function useMood(characterSlug?: string | null) {
  return useQuery({
    queryKey: ["mood", characterSlug ?? "global"],
    queryFn: async () => {
      const url =
        characterSlug != null && characterSlug !== ""
          ? `/api/mood?characterSlug=${encodeURIComponent(characterSlug)}`
          : "/api/mood";
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch mood");
      return res.json() as Promise<MoodResponse>;
    },
  });
}
