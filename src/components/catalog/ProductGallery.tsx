"use client";

import { useState } from "react";
import Image from "next/image";
import { DEFAULT_PRODUCT_IMAGE } from "@/data/catalog";

export function ProductGallery({
  images,
  productName,
}: {
  images: string[];
  productName: string;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const galleryImages = images.length > 0 ? images : [DEFAULT_PRODUCT_IMAGE];
  const activeImage = galleryImages[activeIndex];
  const activeIsSvg = activeImage.endsWith(".svg");

  return (
    <div className="space-y-3">
      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-white/10 bg-[var(--lake)]">
        <Image
          src={activeImage}
          alt={`${productName} - imagine ${activeIndex + 1}`}
          fill
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 50vw"
          priority
          unoptimized={activeIsSvg}
        />
      </div>

      {galleryImages.length > 1 && (
        <div className="grid grid-cols-4 gap-2">
          {galleryImages.map((image, index) => (
            <button
              key={image}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={`relative aspect-square overflow-hidden rounded-lg border ${
                activeIndex === index
                  ? "border-[var(--accent)]"
                  : "border-white/10"
              }`}
              aria-label={`Vezi imaginea ${index + 1}`}
            >
              <Image
                src={image}
                alt={`${productName} miniatura ${index + 1}`}
                fill
                className="object-cover"
                sizes="100px"
                unoptimized={image.endsWith(".svg")}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
