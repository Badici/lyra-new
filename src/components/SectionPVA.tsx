"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { pvaProducts } from "@/data/products";
import { PhotoViewer, type PhotoViewerItem } from "./PhotoViewer";

export function SectionPVA() {
  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerIndex, setViewerIndex] = useState(0);

  const viewableItems = useMemo<PhotoViewerItem[]>(() =>
    pvaProducts.filter((p) => p.image).map((p) => ({ src: p.image!, alt: p.name })),
    []
  );

  const openViewer = (index: number) => {
    setViewerIndex(index);
    setViewerOpen(true);
  };

  return (
    <section
      id="pva"
      className="scroll-mt-24 py-16 md:py-24 px-4 bg-[var(--lake)]/20"
    >
      <div className="max-w-4xl mx-auto">
        <motion.header
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10 md:mb-12"
        >
          <h2 className="text-2xl md:text-3xl font-semibold text-[var(--cream)]">
            PVA umplute
          </h2>
          <p className="text-[var(--muted)] text-sm mt-2 max-w-lg mx-auto">
            Pungi și saculeți PVA, gata umplute cu momeală — lansezi în câteva secunde.
          </p>
        </motion.header>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
          {pvaProducts.map((p, i) => (
            <motion.article
              key={p.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className="group flex flex-col rounded-xl overflow-hidden bg-[var(--lake)] border border-white/5"
            >
              <button
                type="button"
                onClick={() => {
                  const idx = viewableItems.findIndex((it) => it.src === p.image);
                  if (idx >= 0) openViewer(idx);
                }}
                className={`aspect-square relative overflow-hidden w-full block ${p.image ? "cursor-zoom-in" : "cursor-default"}`}
                disabled={!p.image}
              >
                {p.image ? (
                  <Image
                    src={p.image}
                    alt={p.name}
                    fill
                    className="object-cover transition-transform duration-300 ease-out group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, 50vw"
                  />
                ) : (
                  <div className="absolute inset-0 placeholder-img flex items-center justify-center text-[var(--muted)] text-sm">
                    Foto produs
                  </div>
                )}
              </button>
              <div className="p-4 flex flex-col gap-2">
                <h3 className="font-semibold text-[var(--cream)]">
                  {p.name}
                </h3>
                <p className="text-[var(--muted)] text-sm">
                  {p.description}
                </p>
                <span className="text-[var(--accent-light)] text-sm font-medium tabular-nums mt-1">
                  {p.price}
                </span>
              </div>
            </motion.article>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-10 p-5 rounded-xl bg-[var(--forest)]/40 border border-white/5 text-center"
        >
          <p className="text-[var(--cream)]/90 text-sm md:text-base">
            <strong className="text-[var(--cream)]">Comandă la cerere:</strong> realizăm pungile și saculeții și după specificațiile tale. Mixul cu care le umplem poate fi adaptat la cerere — spune-ne ce ai nevoie.
          </p>
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
