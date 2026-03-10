import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { CharacterDto } from "@/hooks/useCharacters";

export function useCreateCharacter() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (body: { slug: string; name?: string; mood?: number }) => {
      const res = await fetch("/api/characters", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error ?? "Failed to create");
      }
      return res.json() as Promise<{ character: CharacterDto }>;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["characters"] });
    },
  });
}

export function useUpdateCharacter() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (args: {
      id: number;
      slug?: string;
      name?: string | null;
      mood?: number;
    }) => {
      const { id, ...patch } = args;
      const res = await fetch(`/api/characters/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error ?? "Failed to update");
      }
      return res.json() as Promise<{ character: CharacterDto }>;
    },
    onSuccess: (res) => {
      qc.invalidateQueries({ queryKey: ["characters"] });
      qc.invalidateQueries({ queryKey: ["mood"] });
      qc.invalidateQueries({
        queryKey: ["mood", "history", "character", res.character.slug],
      });
    },
  });
}

export function useDeleteCharacter() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`/api/characters/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error ?? "Failed to delete");
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["characters"] });
    },
  });
}
