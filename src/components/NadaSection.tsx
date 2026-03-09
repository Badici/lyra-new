"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { nadaVariants } from "@/data/nada";
import { PhotoViewer, type PhotoViewerItem } from "./PhotoViewer";

export function NadaSection() {
  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerIndex, setViewerIndex] = useState(0);

  const viewableItems = useMemo<PhotoViewerItem[]>(() =>
    nadaVariants
      .filter((v) => v.image)
      .map((v) => ({ src: v.image!, alt: v.name })),
    []
  );

  const openViewer = (index: number) => {
    setViewerIndex(index);
    setViewerOpen(true);
  };

  return (
    <>
      <section
        id="nada"
        className="scroll-mt-24 py-16 md:py-24 px-4"
      >
        <div className="max-w-6xl mx-auto">
          <motion.header
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12 md:mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-semibold text-[var(--cream)] mb-3">
              Nadă (groundbait)
            </h2>
            <p className="text-[var(--muted)] text-lg max-w-xl mx-auto">
              Momeală de calitate pentru atragerea crapului și a peștilor albi.
            </p>
          </motion.header>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-4xl mx-auto">
            {nadaVariants.map((variant, i) => {
              const viewableIndex = variant.image
                ? viewableItems.findIndex((it) => it.src === variant.image)
                : -1;
              const isClickable = viewableIndex >= 0;

              return (
                <motion.div
                  key={variant.id}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-20px" }}
                  transition={{ duration: 0.35, delay: i * 0.05 }}
                  className="group text-left rounded-2xl overflow-hidden bg-[var(--lake)] border border-white/5 hover:border-[var(--accent)]/50 transition-all duration-300"
                >
                  <button
                    type="button"
                    onClick={() => isClickable && openViewer(viewableIndex)}
                    className={`w-full aspect-square relative block ${isClickable ? "cursor-zoom-in" : "cursor-default"}`}
                    disabled={!isClickable}
                  >
                    {variant.image ? (
                      <Image
                        src={variant.image}
                        alt={variant.name}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        sizes="(max-width: 768px) 50vw, 25vw"
                      />
                    ) : (
                      <div className="absolute inset-0 placeholder-img flex items-center justify-center text-[var(--muted)] text-sm">
                        Foto
                      </div>
                    )}
                  </button>
                  <div className="p-4">
                    <span className="block font-semibold text-[var(--cream)] text-base group-hover:text-[var(--accent-light)] transition-colors">
                      {variant.name}
                    </span>
                    <span className="text-[var(--muted)] text-sm mt-0.5">
                      {variant.pricePlaceholder}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {viewerOpen && viewableItems.length > 0 && (
        <PhotoViewer
          items={viewableItems}
          initialIndex={viewerIndex}
          onClose={() => setViewerOpen(false)}
        />
      )}
    </>
  );
}
