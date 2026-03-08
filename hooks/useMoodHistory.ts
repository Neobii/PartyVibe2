import { useQuery } from "@tanstack/react-query";

export type MoodHistoryEntry = { mood: number; createdAt: string };

type MoodHistoryResponse = { history: MoodHistoryEntry[] };

export function useMoodHistory() {
  return useQuery({
    queryKey: ["mood", "history"],
    queryFn: async () => {
      const res = await fetch("/api/mood?history=true");
      if (!res.ok) throw new Error("Failed to fetch mood history");
      return res.json() as Promise<MoodHistoryResponse>;
    },
  });
}
