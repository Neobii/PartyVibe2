"use client";

import { useMood } from "@/hooks/useMood";
import Link from "next/link";

function getCharacter(mood: number | undefined) {
  if (mood === undefined) {
    return { face: "🤔", label: "thinking", color: "#9ca3af" };
  }

  if (mood >= 20 && mood <= 40) {
    return { face: "😄", label: "happy", color: "#22c55e" };
  }

  if (mood >= 0 && mood < 20) {
    return { face: "😐", label: "neutral", color: "#e5e7eb" };
  }

  if (mood <= -1 && mood >= -20) {
    return { face: "😢", label: "sad", color: "#60a5fa" };
  }

  // Outside the specified ranges, exaggerate mood
  if (mood > 40) {
    return { face: "🤩", label: "very happy", color: "#a855f7" };
  }

  return { face: "😭", label: "very sad", color: "#2563eb" };
}

export default function CharacterPage() {
  const { data, isLoading } = useMood();
  const mood = data?.mood;
  const { face, label, color } = getCharacter(isLoading ? undefined : mood);

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
      <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
        <Link
          href="/"
          style={{ color: "#a78bfa", textDecoration: "none", fontSize: "0.875rem" }}
        >
          ← Home
        </Link>
        <h1 style={{ fontSize: "1.5rem", fontWeight: 600 }}>Mood Character</h1>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "1rem",
        }}
      >
        <div
          style={{
            width: "180px",
            height: "180px",
            borderRadius: "999px",
            background: color,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 20px 40px rgba(0,0,0,0.4)",
            border: "4px solid rgba(0,0,0,0.3)",
          }}
        >
          <span style={{ fontSize: "96px" }}>{face}</span>
        </div>
        <p style={{ color: "#e5e7eb", fontSize: "1rem" }}>
          Mood: {isLoading ? "…" : mood ?? 0} ({label})
        </p>
        <p style={{ color: "#9ca3af", fontSize: "0.875rem", maxWidth: "320px", textAlign: "center" }}>
          Ranges: 0–20 = neutral, 20–40 = happy, -1 – -20 = sad. Outside those ranges the
          character becomes very expressive.
        </p>
      </div>
    </main>
  );
}

