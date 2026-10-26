"use client";

import { useState } from "react";
import { toast } from "sonner";
import { ImageCropDialog } from "@/components/admin/image-crop-dialog";
import { useAdminBusy } from "@/components/admin/admin-busy";
import { uploadAdminImage } from "@/components/admin/upload-client";
import { IMAGE_PRESETS, type ImagePresetKey } from "@/lib/image-presets";
import { mediaUrl } from "@/lib/media-url";
import { cn } from "@/lib/utils";

type ImageFieldProps = {
  name: string;
  label?: string;
  preset: ImagePresetKey;
  defaultValue?: string | null;
  className?: string;
};

export function ImageField({
  name,
  label = "Imagine",
  preset,
  defaultValue,
  className,
}: ImageFieldProps) {
  const spec = IMAGE_PRESETS[preset];
  const busy = useAdminBusy();
  const [url, setUrl] = useState(defaultValue ?? "");
  const [file, setFile] = useState<File | null>(null);
  const preview = mediaUrl(url);

  async function saveCrop(blob: Blob) {
    setFile(null);
    busy.begin();
    try {
      setUrl(await uploadAdminImage(blob));
      toast.success("Imagine încărcată");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Upload eșuat");
    } finally {
      busy.end();
    }
  }

  return (
    <div className={cn("space-y-2", className)}>
      <label className="admin-label">
        {label}
        <span className="font-normal text-muted"> ({spec.label})</span>
      </label>
      <input type="hidden" name={name} value={url} />
      {preview ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={preview}
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
          Încarcă și încadrează
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="hidden"
            onChange={(event) => {
              const next = event.target.files?.[0] ?? null;
              event.target.value = "";
              if (next) setFile(next);
            }}
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
        type="text"
        inputMode="url"
        className="admin-input"
        placeholder="sau lipește un URL de imagine"
        value={url}
        onChange={(event) => setUrl(event.target.value)}
      />
      {file ? (
        <ImageCropDialog
          file={file}
          preset={preset}
          onCancel={() => setFile(null)}
          onConfirm={(blob) => void saveCrop(blob)}
        />
      ) : null}
    </div>
  );
}
