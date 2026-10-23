const SNIFFED = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
} as const;

export type StoredImageType = {
  contentType: keyof typeof SNIFFED;
  ext: (typeof SNIFFED)[keyof typeof SNIFFED];
};

function sniff(bytes: Buffer): StoredImageType | null {
  if (bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) {
    return { contentType: "image/jpeg", ext: "jpg" };
  }
  if (
    bytes.length >= 8 &&
    bytes[0] === 0x89 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x4e &&
    bytes[3] === 0x47
  ) {
    return { contentType: "image/png", ext: "png" };
  }
  if (bytes.length >= 6 && bytes.subarray(0, 3).toString("ascii") === "GIF") {
    return { contentType: "image/gif", ext: "gif" };
  }
  if (
    bytes.length >= 12 &&
    bytes.subarray(0, 4).toString("ascii") === "RIFF" &&
    bytes.subarray(8, 12).toString("ascii") === "WEBP"
  ) {
    return { contentType: "image/webp", ext: "webp" };
  }
  return null;
}

export function isHeicImage(bytes: Buffer, declared?: string): boolean {
  const type = declared?.toLowerCase() ?? "";
  if (type === "image/heic" || type === "image/heif") return true;
  if (bytes.length < 12) return false;
  if (bytes.subarray(4, 8).toString("ascii") !== "ftyp") return false;
  const brand = bytes.subarray(8, 12).toString("ascii").toLowerCase();
  return brand.startsWith("hei") || brand.startsWith("mif") || brand === "msf1";
}

/** Trust the file bytes. A declared type alone is not enough. */
export function detectImageType(bytes: Buffer): StoredImageType | null {
  return sniff(bytes);
}
