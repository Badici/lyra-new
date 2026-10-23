import { describe, expect, it } from "vitest";
import { formatRon, fromBani, multiplyBani, sumBani, toBani } from "@/lib/money";

describe("money", () => {
  it("converts RON to bani without float drift for common prices", () => {
    expect(toBani(19.99)).toBe(1999);
    expect(toBani(0.1)).toBe(10);
    expect(fromBani(1999)).toBe(19.99);
  });

  it("multiplies and sums in integer bani", () => {
    expect(multiplyBani(1999, 3)).toBe(5997);
    expect(sumBani([100, 250, 50])).toBe(400);
  });

  it("formats RON for Romanian locale", () => {
    const label = formatRon(2599);
    expect(label).toContain("25");
    expect(label).toMatch(/RON|lei/i);
  });

  it("rejects non-integer quantity", () => {
    expect(() => multiplyBani(100, 1.5)).toThrow();
  });
});
