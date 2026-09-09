"use client";

import { useState } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type ImageFieldProps = {
  name: string;
  label?: string;
  defaultValue?: string | null;
  className?: string;
};

export function ImageField({
  name,
  label = "Imagine",
  defaultValue,
  className,
}: ImageFieldProps) {
  const [url, setUrl] = useState(defaultValue ?? "");
  const [uploading, setUploading] = useState(false);

  async function onFileChange(file: File | null) {
    if (!file) return;
    setUploading(true);
    try {
      const body = new FormData();
      body.set("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body });
      const data = (await res.json()) as { url?: string; error?: string };
      if (!res.ok || !data.url) {
        toast.error(data.error ?? "Upload eșuat");
        return;
      }
      setUrl(data.url);
      toast.success("Imagine încărcată");
    } catch {
      toast.error("Upload eșuat");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className={cn("space-y-2", className)}>
      <label className="admin-label">{label}</label>
      <input type="hidden" name={name} value={url} />
      {url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={url}
          alt=""
          className="mb-2 h-36 w-full rounded-xl object-cover ring-1 ring-border"
        />
      ) : (
        <div className="mb-2 flex h-36 items-center justify-center rounded-xl border border-dashed border-border text-xs text-muted">
          Nicio imagine
        </div>
      )}
      <div className="flex flex-wrap gap-2">
        <label className="inline-flex cursor-pointer items-center rounded-xl bg-moss px-3 py-2 text-xs text-cream">
          {uploading ? "Se încarcă…" : "Încarcă fișier"}
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="hidden"
            disabled={uploading}
            onChange={(e) => onFileChange(e.target.files?.[0] ?? null)}
          />
        </label>
        {url ? (
          <button
            type="button"
            className="rounded-xl border border-border px-3 py-2 text-xs text-muted hover:text-cream"
            onClick={() => setUrl("")}
          >
            Elimină
          </button>
        ) : null}
      </div>
      <input
        type="url"
        className="admin-input"
        placeholder="sau lipește un URL de imagine"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />
    </div>
  );
}
