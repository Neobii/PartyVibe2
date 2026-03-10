import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useSetCharacterSlug() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (slug: string) => {
      const res = await fetch("/api/settings/character-slug", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error ?? "Failed to save slug");
      }
      return res.json() as Promise<{ slug: string }>;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["character-slug"] });
    },
  });
}
