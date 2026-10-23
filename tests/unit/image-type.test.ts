import { describe, expect, it } from "vitest";
import { detectImageType, isHeicImage } from "@/server/media/image-type";

const PNG = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==",
  "base64",
);

describe("detectImageType", () => {
  it("recognizes a png from its bytes", () => {
    expect(detectImageType(PNG)).toEqual({ contentType: "image/png", ext: "png" });
  });

  it("rejects a file that only claims to be an image", () => {
    expect(detectImageType(Buffer.from("not an image"))).toBeNull();
  });

  it("recognizes a heic brand", () => {
    const bytes = Buffer.alloc(12);
    bytes.write("ftyp", 4, "ascii");
    bytes.write("heic", 8, "ascii");
    expect(isHeicImage(bytes)).toBe(true);
  });
});
