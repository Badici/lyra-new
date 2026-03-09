"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { bigFishProducts, mixDeNadire, boilliesComingSoon } from "@/data/products";
import { PhotoViewer, type PhotoViewerItem } from "./PhotoViewer";

export function SectionBoillies() {
  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerIndex, setViewerIndex] = useState(0);

  const viewableItems = useMemo<PhotoViewerItem[]>(() => {
    const list: PhotoViewerItem[] = bigFishProducts
      .filter((p) => p.image)
      .map((p) => ({ src: p.image!, alt: p.name }));
    if (mixDeNadire.image) {
      list.push({ src: mixDeNadire.image, alt: mixDeNadire.name });
    }
    return list;
  }, []);

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
            Boillies
          </h2>
          <p className="text-[var(--muted)] max-w-xl mx-auto">
            Momeală de calitate pentru crap — atrage, ține peștii în zonă și duce la capturi mari.
          </p>
        </motion.header>

        {/* BigFish — alternating rows (image left/right) */}
        <div className="space-y-0">
          {bigFishProducts.map((p, i) => {
            const imageLeft = i % 2 === 0;
            return (
              <motion.article
                key={p.id}
                initial={{ opacity: 0, x: imageLeft ? -24 : 24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.4 }}
                className={`flex flex-col md:flex-row gap-0 md:gap-8 items-stretch mb-8 md:mb-12 last:mb-0 ${
                  imageLeft ? "md:flex-row" : "md:flex-row-reverse"
                }`}
              >
                <button
                  type="button"
                  onClick={() => {
                    const idx = viewableItems.findIndex((it) => it.src === p.image);
                    if (idx >= 0) openViewer(idx);
                  }}
                  className={`md:w-[45%] aspect-[4/3] md:aspect-[3/4] relative overflow-hidden rounded-2xl bg-[var(--lake)] block ${p.image ? "cursor-zoom-in" : "cursor-default"}`}
                  disabled={!p.image}
                >
                  {p.image ? (
                    <Image
                      src={p.image}
                      alt={p.name}
                      fill
                      className="object-contain"
                      sizes="(max-width: 768px) 100vw, 45vw"
                    />
                  ) : (
                    <div className="absolute inset-0 placeholder-img flex items-center justify-center text-[var(--muted)] text-sm">
                      Foto
                    </div>
                  )}
                </button>
                <div className="md:w-[55%] flex flex-col justify-center py-6 md:py-0 md:px-2">
                  <span className="text-[var(--accent-light)] text-xs font-medium uppercase tracking-wider">
                    BigFish
                  </span>
                  <h3 className="text-xl md:text-2xl font-semibold text-[var(--cream)] mt-1 mb-2">
                    {p.name}
                  </h3>
                  <p className="text-[var(--muted)] text-sm md:text-base mb-4">
                    {p.description}
                  </p>
                  <span className="text-[var(--accent-light)] font-semibold tabular-nums">
                    {p.price}
                  </span>
                </div>
              </motion.article>
            );
          })}
        </div>

        {/* Mix de nădire — offset block (image left on desktop, stacked on mobile) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20 md:mt-24"
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

        {/* În curând — fruity, inline pill style */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-16 flex flex-wrap items-center justify-center gap-3 text-center"
        >
          <span className="rounded-full border border-[var(--accent)]/50 bg-[var(--accent)]/10 px-5 py-2.5 text-[var(--accent-light)] text-sm font-medium">
            În curând
          </span>
          <span className="text-[var(--cream)] font-semibold">
            {boilliesComingSoon.name}
          </span>
          <span className="text-[var(--muted)] text-sm">
            — {boilliesComingSoon.tagline}
          </span>
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
