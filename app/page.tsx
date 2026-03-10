"use client";

import { useCharacters } from "@/hooks/useCharacters";
import Link from "next/link";

export default function HomePage() {
  const { data: characters, isLoading: charactersLoading } = useCharacters();

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "2rem 1rem",
        gap: "1.5rem",
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

      <section
        style={{
          width: "100%",
          maxWidth: "720px",
          background: "rgba(255,255,255,0.05)",
          borderRadius: "0.5rem",
          padding: "1rem",
        }}
      >
        <h2
          style={{
            fontSize: "0.875rem",
            color: "#888",
            marginBottom: "0.75rem",
          }}
        >
          Characters
        </h2>
        {charactersLoading ? (
          <p style={{ color: "#666", fontSize: "0.875rem" }}>Loading…</p>
        ) : !characters?.length ? (
          <p style={{ color: "#666", fontSize: "0.875rem" }}>
            No characters yet. Add some in Admin.
          </p>
        ) : (
          <ul
            style={{
              listStyle: "none",
              padding: 0,
              margin: 0,
              display: "flex",
              flexDirection: "column",
              gap: "0.5rem",
            }}
          >
            {characters.map((c) => {
              const label = c.name?.trim() || c.slug;
              return (
                <li
                  key={c.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "1rem",
                    padding: "0.5rem 0.75rem",
                    background: "rgba(0,0,0,0.15)",
                    borderRadius: "0.375rem",
                  }}
                >
                  <Link
                    href={`/${c.slug}`}
                    style={{
                      color: "#e5e7eb",
                      textDecoration: "none",
                      fontWeight: 500,
                      flex: 1,
                      minWidth: 0,
                    }}
                  >
                    {label}
                  </Link>
                  <Link
                    href={`/${c.slug}/chart`}
                    style={{
                      color: "#a78bfa",
                      textDecoration: "none",
                      fontSize: "0.875rem",
                      whiteSpace: "nowrap",
                    }}
                  >
                    Chart →
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <footer
        style={{
          marginTop: "auto",
          paddingTop: "2rem",
          paddingBottom: "1rem",
        }}
      >
        <a
          href="https://github.com/Neobii/PartyVibe2"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            color: "#6b7280",
            fontSize: "0.875rem",
            textDecoration: "none",
          }}
        >
          GitHub — Neobii/PartyVibe2
        </a>
      </footer>
    </main>
  );
}
