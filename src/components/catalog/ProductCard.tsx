"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  DEFAULT_PRODUCT_IMAGE,
  formatRon,
  getMinimumConfiguredPriceRon,
  type CatalogProduct,
} from "@/data/catalog";

export function ProductCard({ product }: { product: CatalogProduct }) {
  const productImage = product.images[0] ?? DEFAULT_PRODUCT_IMAGE;
  const isSvgImage = productImage.endsWith(".svg");
  const accentBadge =
    product.slug === "montura-punga-pva"
      ? "Cel mai bun preț la bag-uri"
      : product.slug.includes("montura")
        ? "Top raport calitate-preț"
        : null;
  const displayPrice = product.pricingConfig
    ? `Pornind de la ${formatRon(getMinimumConfiguredPriceRon(product))} RON`
    : product.priceLabel;

  return (
    <motion.article
      className="overflow-hidden rounded-2xl border border-white/10 bg-[var(--lake)]"
      whileHover={{
        y: -4,
        scale: 1.03,
        boxShadow: "0 18px 40px rgba(0,0,0,0.24)",
      }}
      transition={{ duration: 0.45, ease: "easeOut" }}
    >
      <Link href={`/produse/${product.slug}`} className="group block">
        <div className="relative aspect-[4/3]">
          <Image
            src={productImage}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
            unoptimized={isSvgImage}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
        </div>
        <div className="space-y-2 p-5">
          {accentBadge ? (
            <p className="inline-flex rounded-full border-2 border-[var(--accent)]/60 bg-[var(--accent)]/25 px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-[var(--accent-light)] shadow-[0_0_22px_rgba(251,191,36,0.28)]">
              {accentBadge}
            </p>
          ) : null}
          <h3 className="text-lg font-semibold text-[var(--cream)]">{product.name}</h3>
          <p className="line-clamp-2 text-sm text-[var(--muted)]">
            {product.shortDescription}
          </p>
          <p className="text-base font-semibold text-[var(--accent-light)]">
            {displayPrice}
          </p>
        </div>
      </Link>
    </motion.article>
  );
}
