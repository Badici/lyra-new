"use client";

import { motion } from "framer-motion";
import type { Product } from "@/data/products";

type ShowcaseSectionProps = {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  products: Product[];
  imageRight?: boolean;
  badge?: string;
};

export function ShowcaseSection({
  id,
  title,
  subtitle,
  description,
  products,
  imageRight = false,
  badge,
}: ShowcaseSectionProps) {
  return (
    <section
      id={id}
      className="scroll-mt-24 py-16 md:py-24 px-4"
    >
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: imageRight ? 24 : -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5 }}
            className={`relative aspect-[4/3] rounded-2xl overflow-hidden placeholder-img min-h-[280px] ${imageRight ? "md:order-2" : ""}`}
          >
            <div className="absolute inset-0 flex items-center justify-center text-[var(--muted)]">
              Foto secțiune
            </div>
          </motion.div>

          <div className={imageRight ? "md:order-1" : ""}>
            {badge && (
              <motion.span
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="inline-block rounded-full bg-[var(--accent)]/30 text-[var(--accent-light)] px-3 py-1 text-sm font-medium mb-4"
              >
                {badge}
              </motion.span>
            )}
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="text-2xl md:text-3xl font-semibold text-[var(--cream)] mb-2"
            >
              {title}
            </motion.h2>
            {subtitle && (
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="text-[var(--muted)] text-lg mb-4"
              >
                {subtitle}
              </motion.p>
            )}
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-[var(--cream)]/90 mb-8"
            >
              {description}
            </motion.p>
            <motion.ul
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15 }}
              className="space-y-2"
            >
              {products.map((p, i) => (
                <li
                  key={p.id}
                  className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 text-[var(--cream)]/90 border-b border-white/5 pb-2 last:border-0"
                >
                  <span>{p.name}</span>
                  <span className="text-[var(--muted)] text-sm tabular-nums">
                    {p.pricePlaceholder}
                  </span>
                </li>
              ))}
            </motion.ul>
          </div>
        </div>
      </div>
    </section>
  );
}
