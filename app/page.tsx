"use client";

import { useMood } from "@/hooks/useMood";
import { useUpdateMood } from "@/hooks/useUpdateMood";
import Link from "next/link";

export default function Home() {
  const { data, isLoading } = useMood();
  const { mutate, isPending } = useUpdateMood();

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "2rem",
      }}
    >
      <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
        <h1 style={{ fontSize: "1.5rem", fontWeight: 600 }}>Party Vibe 2</h1>
        <Link
          href="/admin"
          style={{ color: "#a78bfa", textDecoration: "none", fontSize: "0.875rem" }}
        >
          Admin
        </Link>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "1rem",
        }}
      >
        <p
          style={{
            fontSize: "2rem",
            fontWeight: 700,
            color: isLoading ? "#666" : "#a78bfa",
          }}
        >
          {isLoading ? "…" : data?.mood ?? 0}
        </p>
        <span style={{ color: "#888", fontSize: "0.875rem" }}>mood</span>
      </div>

      <div style={{ display: "flex", gap: "1rem" }}>
        <button
          onClick={() => mutate(0)}
          disabled={isPending}
          style={{
            padding: "0.75rem 1.5rem",
            fontSize: "1rem",
            fontWeight: 600,
            borderRadius: "0.5rem",
            border: "none",
            background: "#374151",
            color: "#fff",
            cursor: isPending ? "not-allowed" : "pointer",
            opacity: isPending ? 0.6 : 1,
          }}
        >
          Decrement (0)
        </button>
        <button
          onClick={() => mutate(1)}
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
          Increment (1)
        </button>
      </div>
    </main>
  );
}
