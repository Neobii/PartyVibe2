import { useMutation, useQueryClient } from "@tanstack/react-query";

type MoodResponse = { mood: number };

export function useSetMood() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (mood: number) => {
      const res = await fetch("/api/mood", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mood }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error ?? "Failed to set mood");
      }

      return res.json() as Promise<MoodResponse>;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["mood"], data);
    },
  });
}
