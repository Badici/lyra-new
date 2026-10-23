import { describe, expect, it } from "vitest";
import { slugify, uniqueSlug } from "@/lib/slug";

describe("slugify", () => {
  it("handles Romanian diacritics", () => {
    expect(slugify("Povestea noastră")).toBe("povestea-noastra");
    expect(slugify("Nadă & aditivi")).toBe("nada-aditivi");
  });

  it("creates unique slugs", () => {
    const existing = new Set(["produs", "produs-2"]);
    expect(uniqueSlug("Produs", existing)).toBe("produs-3");
  });
});
