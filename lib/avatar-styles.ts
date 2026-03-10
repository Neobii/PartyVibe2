export const AVATAR_STYLES = [
  { id: "party-blob", label: "Party blob — hat & gradient blob" },
  { id: "circuit-bot", label: "Circuit bot — robot face & antenna" },
  { id: "cosmic-orb", label: "Cosmic orb — planet rings & glow" },
] as const;

export type AvatarStyleId = (typeof AVATAR_STYLES)[number]["id"];

const ALLOWED = new Set<string>(AVATAR_STYLES.map((s) => s.id));

export const DEFAULT_AVATAR_STYLE: AvatarStyleId = "party-blob";

export function isValidAvatarStyle(s: string): s is AvatarStyleId {
  return ALLOWED.has(s);
}

export function normalizeAvatarStyle(s: string | null | undefined): AvatarStyleId {
  if (s && isValidAvatarStyle(s)) return s;
  return DEFAULT_AVATAR_STYLE;
}
