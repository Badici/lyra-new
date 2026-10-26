"use client";

import { useState } from "react";
import { MediaImage } from "@/components/ui/media-image";
import { mediaUrl } from "@/lib/media-url";

export function ProductGallery({ images, alt }: { images: string[]; alt: string }) {
  const [index, setIndex] = useState(0);
  const current = images[index] ?? images[0];

  return (
    <div>
      <MediaImage src={current} seed={alt} alt={alt} ratio="square" priority />
      {images.length > 1 ? (
        <div className="mt-3 flex gap-2 overflow-x-auto" role="tablist" aria-label="Pozele produsului">
          {images.map((image, imageIndex) => {
            const selected = imageIndex === index;
            return (
              <button
                key={`${image}-${imageIndex}`}
                type="button"
                role="tab"
                aria-selected={selected}
                aria-label={`Poza ${imageIndex + 1}`}
                onClick={() => setIndex(imageIndex)}
                className={`h-16 w-16 shrink-0 overflow-hidden rounded-xl border ${
                  selected ? "border-accent" : "border-border"
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={mediaUrl(image) ?? ""} alt="" className="h-full w-full object-cover" />
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
