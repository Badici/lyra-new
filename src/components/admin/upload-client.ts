"use client";

export async function uploadAdminImage(file: Blob, filename = "image.jpg") {
  const upload =
    file instanceof File ? file : new File([file], filename, { type: file.type || "image/jpeg" });
  const body = new FormData();
  body.set("file", upload);
  const response = await fetch("/api/admin/upload", { method: "POST", body });
  const data = (await response.json()) as { url?: string; error?: string };
  if (!response.ok || !data.url) {
    throw new Error(data.error ?? "Upload eșuat");
  }
  return data.url;
}
