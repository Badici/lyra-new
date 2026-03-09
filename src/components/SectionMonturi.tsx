"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { monturi } from "@/data/products";
import { PhotoViewer, type PhotoViewerItem } from "./PhotoViewer";

export function SectionMonturi() {
  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerIndex, setViewerIndex] = useState(0);

  const viewableItems = useMemo<PhotoViewerItem[]>(() =>
    monturi.filter((m) => m.image).map((m) => ({ src: m.image!, alt: m.name })),
    []
  );

  const openViewer = (index: number) => {
    setViewerIndex(index);
    setViewerOpen(true);
  };

  return (
    <section
      id="monturi"
      className="scroll-mt-24 py-16 md:py-24 px-4 bg-[var(--forest)]/30"
    >
      <div className="max-w-5xl mx-auto">
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12 md:mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-semibold text-[var(--cream)] mb-2">
            Monturi și plumburi
          </h2>
          <p className="text-[var(--muted)]">
            Monturi gata făcute pe leadcore, cu fir de păr textil sau fluorcarbon.
          </p>
        </motion.header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {monturi.map((m, i) => (
            <motion.article
              key={m.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ scale: 1.03 }}
              className="group flex flex-col rounded-xl overflow-hidden bg-[var(--lake)] border border-white/5 cursor-default"
            >
              <button
                type="button"
                onClick={() => {
                  const idx = viewableItems.findIndex((it) => it.src === m.image);
                  if (idx >= 0) openViewer(idx);
                }}
                className={`aspect-[3/5] relative placeholder-img min-h-[200px] overflow-hidden w-full block ${m.image ? "cursor-zoom-in" : "cursor-default"}`}
                disabled={!m.image}
              >
                {m.image ? (
                  <Image
                    src={m.image}
                    alt={m.name}
                    fill
                    className="object-cover object-top transition-transform duration-300 ease-out group-hover:scale-110"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-[var(--muted)] text-sm">
                    Foto montură
                  </div>
                )}
              </button>
              <div className="p-4 flex flex-col gap-1">
                <h3 className="font-medium text-[var(--cream)] text-sm leading-snug">
                  {m.name}
                </h3>
                <span className="text-[var(--accent-light)] text-sm font-medium tabular-nums">
                  {m.price}
                </span>
              </div>
            </motion.article>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-10 text-center text-[var(--muted)] text-sm max-w-xl mx-auto"
        >
          Realizăm monturi și forfecă la comandă, după specificațiile tale.
        </motion.p>
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
