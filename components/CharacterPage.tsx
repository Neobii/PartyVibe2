"use client";

import { useMood } from "@/hooks/useMood";
import { useUpdateMood } from "@/hooks/useUpdateMood";
import MoodCharacter from "@/components/MoodCharacter";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

function getCharacter(mood: number | undefined) {
  if (mood === undefined) {
    return { label: "thinking", color: "#9ca3af" };
  }
  if (mood >= 20 && mood <= 40) {
    return { label: "happy", color: "#22c55e" };
  }
  if (mood >= 0 && mood < 20) {
    return { label: "neutral", color: "#e5e7eb" };
  }
  if (mood <= -1 && mood >= -20) {
    return { label: "sad", color: "#60a5fa" };
  }
  if (mood > 40) {
    return { label: "very happy", color: "#a855f7" };
  }
  return { label: "very sad", color: "#2563eb" };
}

const FEEDBACK_DURATION_MS = 5000;

type Props = {
  characterSlug: string;
  /** Shown in the page title; falls back to slug if name is empty */
  characterName: string;
};

export default function CharacterPage({ characterSlug, characterName }: Props) {
  const { data, isLoading } = useMood(characterSlug);
  const { mutate: updateMood, isPending: isUpdating } = useUpdateMood(characterSlug);
  const mood = data?.mood;
  const { label, color } = getCharacter(isLoading ? undefined : mood);

  const [feedback, setFeedback] = useState<"up" | "down" | null>(null);
  const [feedbackAt, setFeedbackAt] = useState<Date | null>(null);
  const feedbackTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearFeedbackTimeout = useCallback(() => {
    if (feedbackTimeoutRef.current) {
      clearTimeout(feedbackTimeoutRef.current);
      feedbackTimeoutRef.current = null;
    }
  }, []);

  const showFeedback = useCallback(
    (direction: "up" | "down") => {
      clearFeedbackTimeout();
      const now = new Date();
      setFeedback(direction);
      setFeedbackAt(now);
      feedbackTimeoutRef.current = setTimeout(() => {
        setFeedback(null);
        setFeedbackAt(null);
        feedbackTimeoutRef.current = null;
      }, FEEDBACK_DURATION_MS);
    },
    [clearFeedbackTimeout]
  );

  const handleThumbsUp = useCallback(() => {
    updateMood(1, { onSuccess: () => showFeedback("up") });
  }, [updateMood, showFeedback]);

  const handleThumbsDown = useCallback(() => {
    updateMood(0, { onSuccess: () => showFeedback("down") });
  }, [updateMood, showFeedback]);

  useEffect(() => () => clearFeedbackTimeout(), [clearFeedbackTimeout]);

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
      <div style={{ display: "flex", gap: "1rem", alignItems: "center", flexWrap: "wrap" }}>
        <Link
          href="/"
          style={{ color: "#a78bfa", textDecoration: "none", fontSize: "0.875rem" }}
        >
          ← Home
        </Link>
        <Link
          href={`/${characterSlug}/chart`}
          style={{ color: "#a78bfa", textDecoration: "none", fontSize: "0.875rem" }}
        >
          Mood chart
        </Link>
        <h1 style={{ fontSize: "1.5rem", fontWeight: 600 }}>{characterName}</h1>
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
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "0.5rem",
          }}
        >
          <MoodCharacter
            mood={isLoading ? undefined : mood}
            isLoading={isLoading}
            accentColor={color}
          />
        </div>
        <p style={{ color: "#e5e7eb", fontSize: "1rem" }}>
          Mood: {isLoading ? "…" : mood ?? 0} ({label})
        </p>

        <div style={{ display: "flex", gap: "1.5rem", alignItems: "center" }}>
          <button
            type="button"
            onClick={handleThumbsUp}
            disabled={isUpdating}
            style={{
              padding: "0.75rem 1.25rem",
              fontSize: "1.5rem",
              border: "2px solid rgba(255,255,255,0.3)",
              borderRadius: "12px",
              background: "rgba(34, 197, 94, 0.2)",
              cursor: isUpdating ? "not-allowed" : "pointer",
              opacity: isUpdating ? 0.6 : 1,
            }}
            aria-label="Thumbs up — increment mood"
          >
            👍
          </button>
          <button
            type="button"
            onClick={handleThumbsDown}
            disabled={isUpdating}
            style={{
              padding: "0.75rem 1.25rem",
              fontSize: "1.5rem",
              border: "2px solid rgba(255,255,255,0.3)",
              borderRadius: "12px",
              background: "rgba(239, 68, 68, 0.2)",
              cursor: isUpdating ? "not-allowed" : "pointer",
              opacity: isUpdating ? 0.6 : 1,
            }}
            aria-label="Thumbs down — decrement mood"
          >
            👎
          </button>
        </div>

        {feedback && feedbackAt && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "0.25rem",
              padding: "1rem",
              borderRadius: "12px",
              background: "rgba(0,0,0,0.3)",
            }}
          >
            <span style={{ fontSize: "2.5rem" }}>{feedback === "up" ? "👍" : "👎"}</span>
            <span style={{ color: "#9ca3af", fontSize: "0.75rem" }}>
              {feedback === "up" ? "+1" : "-1"} at {feedbackAt.toLocaleTimeString()}
            </span>
          </div>
        )}

        <p style={{ color: "#9ca3af", fontSize: "0.875rem", maxWidth: "320px", textAlign: "center" }}>
          Ranges: 0–20 = neutral, 20–40 = happy, -1 – -20 = sad. Outside those ranges the
          character becomes very expressive.
        </p>
      </div>
    </main>
  );
}
