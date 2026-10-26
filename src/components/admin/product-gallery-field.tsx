"use client";

import { useState } from "react";
import { toast } from "sonner";
import { ImageCropDialog } from "@/components/admin/image-crop-dialog";
import { useAdminBusy } from "@/components/admin/admin-busy";
import { uploadAdminImage } from "@/components/admin/upload-client";
import { mediaUrl } from "@/lib/media-url";

export function ProductGalleryField({ images = [] }: { images?: string[] | null }) {
  const busy = useAdminBusy();
  const [items, setItems] = useState(() => (images ?? []).filter(Boolean));
  const [file, setFile] = useState<File | null>(null);

  function move(index: number, direction: -1 | 1) {
    const next = index + direction;
    if (next < 0 || next >= items.length) return;
    const copy = [...items];
    const [item] = copy.splice(index, 1);
    if (!item) return;
    copy.splice(next, 0, item);
    setItems(copy);
  }

  async function saveCrop(blob: Blob) {
    setFile(null);
    busy.begin();
    try {
      const url = await uploadAdminImage(blob);
      setItems((current) => [...current, url]);
      toast.success("Poză adăugată");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Upload eșuat");
    } finally {
      busy.end();
    }
  }

  return (
    <fieldset className="space-y-3">
      <legend className="admin-label">Poze (1600×1600 px)</legend>
      <p className="text-xs leading-relaxed text-muted">
        Prima poză este coperta. Poți schimba ordinea. Fiecare poză se încadrează la 1600×1600 px.
      </p>
      {items.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border px-3 py-6 text-center text-xs text-muted">
          Nicio poză
        </p>
      ) : (
        <ul className="space-y-2">
          {items.map((url, index) => (
            <li key={`${url}-${index}`} className="flex items-center gap-3 rounded-xl border border-border p-2">
              <input type="hidden" name="gallery" value={url} />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={mediaUrl(url) ?? ""} alt="" className="h-16 w-16 rounded-lg object-cover" />
              <span className="text-sm">{index === 0 ? "Copertă" : `Poza ${index + 1}`}</span>
              <div className="ml-auto flex gap-2">
                <button
                  type="button"
                  className="rounded-lg border border-border px-2 py-1 text-xs disabled:opacity-40"
                  aria-label="Mută mai sus"
                  disabled={index === 0}
                  onClick={() => move(index, -1)}
                >
                  Sus
                </button>
                <button
                  type="button"
                  className="rounded-lg border border-border px-2 py-1 text-xs disabled:opacity-40"
                  aria-label="Mută mai jos"
                  disabled={index === items.length - 1}
                  onClick={() => move(index, 1)}
                >
                  Jos
                </button>
                <button
                  type="button"
                  className="rounded-lg border border-border px-2 py-1 text-xs"
                  onClick={() => setItems((current) => current.filter((_, itemIndex) => itemIndex !== index))}
                >
                  Elimină
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
      <label className="inline-flex cursor-pointer items-center rounded-xl bg-moss px-3 py-2 text-xs text-cream">
        Adaugă poză
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
      {file ? (
        <ImageCropDialog
          file={file}
          preset="product"
          onCancel={() => setFile(null)}
          onConfirm={(blob) => void saveCrop(blob)}
        />
      ) : null}
    </fieldset>
  );
}
