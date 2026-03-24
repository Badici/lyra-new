"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { PhotoViewer, type PhotoViewerItem } from "./PhotoViewer";

const PVA_SHOWCASE = [
  {
    id: "pva-main",
    name: "Pungi PVA gata de lansare",
    description: "Pungi compacte, presate corect pentru dizolvare eficientă și prezentare curată pe substrat.",
    image: "/punga-pva.png",
  },
  {
    id: "pva-custom-orders",
    name: "Comenzi mari și loturi pregătite",
    description: "Pentru partide planificate, pregătim loturi uniforme, ușor de organizat și transportat.",
    image: "/comanda-baguri.png",
  },
  {
    id: "pva-rigs",
    name: "Monturi și configurare pe cerere",
    description: "Hookbait-ul și configurarea cârligului pot fi adaptate la stilul tău de pescuit.",
    image: "/monturi-bag.png",
  },
  {
    id: "pva-leaders",
    name: "Forface și detalii personalizate",
    description: "Ajustăm finețea monturii pentru scenariile dorite; prețul poate varia în funcție de cerințe.",
    image: "/forface-baguri.jpeg",
  },
] as const;

export function SectionPVA() {
  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerIndex, setViewerIndex] = useState(0);

  const viewableItems = useMemo<PhotoViewerItem[]>(() =>
    PVA_SHOWCASE.map((item) => ({ src: item.image, alt: item.name })),
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
      <div className="max-w-6xl mx-auto">
        <motion.header
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10 md:mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-semibold text-[var(--cream)]">
            Pungi PVA
          </h2>
          <p className="text-[var(--muted)] text-base mt-2 max-w-2xl mx-auto">
            Pungi PVA pregătite pentru lansare rapidă, cu mix compactat corect pentru dizolvare bună și atracție imediată pe vad.
          </p>
        </motion.header>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8 md:mb-10 rounded-2xl border border-[var(--accent)]/45 bg-gradient-to-br from-[var(--accent)]/16 via-[var(--lake)] to-[var(--forest)] p-6 md:p-8"
        >
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
            <div className="lg:w-[60%]">
              <h3 className="text-xl md:text-2xl font-semibold text-[var(--cream)] mb-3">
                Pungile noastre PVA
              </h3>
              <p className="text-[var(--cream)]/95 text-sm md:text-base leading-relaxed">
                Pregătim pungi PVA gata de utilizare, realizate pentru o compactare optimă și o deschidere eficientă pe substrat. Fiecare mix este atent echilibrat și conține cereale, peleți fishmeal în diverse dimensiuni și culori, precum și nadă pentru o legare perfectă.
              </p>
              <p className="text-[var(--muted)] text-sm md:text-base mt-4 leading-relaxed">
                Monturile și momelile de cârlig pot fi personalizate la cerere, în funcție de stilul partidei. Pentru configurații speciale, prețurile pot varia.
              </p>
            </div>
            <div className="lg:w-[40%] rounded-xl border border-[var(--accent)]/50 bg-black/20 p-4 md:p-5">
              <p className="text-[var(--muted)] text-xs uppercase tracking-wider mb-1">Prețuri</p>
              <p className="text-[var(--cream)] font-semibold text-lg">
                15 lei / pungă
              </p>
              <p className="text-[var(--muted)] text-sm mt-2">
                Pentru comenzi peste <span className="text-[var(--cream)] font-semibold">40 buc</span>:
              </p>
              <p className="text-[var(--accent-light)] font-semibold text-lg mt-1">
                12 lei / pungă
              </p>
              <span className="mt-3 inline-flex items-center rounded-full border border-[var(--accent)]/70 bg-[var(--accent)]/25 px-3 py-1 text-xs font-semibold text-[var(--accent-light)]">
                Reducere volum -20%
              </span>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5">
          {PVA_SHOWCASE.map((item, i) => (
            <motion.article
              key={item.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -4 }}
              className="group rounded-2xl overflow-hidden bg-[var(--lake)] border border-white/10 shadow-lg"
            >
              <button
                type="button"
                onClick={() => {
                  const idx = viewableItems.findIndex((it) => it.src === item.image);
                  if (idx >= 0) openViewer(idx);
                }}
                className="aspect-[4/3] relative overflow-hidden w-full block cursor-zoom-in bg-[var(--forest)]/40"
              >
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/5 to-transparent" />
                <div className="absolute left-3 bottom-3 rounded-full bg-black/45 px-2.5 py-1 text-[11px] text-[var(--cream)] border border-white/20">
                  Tap pentru zoom
                </div>
              </button>
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
