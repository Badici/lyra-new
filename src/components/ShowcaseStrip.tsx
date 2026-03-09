"use client";

import { motion } from "framer-motion";
import type { Product } from "@/data/products";

type ShowcaseStripProps = {
  id: string;
  title: string;
  subtitle?: string;
  intro?: string;
  products: Product[];
  variant?: "default" | "dark";
};

export function ShowcaseStrip({
  id,
  title,
  subtitle,
  intro,
  products,
  variant = "default",
}: ShowcaseStripProps) {
  const bg = variant === "dark" ? "bg-[var(--lake)]/40" : "";

  return (
    <section
      id={id}
      className={`scroll-mt-24 py-16 md:py-20 px-4 ${bg}`}
    >
      <div className="max-w-4xl mx-auto">
        <motion.header
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-2xl md:text-3xl font-semibold text-[var(--cream)] mb-2">
            {title}
          </h2>
          {subtitle && (
            <p className="text-[var(--muted)]">{subtitle}</p>
          )}
          {intro && (
            <p className="text-[var(--cream)]/80 mt-4 max-w-2xl mx-auto">
              {intro}
            </p>
          )}
        </motion.header>
        <motion.ul
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="grid sm:grid-cols-2 gap-x-8 gap-y-3 max-w-2xl mx-auto"
        >
          {products.map((p) => (
            <li
              key={p.id}
              className="flex items-baseline justify-between gap-4 text-[var(--cream)]/90"
            >
              <span>{p.name}</span>
              <span className="text-[var(--muted)] text-sm shrink-0 tabular-nums">
                {p.pricePlaceholder}
              </span>
            </li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}
