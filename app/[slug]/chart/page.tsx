"use client";

import { useCharacterMoodHistory } from "@/hooks/useCharacterMoodHistory";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function CharacterChartPage() {
  const params = useParams();
  const slug = typeof params?.slug === "string" ? params.slug : "";
  const { data, isLoading, isError } = useCharacterMoodHistory(slug);

  const chartData =
    data?.history.map((e) => ({
      mood: e.mood,
      time: new Date(e.createdAt).toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
      fullTime: new Date(e.createdAt).toISOString(),
    })) ?? [];

  if (!slug) {
    return null;
  }

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
      <div style={{ display: "flex", gap: "1rem", alignItems: "center", flexWrap: "wrap" }}>
        <Link
          href="/"
          style={{ color: "#a78bfa", textDecoration: "none", fontSize: "0.875rem" }}
        >
          ← Home
        </Link>
        <Link
          href={`/${slug}`}
          style={{ color: "#a78bfa", textDecoration: "none", fontSize: "0.875rem" }}
        >
          ← Character
        </Link>
        <h1 style={{ fontSize: "1.5rem", fontWeight: 600 }}>Mood over time</h1>
        <span style={{ color: "#6b7280", fontSize: "0.875rem" }}>/{slug}/chart</span>
      </div>

      <section
        style={{
          width: "100%",
          maxWidth: "720px",
          height: "360px",
          background: "rgba(255,255,255,0.05)",
          borderRadius: "0.5rem",
          padding: "1rem",
        }}
      >
        <h2
          style={{
            fontSize: "0.875rem",
            color: "#888",
            marginBottom: "0.5rem",
          }}
        >
          {slug} — mood history
        </h2>
        {isLoading ? (
          <div
            style={{
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#666",
            }}
          >
            Loading…
          </div>
        ) : isError ? (
          <div
            style={{
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#f87171",
              fontSize: "0.875rem",
            }}
          >
            Character not found or failed to load history.
          </div>
        ) : chartData.length === 0 ? (
          <div
            style={{
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#666",
              fontSize: "0.875rem",
            }}
          >
            No mood history yet. Change mood on the character page or in admin.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="90%">
            <LineChart
              data={chartData}
              margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis
                dataKey="time"
                stroke="#888"
                tick={{ fill: "#888", fontSize: 11 }}
              />
              <YAxis
                domain={["auto", "auto"]}
                stroke="#888"
                tick={{ fill: "#888", fontSize: 11 }}
              />
              <Tooltip
                contentStyle={{
                  background: "#1f2937",
                  border: "1px solid #374151",
                  borderRadius: "0.5rem",
                }}
                labelStyle={{ color: "#ccc" }}
                formatter={(value: number) => [value, "mood"]}
                labelFormatter={(label, payload) =>
                  payload?.[0]?.payload?.fullTime
                    ? new Date(payload[0].payload.fullTime).toLocaleString()
                    : label
                }
              />
              <Line
                type="monotone"
                dataKey="mood"
                stroke="#a78bfa"
                strokeWidth={2}
                dot={{ fill: "#7c3aed", r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </section>
    </main>
  );
}
