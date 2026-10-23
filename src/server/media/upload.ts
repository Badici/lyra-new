import { put } from "@vercel/blob";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { nanoid } from "nanoid";
import { db } from "@/db/client";
import { mediaAssets } from "@/db/schema";
import { detectImageType, isHeicImage } from "@/server/media/image-type";

const MAX_BYTES = 4 * 1024 * 1024;

export async function storeUploadedImage(file: File): Promise<{ url: string; key: string }> {
  const bytes = Buffer.from(await file.arrayBuffer());
  if (bytes.length > MAX_BYTES) {
    throw new Error("Imaginea trebuie să fie sub 4MB.");
  }

  const image = detectImageType(bytes);
  if (!image) {
    if (isHeicImage(bytes, file.type)) {
      throw new Error("Pozele HEIC nu sunt acceptate. Salvează imaginea ca JPG sau PNG.");
    }
    throw new Error("Format acceptat: JPG, PNG, WebP sau GIF.");
  }

  const id = nanoid(16);

  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const blob = await put(`uploads/${id}.${image.ext}`, bytes, {
      access: "public",
      contentType: image.contentType,
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });
    return { url: blob.url, key: blob.url };
  }

  // Vercel’s disk is read-only, so production stores the file in Postgres.
  // Locally the file stays in public/ and is served directly.
  if (process.env.VERCEL) {
    await db.insert(mediaAssets).values({
      id,
      contentType: image.contentType,
      data: bytes.toString("base64"),
    });
    return { url: `/api/media/${id}`, key: `/api/media/${id}` };
  }

  const key = `uploads/${id}.${image.ext}`;
  const fullPath = path.join(process.cwd(), "public", key);
  await mkdir(path.dirname(fullPath), { recursive: true });
  await writeFile(fullPath, bytes);
  return { url: `/${key}`, key: `/${key}` };
}
