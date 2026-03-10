"use client";

export type MoodExpression =
  | "thinking"
  | "neutral"
  | "happy"
  | "sad"
  | "ecstatic"
  | "devastated";

function moodToExpression(mood: number | undefined): MoodExpression {
  if (mood === undefined) return "thinking";
  if (mood > 40) return "ecstatic";
  if (mood >= 20) return "happy";
  if (mood >= 0) return "neutral";
  if (mood >= -20) return "sad";
  return "devastated";
}

type Props = {
  mood: number | undefined;
  isLoading: boolean;
  /** Base tint; expression still drives overall vibe */
  accentColor: string;
};

/**
 * Party blob: gradient body, party hat, eyes & mouth change with mood.
 */
export default function MoodCharacter({ mood, isLoading, accentColor }: Props) {
  const expression = isLoading ? "thinking" : moodToExpression(mood);

  // Gradient stops derived from accent
  const bodyGradientId = "blob-body";
  const glowId = "blob-glow";

  const hatColors: Record<MoodExpression, { main: string; band: string; pom: string }> = {
    thinking: { main: "#6b7280", band: "#4b5563", pom: "#9ca3af" },
    neutral: { main: "#a78bfa", band: "#7c3aed", pom: "#fbbf24" },
    happy: { main: "#22c55e", band: "#16a34a", pom: "#fde047" },
    sad: { main: "#60a5fa", band: "#3b82f6", pom: "#93c5fd" },
    ecstatic: { main: "#a855f7", band: "#7c3aed", pom: "#f472b6" },
    devastated: { main: "#2563eb", band: "#1d4ed8", pom: "#64748b" },
  };
  const hat = hatColors[expression];

  return (
    <div
      className="mood-character-float"
      style={{
        width: 220,
        height: 240,
        position: "relative",
        filter: expression === "ecstatic" ? "drop-shadow(0 0 20px rgba(168,85,247,0.5))" : undefined,
      }}
    >
      <svg
        viewBox="0 0 200 220"
        width="100%"
        height="100%"
        aria-hidden
        style={{ overflow: "visible" }}
      >
        <defs>
          <linearGradient id={bodyGradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={accentColor} stopOpacity={0.95} />
            <stop offset="100%" stopColor={accentColor} stopOpacity={0.65} />
          </linearGradient>
          <filter id={glowId} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Soft shadow under blob */}
        <ellipse cx="100" cy="205" rx="55" ry="10" fill="rgba(0,0,0,0.35)" />

        {/* Main blob body — rounded organic shape */}
        <path
          d="M100 28
             C145 28 175 58 175 105
             C175 152 145 188 100 195
             C55 188 25 152 25 105
             C25 58 55 28 100 28 Z"
          fill={`url(#${bodyGradientId})`}
          stroke="rgba(0,0,0,0.25)"
          strokeWidth="3"
          filter={expression === "ecstatic" ? `url(#${glowId})` : undefined}
        />

        {/* Party hat */}
        <g transform="translate(100, 28)">
          <path d="M0 -8 L28 42 L-28 42 Z" fill={hat.main} stroke="rgba(0,0,0,0.2)" strokeWidth="1.5" />
          <path d="M-26 38 L26 38 L24 44 L-24 44 Z" fill={hat.band} />
          <circle cx="0" cy="-6" r="6" fill={hat.pom} />
          <circle cx="-2" cy="-8" r="2" fill="rgba(255,255,255,0.5)" />
        </g>

        {/* Face group — centered in blob */}
        <g transform="translate(100, 118)">
          <Eyes expression={expression} />
          <Mouth expression={expression} />
        </g>

        {/* Ecstatic sparkles */}
        {expression === "ecstatic" && (
          <g fill="#fde047" opacity={0.9}>
            <polygon points="165,50 167,55 172,55 168,58 170,63 165,60 160,63 162,58 158,55 163,55" />
            <polygon points="35,75 37,80 42,80 38,83 40,88 35,85 30,88 32,83 28,80 33,80" />
            <circle cx="178" cy="95" r="3" />
            <circle cx="22" cy="130" r="2.5" />
          </g>
        )}

        {/* Sad tear */}
        {expression === "sad" && (
          <path
            d="M125 135 Q128 150 125 162"
            fill="none"
            stroke="rgba(96,165,250,0.8)"
            strokeWidth="3"
            strokeLinecap="round"
          />
        )}
        {expression === "devastated" && (
          <>
            <path
              d="M122 132 Q125 155 120 168 M78 132 Q75 155 80 168"
              fill="none"
              stroke="rgba(147,197,253,0.7)"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </>
        )}
      </svg>
    </div>
  );
}

function Eyes({ expression }: { expression: MoodExpression }) {
  switch (expression) {
    case "thinking":
      return (
        <g fill="rgba(0,0,0,0.75)">
          <circle cx="-22" cy="-8" r="5" />
          <circle cx="22" cy="-12" r="5" />
        </g>
      );
    case "neutral":
      return (
        <g fill="rgba(0,0,0,0.8)">
          <ellipse cx="-20" cy="0" rx="8" ry="10" />
          <ellipse cx="20" cy="0" rx="8" ry="10" />
        </g>
      );
    case "happy":
      return (
        <g fill="none" stroke="rgba(0,0,0,0.85)" strokeWidth="4" strokeLinecap="round">
          <path d="M-32 -5 Q-20 12 -8 -5" />
          <path d="M8 -5 Q20 12 32 -5" />
        </g>
      );
    case "sad":
      return (
        <g fill="rgba(0,0,0,0.75)">
          <path d="M-32 5 Q-20 -8 -8 5" fill="none" stroke="rgba(0,0,0,0.85)" strokeWidth="4" strokeLinecap="round" />
          <path d="M8 5 Q20 -8 32 5" fill="none" stroke="rgba(0,0,0,0.85)" strokeWidth="4" strokeLinecap="round" />
        </g>
      );
    case "ecstatic":
      // Star-shaped sparkles as eyes
      return (
        <g fill="#1f2937">
          <path d="M-24 -12 L-21 -4 L-28 2 L-20 2 L-18 10 L-14 2 L-6 2 L-12 -4 L-10 -12 L-18 -6 Z" />
          <path d="M24 -12 L21 -4 L28 2 L20 2 L18 10 L14 2 L6 2 L12 -4 L10 -12 L18 -6 Z" />
        </g>
      );
    case "devastated":
      return (
        <g fill="none" stroke="rgba(0,0,0,0.7)" strokeWidth="3" strokeLinecap="round">
          <path d="M-28 0 L-12 0" />
          <path d="M12 0 L28 0" />
        </g>
      );
    default:
      return null;
  }
}

function Mouth({ expression }: { expression: MoodExpression }) {
  const stroke = "rgba(0,0,0,0.82)";
  switch (expression) {
    case "thinking":
      return <circle cx="0" cy="22" r="4" fill={stroke} />;
    case "neutral":
      return <path d="M-18 18 L18 18" stroke={stroke} strokeWidth="4" strokeLinecap="round" fill="none" />;
    case "happy":
      return <path d="M-22 12 Q0 38 22 12" fill="none" stroke={stroke} strokeWidth="4" strokeLinecap="round" />;
    case "sad":
      return <path d="M-20 28 Q0 8 20 28" fill="none" stroke={stroke} strokeWidth="4" strokeLinecap="round" />;
    case "ecstatic":
      return (
        <path
          d="M-28 5 Q0 52 28 5"
          fill="rgba(0,0,0,0.15)"
          stroke={stroke}
          strokeWidth="3"
          strokeLinecap="round"
        />
      );
    case "devastated":
      return (
        <path
          d="M-24 15 Q0 35 24 15 Q0 28 -24 15"
          fill="rgba(0,0,0,0.12)"
          stroke={stroke}
          strokeWidth="3"
          strokeLinejoin="round"
        />
      );
    default:
      return null;
  }
}
