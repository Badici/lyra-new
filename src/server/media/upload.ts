import { put } from "@vercel/blob";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { nanoid } from "nanoid";

const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);
const MAX_BYTES = 5 * 1024 * 1024;

export async function storeUploadedImage(file: File): Promise<{ url: string; key: string }> {
  if (!ALLOWED.has(file.type)) {
    throw new Error("Format acceptat: JPG, PNG, WebP sau GIF.");
  }
  if (file.size > MAX_BYTES) {
    throw new Error("Imaginea trebuie să fie sub 5MB.");
  }

  const ext =
    file.type === "image/png"
      ? "png"
      : file.type === "image/webp"
        ? "webp"
        : file.type === "image/gif"
          ? "gif"
          : "jpg";
  const key = `uploads/${new Date().getUTCFullYear()}/${nanoid(12)}.${ext}`;
  const bytes = Buffer.from(await file.arrayBuffer());

  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const blob = await put(key, bytes, {
      access: "public",
      contentType: file.type,
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });
    return { url: blob.url, key: blob.pathname };
  }

  const publicDir = path.join(process.cwd(), "public");
  const fullPath = path.join(publicDir, key);
  await mkdir(path.dirname(fullPath), { recursive: true });
  await writeFile(fullPath, bytes);
  return { url: `/${key}`, key };
}
