"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { catches } from "@/data/catches";
import { PhotoViewer, type PhotoViewerItem } from "./PhotoViewer";

export function CapturileNoastre() {
  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerIndex, setViewerIndex] = useState(0);

  const viewableItems = useMemo<PhotoViewerItem[]>(() =>
    catches.map((c) => ({ src: c.image, alt: "Captură" })),
    []
  );

  const openViewer = (index: number) => {
    setViewerIndex(index);
    setViewerOpen(true);
  };

  return (
    <section
      id="capturi"
      className="scroll-mt-24 py-16 md:py-24 px-4 bg-[var(--lake)]/20"
    >
      <div className="max-w-6xl mx-auto">
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12 md:mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-semibold text-[var(--cream)] mb-3">
            Capturile noastre
          </h2>
          <p className="text-[var(--muted)] text-lg max-w-xl mx-auto">
            Rezultate cu momeala și monturile Lyra Baits
          </p>
        </motion.header>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
          {catches.map((c, i) => (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-20px" }}
              transition={{ duration: 0.4, delay: i * 0.03 }}
              className="group relative aspect-[3/4] rounded-xl overflow-hidden"
            >
              <button
                type="button"
                onClick={() => openViewer(i)}
                className="absolute inset-0 w-full h-full cursor-zoom-in block"
              >
                <Image
                  src={c.image}
                  alt="Captură"
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />
              </button>
            </motion.div>
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
