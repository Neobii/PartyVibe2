import { describe, it, expect } from "vitest";
import {
  AVATAR_STYLES,
  DEFAULT_AVATAR_STYLE,
  isValidAvatarStyle,
  normalizeAvatarStyle,
  type AvatarStyleId,
} from "./avatar-styles";

describe("avatar-styles", () => {
  it("AVATAR_STYLES has three entries with id and label", () => {
    expect(AVATAR_STYLES).toHaveLength(3);
    for (const s of AVATAR_STYLES) {
      expect(s.id).toBeTruthy();
      expect(s.label).toBeTruthy();
    }
  });

  it("DEFAULT_AVATAR_STYLE is party-blob", () => {
    expect(DEFAULT_AVATAR_STYLE).toBe("party-blob");
  });

  describe("isValidAvatarStyle", () => {
    it("returns true for each allowed id", () => {
      for (const s of AVATAR_STYLES) {
        expect(isValidAvatarStyle(s.id)).toBe(true);
      }
    });

    it("returns false for unknown strings", () => {
      expect(isValidAvatarStyle("unknown")).toBe(false);
      expect(isValidAvatarStyle("")).toBe(false);
      expect(isValidAvatarStyle("PARTY-BLOB")).toBe(false);
    });

    it("narrows type when true", () => {
      const id: string = "party-blob";
      if (isValidAvatarStyle(id)) {
        const _x: AvatarStyleId = id;
        expect(_x).toBe("party-blob");
      }
    });
  });

  describe("normalizeAvatarStyle", () => {
    it("returns same id when valid", () => {
      expect(normalizeAvatarStyle("circuit-bot")).toBe("circuit-bot");
      expect(normalizeAvatarStyle("cosmic-orb")).toBe("cosmic-orb");
    });

    it("returns default for null, undefined, empty, invalid", () => {
      expect(normalizeAvatarStyle(null)).toBe(DEFAULT_AVATAR_STYLE);
      expect(normalizeAvatarStyle(undefined)).toBe(DEFAULT_AVATAR_STYLE);
      expect(normalizeAvatarStyle("")).toBe(DEFAULT_AVATAR_STYLE);
      expect(normalizeAvatarStyle("nope")).toBe(DEFAULT_AVATAR_STYLE);
    });
  });
});
