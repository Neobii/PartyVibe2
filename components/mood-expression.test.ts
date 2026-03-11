import { describe, it, expect } from "vitest";
import { moodToExpression } from "./mood-expression";

describe("moodToExpression", () => {
  it("undefined -> thinking", () => {
    expect(moodToExpression(undefined)).toBe("thinking");
  });

  it("mood > 40 -> ecstatic", () => {
    expect(moodToExpression(41)).toBe("ecstatic");
    expect(moodToExpression(100)).toBe("ecstatic");
  });

  it("20 <= mood <= 40 -> happy", () => {
    expect(moodToExpression(20)).toBe("happy");
    expect(moodToExpression(30)).toBe("happy");
    expect(moodToExpression(40)).toBe("happy");
  });

  it("0 <= mood < 20 -> neutral", () => {
    expect(moodToExpression(0)).toBe("neutral");
    expect(moodToExpression(10)).toBe("neutral");
    expect(moodToExpression(19)).toBe("neutral");
  });

  it("-20 <= mood <= -1 -> sad", () => {
    expect(moodToExpression(-1)).toBe("sad");
    expect(moodToExpression(-10)).toBe("sad");
    expect(moodToExpression(-20)).toBe("sad");
  });

  it("mood < -20 -> devastated", () => {
    expect(moodToExpression(-21)).toBe("devastated");
    expect(moodToExpression(-100)).toBe("devastated");
  });
});
