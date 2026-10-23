import { describe, expect, it } from "vitest";
import { absoluteMedia } from "@/lib/media-url";
import { formatViews } from "@/lib/views";

describe("formatViews", () => {
  it("uses the singular for one visit", () => {
    expect(formatViews(1)).toBe("1 vizită");
  });

  it("uses the plural otherwise", () => {
    expect(formatViews(0)).toBe("0 vizite");
    expect(formatViews(12)).toBe("12 vizite");
  });
});

describe("absoluteMedia", () => {
  it("keeps remote urls and prefixes site paths", () => {
    expect(absoluteMedia("https://cdn.example/a.jpg", "https://lyrabaits.ro")).toBe(
      "https://cdn.example/a.jpg",
    );
    expect(absoluteMedia("/exemple/nada.png", "https://lyrabaits.ro")).toBe(
      "https://lyrabaits.ro/exemple/nada.png",
    );
    expect(absoluteMedia(null, "https://lyrabaits.ro")).toBeUndefined();
  });
});
