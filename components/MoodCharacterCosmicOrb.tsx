"use client";

import type { MoodExpression } from "@/components/mood-expression";
import { moodToExpression } from "@/components/mood-expression";

type Props = { mood: number | undefined; isLoading: boolean; accentColor: string };

export default function MoodCharacterCosmicOrb({ mood, isLoading, accentColor }: Props) {
  const expression = isLoading ? "thinking" : moodToExpression(mood);
  const gradId = "orb-grad";
  const ringGlow = expression === "ecstatic";

  return (
    <div
      className="mood-character-float"
      style={{
        width: 220,
        height: 240,
        position: "relative",
        filter: ringGlow ? "drop-shadow(0 0 18px rgba(251,191,36,0.45))" : undefined,
      }}
    >
      <svg viewBox="0 0 200 220" width="100%" height="100%" aria-hidden style={{ overflow: "visible" }}>
        <defs>
          <radialGradient id={gradId} cx="40%" cy="35%" r="65%">
            <stop offset="0%" stopColor={accentColor} stopOpacity={1} />
            <stop offset="70%" stopColor={accentColor} stopOpacity={0.75} />
            <stop offset="100%" stopColor="#1e1b4b" stopOpacity={0.9} />
          </radialGradient>
        </defs>
        <ellipse cx="100" cy="208" rx="58" ry="9" fill="rgba(0,0,0,0.35)" />

        {/* Back ring */}
        <ellipse
          cx="100"
          cy="125"
          rx="72"
          ry="18"
          fill="none"
          stroke={accentColor}
          strokeWidth="3"
          opacity={0.35}
          transform="rotate(-12 100 125)"
        />
        {/* Planet body */}
        <circle cx="100" cy="118" r="58" fill={`url(#${gradId})`} stroke="rgba(255,255,255,0.15)" strokeWidth="2" />
        {/* Front ring */}
        <ellipse
          cx="100"
          cy="125"
          rx="72"
          ry="18"
          fill="none"
          stroke={accentColor}
          strokeWidth={ringGlow ? 5 : 3}
          opacity={ringGlow ? 0.95 : 0.55}
          transform="rotate(-12 100 125)"
        />
        {/* Craters / texture dots */}
        <circle cx="78" cy="102" r="6" fill="rgba(0,0,0,0.12)" />
        <circle cx="122" cy="130" r="8" fill="rgba(0,0,0,0.1)" />
        <circle cx="95" cy="138" r="4" fill="rgba(0,0,0,0.08)" />

        <g transform="translate(100, 118)">
          <OrbFace expression={expression} />
        </g>

        {expression === "ecstatic" && (
          <g fill="#fde047" opacity={0.85}>
            <circle cx="168" cy="75" r="3" />
            <circle cx="32" cy="95" r="2.5" />
            <circle cx="175" cy="120" r="2" />
          </g>
        )}
        {expression === "sad" && (
          <path
            d="M128 138 Q131 155 127 172"
            fill="none"
            stroke="rgba(147,197,253,0.6)"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        )}
      </svg>
    </div>
  );
}

function OrbFace({ expression }: { expression: MoodExpression }) {
  const fill = "rgba(15,23,42,0.88)";
  const stroke = "rgba(15,23,42,0.9)";
  switch (expression) {
    case "thinking":
      return (
        <g fill={fill}>
          <circle cx="-20" cy="-12" r="5" />
          <circle cx="22" cy="-16" r="5" />
          <circle cx="0" cy="12" r="3" />
        </g>
      );
    case "neutral":
      return (
        <g fill={fill}>
          <ellipse cx="-18" cy="-6" rx="9" ry="11" />
          <ellipse cx="18" cy="-6" rx="9" ry="11" />
          <rect x="-16" y="16" width="32" height="3" rx="1" />
        </g>
      );
    case "happy":
      return (
        <g fill="none" stroke={stroke} strokeWidth="3.5" strokeLinecap="round">
          <path d="M-30 -6 Q-18 10 -6 -6" />
          <path d="M6 -6 Q18 10 30 -6" />
          <path d="M-22 10 Q0 36 22 10" />
        </g>
      );
    case "sad":
      return (
        <g fill="none" stroke={stroke} strokeWidth="3.5" strokeLinecap="round">
          <path d="M-30 4 Q-18 -10 -6 4" />
          <path d="M6 4 Q18 -10 30 4" />
          <path d="M-18 26 Q0 8 18 26" />
        </g>
      );
    case "ecstatic":
      return (
        <g>
          <circle cx="-20" cy="-8" r="8" fill="#fde047" opacity={0.95} />
          <circle cx="20" cy="-8" r="8" fill="#fde047" opacity={0.95} />
          <path
            d="M-26 6 Q0 48 26 6"
            fill="rgba(251,191,36,0.25)"
            stroke={stroke}
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </g>
      );
    case "devastated":
      return (
        <g fill="none" stroke={stroke} strokeWidth="2.5" strokeLinecap="round">
          <path d="M-26 2 L-10 2 M10 2 L26 2" />
          <path d="M-20 22 Q0 12 20 22 Q0 30 -20 22" fill="rgba(15,23,42,0.15)" />
        </g>
      );
    default:
      return null;
  }
}
