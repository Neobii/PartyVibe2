"use client";

import { useMood } from "@/hooks/useMood";
import { useSetMood } from "@/hooks/useSetMood";
import { useCharacters } from "@/hooks/useCharacters";
import {
  useCreateCharacter,
  useUpdateCharacter,
  useDeleteCharacter,
} from "@/hooks/useCharacterMutations";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { useState } from "react";

const MIN_MOOD = -100;
const MAX_MOOD = 100;

const inputStyle: React.CSSProperties = {
  padding: "0.5rem 0.75rem",
  fontSize: "0.875rem",
  borderRadius: "0.5rem",
  border: "1px solid #374151",
  background: "#1f2937",
  color: "#fff",
  width: "100%",
  boxSizing: "border-box",
};

export default function AdminPage() {
  const { data: globalMood, isLoading: globalLoading } = useMood();
  const { mutate: setGlobalMood, isPending: globalPending } = useSetMood();
  const { data: characters, isLoading: listLoading } = useCharacters();
  const createChar = useCreateCharacter();
  const updateChar = useUpdateCharacter();
  const deleteChar = useDeleteCharacter();

  const [globalValue, setGlobalValue] = useState("0");
  const [newSlug, setNewSlug] = useState("");
  const [newName, setNewName] = useState("");
  const [newMood, setNewMood] = useState("0");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editSlug, setEditSlug] = useState("");
  const [editName, setEditName] = useState("");
  const [editMood, setEditMood] = useState("");

  const globalNum = parseInt(globalValue, 10);
  const globalValid =
    !Number.isNaN(globalNum) && globalNum >= MIN_MOOD && globalNum <= MAX_MOOD;

  const startEdit = (c: { id: number; slug: string; name: string | null; mood: number }) => {
    setEditingId(c.id);
    setEditSlug(c.slug);
    setEditName(c.name ?? "");
    setEditMood(String(c.mood));
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditSlug("");
    setEditName("");
    setEditMood("");
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "2rem 1rem",
        gap: "2rem",
      }}
    >
      <div
        style={{
          display: "flex",
          gap: "1rem",
          alignItems: "center",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        <Link href="/" style={{ color: "#a78bfa", textDecoration: "none", fontSize: "0.875rem" }}>
          ← Home
        </Link>
        <h1 style={{ fontSize: "1.5rem", fontWeight: 600 }}>Admin Panel</h1>
        <button
          type="button"
          onClick={() => signOut({ callbackUrl: "/" })}
          style={{
            padding: "0.5rem 1rem",
            fontSize: "0.875rem",
            borderRadius: "0.5rem",
            border: "1px solid #374151",
            background: "transparent",
            color: "#888",
            cursor: "pointer",
          }}
        >
          Sign out
        </button>
      </div>

      {/* Characters CRUD */}
      <section
        style={{
          background: "rgba(255,255,255,0.05)",
          borderRadius: "0.5rem",
          padding: "2rem",
          width: "100%",
          maxWidth: "640px",
        }}
      >
        <h2 style={{ fontSize: "1rem", marginBottom: "1rem", color: "#ccc" }}>
          Characters — slug + mood
        </h2>
        <p style={{ color: "#888", fontSize: "0.875rem", marginBottom: "1.5rem" }}>
          Each character has its own URL <code style={{ color: "#a78bfa" }}>/slug</code>. You{" "}
          <strong style={{ color: "#d1d5db" }}>set mood</strong> here (–100 to 100); it drives the
          face on that character’s page. Thumbs on the page only change that character’s mood.
        </p>

        <h3 style={{ fontSize: "0.9rem", marginBottom: "0.75rem", color: "#a78bfa" }}>
          Create character — set slug &amp; mood
        </h3>
        {/* Create */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const mood = parseInt(newMood, 10);
            createChar.mutate(
              {
                slug: newSlug.trim().toLowerCase(),
                name: newName.trim() || undefined,
                mood: Number.isInteger(mood) ? mood : 0,
              },
              {
                onSuccess: () => {
                  setNewSlug("");
                  setNewName("");
                  setNewMood("0");
                },
              }
            );
          }}
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "0.75rem",
            marginBottom: "1.5rem",
            paddingBottom: "1.5rem",
            borderBottom: "1px solid #374151",
          }}
        >
          <label style={{ gridColumn: "1 / -1", color: "#9ca3af", fontSize: "0.75rem" }}>
            URL slug (path after /)
          </label>
          <input
            style={{ ...inputStyle, gridColumn: "1 / -1" }}
            placeholder="e.g. party-cat"
            value={newSlug}
            onChange={(e) => setNewSlug(e.target.value)}
            required
            aria-label="URL slug"
          />
          <label style={{ color: "#9ca3af", fontSize: "0.75rem" }}>Display name (optional)</label>
          <label style={{ color: "#9ca3af", fontSize: "0.75rem" }}>
            Mood to set (–100…100)
          </label>
          <input
            style={inputStyle}
            placeholder="optional label"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            aria-label="Display name optional"
          />
          <input
            style={inputStyle}
            type="number"
            min={MIN_MOOD}
            max={MAX_MOOD}
            placeholder={`${MIN_MOOD} to ${MAX_MOOD}`}
            value={newMood}
            onChange={(e) => setNewMood(e.target.value)}
            aria-label="Set mood from negative 100 to 100"
          />
          <p style={{ gridColumn: "1 / -1", color: "#6b7280", fontSize: "0.7rem", margin: 0 }}>
            This number is the character’s mood; the face on their page reflects it. You can change it
            anytime with Edit or with thumbs on their page.
          </p>
          <button
            type="submit"
            disabled={createChar.isPending || !newSlug.trim()}
            style={{
              gridColumn: "1 / -1",
              padding: "0.75rem",
              fontWeight: 600,
              borderRadius: "0.5rem",
              border: "none",
              background: "#7c3aed",
              color: "#fff",
              cursor: createChar.isPending ? "not-allowed" : "pointer",
              opacity: createChar.isPending ? 0.6 : 1,
            }}
          >
            {createChar.isPending ? "Creating…" : "Create character with this mood"}
          </button>
          {createChar.isError && (
            <span style={{ gridColumn: "1 / -1", color: "#f87171", fontSize: "0.875rem" }}>
              {createChar.error.message}
            </span>
          )}
        </form>

        {/* List */}
        {listLoading ? (
          <p style={{ color: "#888" }}>Loading…</p>
        ) : !characters?.length ? (
          <p style={{ color: "#888" }}>No characters yet. Create one above.</p>
        ) : (
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "1rem" }}>
            {characters.map((c) => (
              <li
                key={c.id}
                style={{
                  background: "rgba(0,0,0,0.2)",
                  borderRadius: "0.5rem",
                  padding: "1rem",
                }}
              >
                {editingId === c.id ? (
                  <form
                    aria-label={`Edit character ${c.slug} and set mood`}
                    onSubmit={(e) => {
                      e.preventDefault();
                      const mood = parseInt(editMood, 10);
                      updateChar.mutate(
                        {
                          id: c.id,
                          slug: editSlug.trim().toLowerCase(),
                          name: editName.trim() || null,
                          mood: Number.isInteger(mood) ? mood : c.mood,
                        },
                        { onSuccess: () => cancelEdit() }
                      );
                    }}
                    style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
                  >
                    <span style={{ color: "#a78bfa", fontSize: "0.8rem", fontWeight: 600 }}>
                      Edit — set slug, name &amp; mood
                    </span>
                    <label style={{ color: "#9ca3af", fontSize: "0.75rem" }}>Slug</label>
                    <input
                      style={inputStyle}
                      value={editSlug}
                      onChange={(e) => setEditSlug(e.target.value)}
                      aria-label="Slug"
                    />
                    <label style={{ color: "#9ca3af", fontSize: "0.75rem" }}>Name (optional)</label>
                    <input
                      style={inputStyle}
                      placeholder="optional"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      aria-label="Name optional"
                    />
                    <label style={{ color: "#9ca3af", fontSize: "0.75rem" }}>
                      Mood to set (–100…100) — updates face on page
                    </label>
                    <input
                      style={inputStyle}
                      type="number"
                      min={MIN_MOOD}
                      max={MAX_MOOD}
                      value={editMood}
                      onChange={(e) => setEditMood(e.target.value)}
                      aria-label="Set mood from negative 100 to 100"
                    />
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                      <button
                        type="submit"
                        disabled={updateChar.isPending}
                        style={{
                          padding: "0.5rem 1rem",
                          borderRadius: "0.5rem",
                          border: "none",
                          background: "#22c55e",
                          color: "#fff",
                          cursor: "pointer",
                        }}
                      >
                        Save mood &amp; details
                      </button>
                      <button
                        type="button"
                        onClick={cancelEdit}
                        style={{
                          padding: "0.5rem 1rem",
                          borderRadius: "0.5rem",
                          border: "1px solid #374151",
                          background: "transparent",
                          color: "#888",
                          cursor: "pointer",
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                    {updateChar.isError && (
                      <span style={{ color: "#f87171", fontSize: "0.875rem" }}>
                        {updateChar.error.message}
                      </span>
                    )}
                  </form>
                ) : (
                  <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "0.75rem", justifyContent: "space-between" }}>
                    <div>
                      <Link href={`/${c.slug}`} style={{ color: "#a78bfa", fontWeight: 600 }}>
                        /{c.slug}
                      </Link>
                      {c.name && (
                        <span style={{ color: "#888", marginLeft: "0.5rem", fontSize: "0.875rem" }}>
                          {c.name}
                        </span>
                      )}
                      <div style={{ color: "#e5e7eb", marginTop: "0.25rem" }}>
                        Mood set to: <strong>{c.mood}</strong>
                        <span style={{ color: "#6b7280", fontSize: "0.75rem", marginLeft: "0.35rem" }}>
                          (edit to change mood)
                        </span>
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                      <button
                        type="button"
                        onClick={() => startEdit(c)}
                        style={{
                          padding: "0.4rem 0.75rem",
                          fontSize: "0.875rem",
                          borderRadius: "0.5rem",
                          border: "1px solid #374151",
                          background: "transparent",
                          color: "#ccc",
                          cursor: "pointer",
                        }}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (confirm(`Delete character /${c.slug}?`)) {
                            deleteChar.mutate(c.id);
                          }
                        }}
                        disabled={deleteChar.isPending}
                        style={{
                          padding: "0.4rem 0.75rem",
                          fontSize: "0.875rem",
                          borderRadius: "0.5rem",
                          border: "none",
                          background: "#7f1d1d",
                          color: "#fca5a5",
                          cursor: "pointer",
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Global mood — used by Friend page / legacy chart */}
      <section
        style={{
          background: "rgba(255,255,255,0.05)",
          borderRadius: "0.5rem",
          padding: "2rem",
          minWidth: "320px",
        }}
      >
        <h2 style={{ fontSize: "1rem", marginBottom: "1rem", color: "#ccc" }}>
          Global mood (Friend page)
        </h2>
        <p style={{ marginBottom: "1rem", color: "#888", fontSize: "0.875rem" }}>
          Current mood: {globalLoading ? "…" : globalMood?.mood ?? 0} — separate from per-character
          mood. Use the field below to <strong style={{ color: "#d1d5db" }}>set mood</strong> for the
          Friend page only.
        </p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (globalValid) {
              setGlobalMood(globalNum);
              setGlobalValue("0");
            }
          }}
          style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
        >
          <label htmlFor="global-mood-input" style={{ color: "#9ca3af", fontSize: "0.875rem" }}>
            Set mood value ({MIN_MOOD} to {MAX_MOOD})
          </label>
          <input
            id="global-mood-input"
            type="number"
            min={MIN_MOOD}
            max={MAX_MOOD}
            value={globalValue}
            onChange={(e) => setGlobalValue(e.target.value)}
            style={inputStyle}
            aria-label="Set global mood from negative 100 to 100"
          />
          <button
            type="submit"
            disabled={globalPending || !globalValid}
            style={{
              padding: "0.75rem 1.5rem",
              fontWeight: 600,
              borderRadius: "0.5rem",
              border: "none",
              background: globalValid ? "#7c3aed" : "#374151",
              color: "#fff",
              cursor: globalPending || !globalValid ? "not-allowed" : "pointer",
            }}
          >
            {globalPending ? "Saving…" : "Set global mood"}
          </button>
        </form>
      </section>
    </main>
  );
}
