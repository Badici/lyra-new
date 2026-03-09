"use client";

import { motion } from "framer-motion";

export function SectionHeader({
  title,
  subtitle,
  id,
}: {
  title: string;
  subtitle?: string;
  id: string;
}) {
  return (
    <motion.header
      id={id}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="text-center max-w-2xl mx-auto mb-12 md:mb-16 scroll-mt-24"
    >
      <h2 className="text-3xl md:text-4xl font-semibold text-[var(--cream)] mb-3">
        {title}
      </h2>
      {subtitle && (
        <p className="text-[var(--muted)] text-lg">{subtitle}</p>
      )}
    </motion.header>
  );
}
