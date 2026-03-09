"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import type { Product } from "@/data/products";

export function ProductCard({
  product,
  index,
}: {
  product: Product;
  index: number;
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="group relative overflow-hidden rounded-2xl bg-[var(--lake)] border border-white/5"
    >
      <div className="aspect-square relative placeholder-img">
        {product.image ? (
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-[var(--muted)] text-sm">
            Foto produs
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-medium text-[var(--cream)] line-clamp-2 mb-1">
          {product.name}
        </h3>
        <p className="text-[var(--muted)] text-sm">{product.pricePlaceholder}</p>
      </div>
    </motion.article>
  );
}
