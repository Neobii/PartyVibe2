import { useMutation, useQueryClient } from "@tanstack/react-query";

type MoodInput = 0 | 1;

type MoodResponse = { mood: number };

export function useUpdateMood(characterSlug?: string | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (value: MoodInput) => {
      const body: { value: MoodInput; characterSlug?: string } = { value };
      if (characterSlug != null && characterSlug !== "") {
        body.characterSlug = characterSlug;
      }
      const res = await fetch("/api/mood", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error ?? "Failed to update mood");
      }

      return res.json() as Promise<MoodResponse>;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["mood", characterSlug ?? "global"], data);
      queryClient.invalidateQueries({ queryKey: ["mood", "history"] });
      if (characterSlug) {
        queryClient.invalidateQueries({
          queryKey: ["mood", "history", "character", characterSlug],
        });
      }
    },
  });
}
