"use client";

import type { MoodExpression } from "@/components/mood-expression";
import { moodToExpression } from "@/components/mood-expression";

type Props = { mood: number | undefined; isLoading: boolean; accentColor: string };

const ledColor: Record<MoodExpression, string> = {
  thinking: "#9ca3af",
  neutral: "#a78bfa",
  happy: "#4ade80",
  sad: "#60a5fa",
  ecstatic: "#f472b6",
  devastated: "#64748b",
};

export default function MoodCharacterCircuitBot({ mood, isLoading, accentColor }: Props) {
  const expression = isLoading ? "thinking" : moodToExpression(mood);
  const gid = "bot-metal";
  const led = ledColor[expression];

  return (
    <div
      className="mood-character-float"
      style={{ width: 220, height: 240, position: "relative" }}
    >
      <svg viewBox="0 0 200 220" width="100%" height="100%" aria-hidden style={{ overflow: "visible" }}>
        <defs>
          <linearGradient id={gid} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#475569" />
            <stop offset="50%" stopColor="#334155" />
            <stop offset="100%" stopColor="#1e293b" />
          </linearGradient>
        </defs>
        <ellipse cx="100" cy="208" rx="50" ry="8" fill="rgba(0,0,0,0.35)" />

        {/* Antennae */}
        <line x1="70" y1="48" x2="70" y2="22" stroke="#64748b" strokeWidth="4" strokeLinecap="round" />
        <circle cx="70" cy="18" r="6" fill={led} opacity={expression === "ecstatic" ? 1 : 0.85} />
        <line x1="130" y1="48" x2="130" y2="22" stroke="#64748b" strokeWidth="4" strokeLinecap="round" />
        <circle cx="130" cy="18" r="6" fill={led} opacity={expression === "ecstatic" ? 1 : 0.85} />

        {/* Head — rounded rect */}
        <rect
          x="40"
          y="48"
          width="120"
          height="130"
          rx="24"
          ry="24"
          fill={`url(#${gid})`}
          stroke={accentColor}
          strokeWidth="4"
          opacity={0.95}
        />
        {/* Screen bezel */}
        <rect x="52" y="62" width="96" height="90" rx="12" fill="#0f172a" stroke="#334155" strokeWidth="2" />
        {/* Screen face */}
        <g transform="translate(100, 108)">
          <BotFace expression={expression} accent={accentColor} />
        </g>
        {/* Chest panel */}
        <rect x="75" y="168" width="50" height="18" rx="4" fill="#0f172a" stroke={accentColor} strokeWidth="2" opacity={0.8} />
        <rect x="82" y="173" width="10" height="8" rx="1" fill={led} opacity={0.6} />
        <rect x="95" y="173" width="10" height="8" rx="1" fill={led} opacity={0.8} />
        <rect x="108" y="173" width="10" height="8" rx="1" fill={led} opacity={0.6} />
      </svg>
    </div>
  );
}

function BotFace({ expression, accent }: { expression: MoodExpression; accent: string }) {
  const cyan = "#22d3ee";
  switch (expression) {
    case "thinking":
      return (
        <g>
          <circle cx="-22" cy="-8" r="5" fill={cyan} />
          <circle cx="22" cy="-12" r="5" fill={cyan} />
          <circle cx="0" cy="18" r="3" fill={cyan} opacity={0.7} />
        </g>
      );
    case "neutral":
      return (
        <g>
          <rect x="-28" y="-6" width="16" height="12" rx="2" fill={cyan} />
          <rect x="12" y="-6" width="16" height="12" rx="2" fill={cyan} />
          <line x1="-20" y1="22" x2="20" y2="22" stroke={cyan} strokeWidth="3" strokeLinecap="round" />
        </g>
      );
    case "happy":
      return (
        <g fill="none" stroke={cyan} strokeWidth="3" strokeLinecap="round">
          <path d="M-28 -4 Q-16 8 -4 -4" />
          <path d="M4 -4 Q16 8 28 -4" />
          <path d="M-22 14 Q0 32 22 14" />
        </g>
      );
    case "sad":
      return (
        <g fill="none" stroke={cyan} strokeWidth="3" strokeLinecap="round">
          <path d="M-28 4 Q-16 -8 -4 4" />
          <path d="M4 4 Q16 -8 28 4" />
          <path d="M-18 26 Q0 10 18 26" />
        </g>
      );
    case "ecstatic":
      return (
        <g>
          <path d="M-26 -10 L-20 2 L-28 2 L-16 12 L-8 2 L2 2 L-4 -10 L-12 0 Z" fill="#fde047" />
          <path d="M26 -10 L20 2 L28 2 L16 12 L8 2 L-2 2 L4 -10 L12 0 Z" fill="#fde047" />
          <path d="M-24 8 Q0 40 24 8" fill="none" stroke={accent} strokeWidth="4" strokeLinecap="round" />
        </g>
      );
    case "devastated":
      return (
        <g stroke={cyan} strokeWidth="2.5" strokeLinecap="round" fill="none">
          <path d="M-26 0 L-10 0 M10 0 L26 0" />
          <path d="M-20 20 Q0 8 20 20" />
        </g>
      );
    default:
      return null;
  }
}
