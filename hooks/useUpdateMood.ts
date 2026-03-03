import { useMutation, useQueryClient } from "@tanstack/react-query";

type MoodInput = 0 | 1; // 0 = decrement, 1 = increment

type MoodResponse = { mood: number };

export function useUpdateMood() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (value: MoodInput) => {
      const res = await fetch("/api/mood", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ value }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error ?? "Failed to update mood");
      }

      return res.json() as Promise<MoodResponse>;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["mood"], data);
    },
  });
}
