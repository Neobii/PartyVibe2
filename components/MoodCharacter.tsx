"use client";

import type { AvatarStyleId } from "@/lib/avatar-styles";
import { normalizeAvatarStyle } from "@/lib/avatar-styles";
import MoodCharacterPartyBlob from "@/components/MoodCharacterPartyBlob";
import MoodCharacterCircuitBot from "@/components/MoodCharacterCircuitBot";
import MoodCharacterCosmicOrb from "@/components/MoodCharacterCosmicOrb";

type Props = {
  mood: number | undefined;
  isLoading: boolean;
  accentColor: string;
  avatarStyle?: string | null;
};

export default function MoodCharacter({ mood, isLoading, accentColor, avatarStyle }: Props) {
  const style = normalizeAvatarStyle(avatarStyle);

  switch (style) {
    case "circuit-bot":
      return <MoodCharacterCircuitBot mood={mood} isLoading={isLoading} accentColor={accentColor} />;
    case "cosmic-orb":
      return <MoodCharacterCosmicOrb mood={mood} isLoading={isLoading} accentColor={accentColor} />;
    case "party-blob":
    default:
      return <MoodCharacterPartyBlob mood={mood} isLoading={isLoading} accentColor={accentColor} />;
  }
}
