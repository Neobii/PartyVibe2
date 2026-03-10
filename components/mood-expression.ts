export type MoodExpression =
  | "thinking"
  | "neutral"
  | "happy"
  | "sad"
  | "ecstatic"
  | "devastated";

export function moodToExpression(mood: number | undefined): MoodExpression {
  if (mood === undefined) return "thinking";
  if (mood > 40) return "ecstatic";
  if (mood >= 20) return "happy";
  if (mood >= 0) return "neutral";
  if (mood >= -20) return "sad";
  return "devastated";
}
