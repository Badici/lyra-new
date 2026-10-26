"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { IMAGE_PRESETS, cropSourceRect, type ImagePresetKey } from "@/lib/image-presets";

type Props = {
  file: File;
  preset: ImagePresetKey;
  progress?: { index: number; total: number };
  onCancel: () => void;
  onConfirm: (blob: Blob) => void | Promise<void>;
};

export function ImageCropDialog({ file, preset, progress, onCancel, onConfirm }: Props) {
  const spec = IMAGE_PRESETS[preset];
  const frameRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const [src, setSrc] = useState("");
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [natural, setNatural] = useState({ width: 0, height: 0 });
  const [frame, setFrame] = useState({ width: 320, height: Math.round((320 * spec.height) / spec.width) });
  const drag = useRef<{ x: number; y: number; panX: number; panY: number } | null>(null);
  const [saving, setSaving] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const url = URL.createObjectURL(file);
    setSrc(url);
    setZoom(1);
    setPan({ x: 0, y: 0 });
    setNatural({ width: 0, height: 0 });
    return () => URL.revokeObjectURL(url);
  }, [file]);

  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

  useEffect(() => {
    const node = frameRef.current;
    if (!node) return;
    const measure = () => {
      const width = node.clientWidth;
      const height = node.clientHeight;
      if (width > 0 && height > 0) setFrame({ width, height });
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(node);
    return () => observer.disconnect();
  }, [src]);

  function placed(nextZoom = zoom, nextPan = pan) {
    return cropSourceRect({
      naturalWidth: natural.width || 1,
      naturalHeight: natural.height || 1,
      frameWidth: frame.width,
      frameHeight: frame.height,
      zoom: nextZoom,
      panX: nextPan.x,
      panY: nextPan.y,
    });
  }

  function onPointerDown(event: React.PointerEvent<HTMLDivElement>) {
    event.currentTarget.setPointerCapture(event.pointerId);
    drag.current = { x: event.clientX, y: event.clientY, panX: pan.x, panY: pan.y };
  }

  function onPointerMove(event: React.PointerEvent<HTMLDivElement>) {
    if (!drag.current || natural.width === 0) return;
    const next = placed(zoom, {
      x: drag.current.panX + (event.clientX - drag.current.x),
      y: drag.current.panY + (event.clientY - drag.current.y),
    });
    setPan({ x: next.panX, y: next.panY });
  }

  async function confirm() {
    const image = imageRef.current;
    if (!image || natural.width === 0) return;
    setSaving(true);
    try {
      const source = placed();
      const canvas = document.createElement("canvas");
      canvas.width = spec.width;
      canvas.height = spec.height;
      const context = canvas.getContext("2d");
      if (!context) return;
      context.drawImage(image, source.sx, source.sy, source.sw, source.sh, 0, 0, spec.width, spec.height);
      const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.9));
      if (blob) await onConfirm(blob);
    } finally {
      setSaving(false);
    }
  }

  const layout = natural.width ? placed() : null;
  const cover = natural.width ? Math.max(frame.width / natural.width, frame.height / natural.height) : 1;
  const imageWidth = natural.width * cover * zoom;
  const imageHeight = natural.height * cover * zoom;
  const stageWidth = `min(100%, calc(52dvh * ${spec.width} / ${spec.height}))`;
  const title =
    progress && progress.total > 1
      ? `Încadrează imaginea (${progress.index} din ${progress.total})`
      : "Încadrează imaginea";

  if (!mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/70 p-3 sm:p-4" role="presentation">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="crop-title"
        className="flex max-h-[calc(100dvh-1.5rem)] w-full max-w-3xl flex-col overflow-y-auto rounded-2xl bg-[var(--surface)] p-4 shadow-soft sm:p-5"
      >
        <h2 id="crop-title" className="shrink-0 font-display text-3xl tracking-wide">
          {title}
        </h2>
        <p className="mb-3 shrink-0 text-sm text-muted">Trage imaginea în cadru, apoi salvează la {spec.label}.</p>
        <div className="flex min-h-0 flex-1 items-center justify-center">
          <div
            ref={frameRef}
            className="relative cursor-grab overflow-hidden rounded-xl bg-black active:cursor-grabbing"
            style={{
              aspectRatio: `${spec.width} / ${spec.height}`,
              width: stageWidth,
              maxHeight: "52dvh",
            }}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={() => {
              drag.current = null;
            }}
            onPointerCancel={() => {
              drag.current = null;
            }}
          >
            {src ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                ref={imageRef}
                src={src}
                alt=""
                draggable={false}
                onLoad={(event) => {
                  setNatural({
                    width: event.currentTarget.naturalWidth,
                    height: event.currentTarget.naturalHeight,
                  });
                  setPan({ x: 0, y: 0 });
                }}
                className="pointer-events-none absolute max-w-none select-none"
                style={{
                  width: imageWidth || "100%",
                  height: imageHeight || "100%",
                  left: layout ? (frame.width - imageWidth) / 2 + layout.panX : 0,
                  top: layout ? (frame.height - imageHeight) / 2 + layout.panY : 0,
                }}
              />
            ) : null}
          </div>
        </div>
        <label className="mt-3 block shrink-0 text-sm text-muted">
          Zoom
          <input
            type="range"
            min={1}
            max={3}
            step={0.01}
            value={zoom}
            aria-label="Zoom"
            onChange={(event) => setZoom(Number(event.target.value))}
            className="mt-2 w-full"
          />
        </label>
        <div className="mt-4 flex shrink-0 flex-wrap justify-end gap-2">
          <button type="button" className="rounded-xl border border-border px-4 py-2 text-sm" onClick={onCancel} disabled={saving}>
            {progress && progress.total > 1 ? "Oprește" : "Anulează"}
          </button>
          <button
            type="button"
            className="rounded-xl bg-accent px-4 py-2 text-sm text-cream disabled:opacity-60"
            disabled={saving || natural.width === 0}
            onClick={() => void confirm()}
          >
            {saving ? "Se salvează…" : progress && progress.index < progress.total ? "Folosește și continuă" : "Folosește încadrarea"}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
