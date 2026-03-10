"use client";

import MoodCharacter from "@/components/MoodCharacter";
import { AVATAR_STYLES } from "@/lib/avatar-styles";

/** Neutral band mood + neutral tint so previews match the “neutral” face */
const NEUTRAL_MOOD = 10;
const NEUTRAL_COLOR = "#e5e7eb";

type Props = {
  value: string;
  onChange: (id: string) => void;
  /** Unique name for radio group (e.g. create vs edit) */
  name: string;
};

/**
 * Radio group with a scaled-down neutral preview per avatar style.
 */
export default function AvatarStylePicker({ value, onChange, name }: Props) {
  return (
    <div
      role="radiogroup"
      aria-label="Character look"
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "0.75rem",
        gridColumn: "1 / -1",
      }}
    >
      {AVATAR_STYLES.map((s) => {
        const selected = value === s.id;
        return (
          <label
            key={s.id}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "0.35rem",
              padding: "0.5rem",
              borderRadius: "0.5rem",
              border: selected ? "2px solid #a78bfa" : "2px solid #374151",
              background: selected ? "rgba(167,139,250,0.12)" : "rgba(0,0,0,0.2)",
              cursor: "pointer",
              minWidth: "88px",
            }}
          >
            <input
              type="radio"
              name={name}
              value={s.id}
              checked={selected}
              onChange={() => onChange(s.id)}
              style={{ accentColor: "#a78bfa" }}
            />
            {/* Scaled neutral preview — clip overflow so only character shows */}
            <div
              className="avatar-picker-preview"
              style={{
                width: 72,
                height: 78,
                overflow: "hidden",
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "center",
                pointerEvents: "none",
              }}
            >
              <div
                style={{
                  transform: "scale(0.32)",
                  transformOrigin: "top center",
                  marginTop: "-4px",
                }}
              >
                <MoodCharacter
                  mood={NEUTRAL_MOOD}
                  isLoading={false}
                  accentColor={NEUTRAL_COLOR}
                  avatarStyle={s.id}
                />
              </div>
            </div>
            <span style={{ color: "#9ca3af", fontSize: "0.65rem", textAlign: "center", lineHeight: 1.2 }}>
              {s.id === "party-blob" && "Party blob"}
              {s.id === "circuit-bot" && "Circuit bot"}
              {s.id === "cosmic-orb" && "Cosmic orb"}
            </span>
          </label>
        );
      })}
    </div>
  );
}
