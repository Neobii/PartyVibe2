import { useQuery } from "@tanstack/react-query";

export type MoodHistoryEntry = { mood: number; createdAt: string };

type MoodHistoryResponse = { history: MoodHistoryEntry[] };

export function useCharacterMoodHistory(characterSlug: string) {
  return useQuery({
    queryKey: ["mood", "history", "character", characterSlug],
    queryFn: async () => {
      const url = `/api/mood?history=true&characterSlug=${encodeURIComponent(characterSlug)}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch character mood history");
      return res.json() as Promise<MoodHistoryResponse>;
    },
  });
}
