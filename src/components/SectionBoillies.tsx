"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { mixDeNadire } from "@/data/products";
import { PhotoViewer, type PhotoViewerItem } from "./PhotoViewer";

export function SectionBoillies() {
  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerIndex, setViewerIndex] = useState(0);

  const viewableItems = useMemo<PhotoViewerItem[]>(
    () => (mixDeNadire.image ? [{ src: mixDeNadire.image, alt: mixDeNadire.name }] : []),
    []
  );

  const openViewer = (index: number) => {
    setViewerIndex(index);
    setViewerOpen(true);
  };

  return (
    <section
      id="boillies"
      className="scroll-mt-24 py-16 md:py-24 px-4 bg-[var(--forest)]/20"
    >
      <div className="max-w-5xl mx-auto">
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16 md:mb-20"
        >
          <h2 className="text-3xl md:text-4xl font-semibold text-[var(--cream)] mb-2">
            Amestec nădire
          </h2>
          <p className="text-[var(--muted)] max-w-xl mx-auto">
            Mix pentru spod și plantat, pregătit pentru atragerea peștilor în zonă.
          </p>
        </motion.header>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-4"
        >
          <div className="flex flex-col md:flex-row rounded-2xl overflow-hidden bg-[var(--lake)] border border-white/10">
            <button
              type="button"
              onClick={() => {
                const idx = viewableItems.findIndex((it) => it.src === mixDeNadire.image);
                if (idx >= 0) openViewer(idx);
              }}
              className={`md:w-[48%] aspect-[16/10] md:aspect-auto md:min-h-[320px] relative shrink-0 overflow-hidden rounded-t-2xl md:rounded-tr-none md:rounded-l-2xl bg-[var(--lake)] block ${mixDeNadire.image ? "cursor-zoom-in" : "cursor-default"}`}
              disabled={!mixDeNadire.image}
            >
              {mixDeNadire.image ? (
                <Image
                  src={mixDeNadire.image}
                  alt={mixDeNadire.name}
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 768px) 100vw, 48vw"
                />
              ) : (
                <div className="absolute inset-0 placeholder-img flex items-center justify-center text-[var(--muted)] text-sm">
                  Foto mix
                </div>
              )}
            </button>
            <div className="p-6 md:p-10 flex flex-col justify-center md:w-[52%]">
              <span className="text-[var(--accent-light)] text-xs font-medium uppercase tracking-wider">
                Spod &amp; plantat
              </span>
              <h3 className="text-2xl md:text-3xl font-semibold text-[var(--cream)] mt-1 mb-3">
                {mixDeNadire.name}
              </h3>
              <p className="text-[var(--muted)] text-sm md:text-base max-w-md mb-4">
                {mixDeNadire.description}
              </p>
              <span className="text-[var(--accent-light)] font-semibold text-lg tabular-nums">
                {mixDeNadire.price}
              </span>
            </div>
          </div>
        </motion.div>
      </div>

      {viewerOpen && viewableItems.length > 0 && (
        <PhotoViewer
          items={viewableItems}
          initialIndex={viewerIndex}
          onClose={() => setViewerOpen(false)}
        />
      )}
    </section>
  );
}
