"use client";

import { useMood } from "@/hooks/useMood";
import { useSetMood } from "@/hooks/useSetMood";
import { useCharacterSlug } from "@/hooks/useCharacterSlug";
import { useSetCharacterSlug } from "@/hooks/useSetCharacterSlug";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { useState } from "react";

const MIN_MOOD = -100;
const MAX_MOOD = 100;

export default function AdminPage() {
  const { data, isLoading } = useMood();
  const { mutate, isPending, isSuccess } = useSetMood();
  const { data: characterSlug, isLoading: slugLoading } = useCharacterSlug();
  const {
    mutate: saveSlug,
    isPending: slugSaving,
    isSuccess: slugSaved,
    error: slugError,
    reset: resetSlugMutation,
  } = useSetCharacterSlug();
  const [value, setValue] = useState("0");
  const [slugInput, setSlugInput] = useState("");
  const [savedSlugMessage, setSavedSlugMessage] = useState<string | null>(null);

  const num = parseInt(value, 10);
  const isValid = !Number.isNaN(num) && num >= MIN_MOOD && num <= MAX_MOOD;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isValid) {
      mutate(num);
      setValue("");
    }
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "2rem",
        padding: "1rem",
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
        <Link
          href="/"
          style={{
            color: "#a78bfa",
            textDecoration: "none",
            fontSize: "0.875rem",
          }}
        >
          ← Home
        </Link>
        <h1 style={{ fontSize: "1.5rem", fontWeight: 600 }}>Admin Panel</h1>
        <button
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

      <section
        style={{
          background: "rgba(255,255,255,0.05)",
          borderRadius: "0.5rem",
          padding: "2rem",
          minWidth: "320px",
        }}
      >
        <h2 style={{ fontSize: "1rem", marginBottom: "1rem", color: "#ccc" }}>
          Set Mood
        </h2>
        <p
          style={{
            marginBottom: "1rem",
            color: "#888",
            fontSize: "0.875rem",
          }}
        >
          Current mood: {isLoading ? "…" : data?.mood ?? 0}
        </p>
        <p
          style={{
            marginBottom: "1rem",
            color: "#666",
            fontSize: "0.75rem",
          }}
        >
          Range: {MIN_MOOD} to {MAX_MOOD}
        </p>
        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
        >
          <div>
            <input
              type="range"
              min={MIN_MOOD}
              max={MAX_MOOD}
              value={Number.isNaN(num) ? 0 : Math.min(MAX_MOOD, Math.max(MIN_MOOD, num))}
              onChange={handleSliderChange}
              style={{
                width: "100%",
                height: "8px",
                accentColor: "#7c3aed",
              }}
            />
          </div>
          <input
            type="number"
            min={MIN_MOOD}
            max={MAX_MOOD}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Enter mood (-100 to 100)"
            required
            style={{
              padding: "0.75rem 1rem",
              fontSize: "1rem",
              borderRadius: "0.5rem",
              border: "1px solid #374151",
              background: "#1f2937",
              color: "#fff",
            }}
          />
          <button
            type="submit"
            disabled={isPending || !isValid}
            style={{
              padding: "0.75rem 1.5rem",
              fontSize: "1rem",
              fontWeight: 600,
              borderRadius: "0.5rem",
              border: "none",
              background: isValid ? "#7c3aed" : "#374151",
              color: "#fff",
              cursor: isPending || !isValid ? "not-allowed" : "pointer",
              opacity: isPending || !isValid ? 0.6 : 1,
            }}
          >
            {isPending ? "Saving…" : "Set Mood"}
          </button>
          {isSuccess && (
            <span style={{ color: "#22c55e", fontSize: "0.875rem" }}>
              Mood updated!
            </span>
          )}
        </form>
      </section>

      <section
        style={{
          background: "rgba(255,255,255,0.05)",
          borderRadius: "0.5rem",
          padding: "2rem",
          minWidth: "320px",
        }}
      >
        <h2 style={{ fontSize: "1rem", marginBottom: "1rem", color: "#ccc" }}>
          Character page slug
        </h2>
        <p
          style={{
            marginBottom: "1rem",
            color: "#888",
            fontSize: "0.875rem",
          }}
        >
          The mood character is only served at this path (e.g.{" "}
          <code style={{ color: "#a78bfa" }}>
            /{slugLoading ? "…" : characterSlug ?? "character"}
          </code>
          ).
        </p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            resetSlugMutation();
            const s = slugInput.trim() || characterSlug || "character";
            saveSlug(s, {
              onSuccess: (data) => {
                setSlugInput("");
                setSavedSlugMessage(data.slug);
              },
            });
          }}
          style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
        >
          <input
            type="text"
            value={slugInput}
            onChange={(e) => setSlugInput(e.target.value)}
            placeholder={characterSlug ?? "character"}
            style={{
              padding: "0.75rem 1rem",
              fontSize: "1rem",
              borderRadius: "0.5rem",
              border: "1px solid #374151",
              background: "#1f2937",
              color: "#fff",
            }}
          />
          <p style={{ color: "#666", fontSize: "0.75rem", margin: 0 }}>
            Letters, numbers, hyphens only. Not: admin, login, friend, api.
          </p>
          <button
            type="submit"
            disabled={slugSaving || slugLoading}
            style={{
              padding: "0.75rem 1.5rem",
              fontSize: "1rem",
              fontWeight: 600,
              borderRadius: "0.5rem",
              border: "none",
              background: "#7c3aed",
              color: "#fff",
              cursor: slugSaving || slugLoading ? "not-allowed" : "pointer",
              opacity: slugSaving || slugLoading ? 0.6 : 1,
            }}
          >
            {slugSaving ? "Saving…" : "Save slug"}
          </button>
          {slugSaved && savedSlugMessage && (
            <span style={{ color: "#22c55e", fontSize: "0.875rem" }}>
              Slug updated — open /{savedSlugMessage} for the character page.
            </span>
          )}
          {slugError && (
            <span style={{ color: "#f87171", fontSize: "0.875rem" }}>
              {slugError.message}
            </span>
          )}
        </form>
        {!slugLoading && characterSlug && (
          <Link
            href={`/${characterSlug}`}
            style={{
              display: "inline-block",
              marginTop: "1rem",
              color: "#a78bfa",
              fontSize: "0.875rem",
            }}
          >
            → Open character page
          </Link>
        )}
      </section>
    </main>
  );
}
