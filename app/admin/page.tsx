"use client";

import { useMood } from "@/hooks/useMood";
import { useSetMood } from "@/hooks/useSetMood";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { useState } from "react";

const MIN_MOOD = -100;
const MAX_MOOD = 100;

export default function AdminPage() {
  const { data, isLoading } = useMood();
  const { mutate, isPending, isSuccess } = useSetMood();
  const [value, setValue] = useState("0");

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
    </main>
  );
}
