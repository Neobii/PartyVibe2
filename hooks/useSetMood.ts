import { useMutation, useQueryClient } from "@tanstack/react-query";

type MoodResponse = { mood: number };

type SetMoodInput = number | { mood: number; characterSlug?: string | null };

export function useSetMood(characterSlug?: string | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: SetMoodInput) => {
      const mood = typeof input === "number" ? input : input.mood;
      const slug =
        typeof input === "object" && input.characterSlug != null
          ? input.characterSlug
          : characterSlug;
      const body: { mood: number; characterSlug?: string } = { mood };
      if (slug != null && slug !== "") {
        body.characterSlug = slug;
      }
      const res = await fetch("/api/mood", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error ?? "Failed to set mood");
      }

      return res.json() as Promise<MoodResponse>;
    },
    onSuccess: (data, input) => {
      const slug =
        typeof input === "object" && input.characterSlug != null
          ? input.characterSlug
          : characterSlug;
      queryClient.setQueryData(["mood", slug ?? "global"], data);
      queryClient.invalidateQueries({ queryKey: ["mood", "history"] });
      queryClient.invalidateQueries({ queryKey: ["characters"] });
    },
  });
}
