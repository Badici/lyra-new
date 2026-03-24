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
              Nadă
            </h2>
            <p className="text-[var(--muted)] text-lg max-w-xl mx-auto">
              5 tipuri de nadă Lyra, pregătite pentru partide de crap și pești capitali.
            </p>
          </motion.header>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-8 md:mb-10 rounded-2xl border border-[var(--accent)]/40 bg-[var(--accent)]/12 p-4 md:p-5 text-center"
          >
            <p className="text-[var(--cream)] font-semibold text-base md:text-lg">
              Promoție: <span className="text-[var(--accent-light)]">1 KG la preț de 800 g</span>
            </p>
            <p className="text-[var(--muted)] text-sm mt-1">
              Primești <span className="text-[var(--cream)] font-medium">20% gratis</span> față de gramajul standard.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 md:gap-6">
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
                    className={`w-full aspect-[3/2] relative block bg-[var(--forest)]/35 ${isClickable ? "cursor-zoom-in" : "cursor-default"}`}
                    disabled={!isClickable}
                  >
                    {variant.image ? (
                      <Image
                        src={variant.image}
                        alt={variant.name}
                        fill
                        className="object-contain transition-transform duration-300 group-hover:scale-[1.03]"
                        sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="absolute inset-0 placeholder-img flex items-center justify-center text-[var(--muted)] text-sm">
                        Foto
                      </div>
                    )}
                  </button>
                  <div className="p-4 md:p-5">
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                      <span className="block font-semibold text-[var(--cream)] text-lg group-hover:text-[var(--accent-light)] transition-colors">
                        {variant.name}
                      </span>
                      <span className="rounded-full border border-[var(--accent)]/40 bg-[var(--accent)]/15 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-[var(--accent-light)]">
                        Promo -20%
                      </span>
                    </div>
                    <p className="text-[var(--muted)] text-sm leading-relaxed">
                      {variant.description}
                    </p>
                    <div className="mt-4 flex items-end justify-between gap-3">
                      <span className="text-[var(--accent-light)] font-semibold text-base md:text-lg tabular-nums">
                        {variant.promoPrice}
                      </span>
                      <span className="text-[var(--muted)]/80 text-xs md:text-sm line-through tabular-nums">
                        {variant.regularPrice}
                      </span>
                    </div>
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
