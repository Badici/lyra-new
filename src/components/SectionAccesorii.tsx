"use client";

import { motion } from "framer-motion";
import { accessories } from "@/data/products";

export function SectionAccesorii() {
  return (
    <section
      id="accesorii"
      className="scroll-mt-24 py-16 md:py-24 px-4 bg-[var(--lake)]/20"
    >
      <div className="max-w-6xl mx-auto">
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 md:mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-semibold text-[var(--cream)] mb-2">
            Accesorii pescuit și camping
          </h2>
          <p className="text-[var(--muted)]">
            Echipament și accesorii pentru pescuit la crap și camping.
          </p>
        </motion.header>

        {/* Bento: first item large, rest in grid */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4"
        >
          {accessories.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.04 }}
              className={`rounded-xl bg-[var(--lake)] border border-white/5 p-4 flex flex-col justify-between ${
                i === 0 ? "col-span-2 md:col-span-1 md:p-6" : ""
              }`}
            >
              <span className={`font-medium text-[var(--cream)] line-clamp-2 ${
                i === 0 ? "text-base md:text-lg" : "text-sm md:text-base"
              }`}>
                {p.name}
              </span>
              <span className="text-[var(--muted)] text-xs mt-2 tabular-nums">
                {p.pricePlaceholder}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
