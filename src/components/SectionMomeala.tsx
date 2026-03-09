"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { plasticBaits } from "@/data/products";
import { PhotoViewer, type PhotoViewerItem } from "./PhotoViewer";

export function SectionMomeala() {
  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerIndex, setViewerIndex] = useState(0);

  const viewableItems = useMemo<PhotoViewerItem[]>(() =>
    plasticBaits.filter((p) => p.image).map((p) => ({ src: p.image!, alt: p.name })),
    []
  );

  const openViewer = (index: number) => {
    setViewerIndex(index);
    setViewerOpen(true);
  };

  return (
    <section
      id="momeala"
      className="scroll-mt-24 py-16 md:py-24 px-4"
    >
      <div className="max-w-4xl mx-auto">
        <motion.header
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12 md:mb-14"
        >
          <h2 className="text-2xl md:text-3xl font-semibold text-[var(--cream)]">
            Momeală plastic (hookbaits)
          </h2>
          <p className="text-[var(--muted)] text-sm mt-2 max-w-md mx-auto">
            Momeală plastic pentru cârlige — realiste, durabile, 20 bucăți per pachet.
          </p>
        </motion.header>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
          {plasticBaits.map((p, i) => (
            <motion.article
              key={p.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -4 }}
              className="group relative flex flex-col rounded-2xl overflow-hidden bg-[var(--lake)] border border-white/10 shadow-lg"
            >
              <button
                type="button"
                onClick={() => {
                  const idx = viewableItems.findIndex((it) => it.src === p.image);
                  if (idx >= 0) openViewer(idx);
                }}
                className={`aspect-[4/5] relative overflow-hidden w-full block ${p.image ? "cursor-zoom-in" : "cursor-default"}`}
                disabled={!p.image}
              >
                {p.image ? (
                  <Image
                    src={p.image}
                    alt={p.name}
                    fill
                    className="object-cover object-center transition-transform duration-500 ease-out group-hover:scale-110"
                    sizes="(max-width: 640px) 100vw, 50vw"
                  />
                ) : (
                  <div className="absolute inset-0 placeholder-img flex items-center justify-center text-[var(--muted)] text-sm">
                    Foto
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--lake)]/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              </button>
              <div className="p-5 text-center border-t border-white/5">
                <h3 className="font-semibold text-[var(--cream)] text-lg">
                  {p.name}
                </h3>
                {p.description && (
                  <p className="text-[var(--muted)] text-sm mt-1">
                    {p.description}
                  </p>
                )}
                <span className="text-[var(--accent-light)] font-medium tabular-nums mt-2 inline-block">
                  {p.price}
                </span>
              </div>
            </motion.article>
          ))}
        </div>
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
