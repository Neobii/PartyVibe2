import { useQuery } from "@tanstack/react-query";

type MoodResponse = { mood: number };

export function useMood() {
  return useQuery({
    queryKey: ["mood"],
    queryFn: async () => {
      const res = await fetch("/api/mood");
      if (!res.ok) throw new Error("Failed to fetch mood");
      return res.json() as Promise<MoodResponse>;
    },
  });
}
