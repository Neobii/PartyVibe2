"use client";

import { useMood } from "@/hooks/useMood";
import { useSetMood } from "@/hooks/useSetMood";
import Link from "next/link";
import { useState } from "react";

export default function AdminPage() {
  const { data, isLoading } = useMood();
  const { mutate, isPending, isSuccess } = useSetMood();
  const [value, setValue] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseInt(value, 10);
    if (Number.isInteger(num)) {
      mutate(num);
      setValue("");
    }
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
      <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
        <Link
          href="/"
          style={{ color: "#a78bfa", textDecoration: "none", fontSize: "0.875rem" }}
        >
          ← Home
        </Link>
        <h1 style={{ fontSize: "1.5rem", fontWeight: 600 }}>Admin Panel</h1>
      </div>

      <section
        style={{
          background: "rgba(255,255,255,0.05)",
          borderRadius: "0.5rem",
          padding: "2rem",
          minWidth: "280px",
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
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <input
            type="number"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Enter mood value"
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
            disabled={isPending}
            style={{
              padding: "0.75rem 1.5rem",
              fontSize: "1rem",
              fontWeight: 600,
              borderRadius: "0.5rem",
              border: "none",
              background: "#7c3aed",
              color: "#fff",
              cursor: isPending ? "not-allowed" : "pointer",
              opacity: isPending ? 0.6 : 1,
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
