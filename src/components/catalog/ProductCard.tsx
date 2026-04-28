import Image from "next/image";
import Link from "next/link";
import type { CatalogProduct } from "@/data/catalog";

export function ProductCard({ product }: { product: CatalogProduct }) {
  return (
    <article className="overflow-hidden rounded-2xl border border-white/10 bg-[var(--lake)]">
      <Link href={`/produse/${product.slug}`} className="group block">
        <div className="relative aspect-[4/3]">
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
        </div>
        <div className="space-y-2 p-5">
          <h3 className="text-lg font-semibold text-[var(--cream)]">{product.name}</h3>
          <p className="line-clamp-2 text-sm text-[var(--muted)]">
            {product.shortDescription}
          </p>
          <p className="text-base font-semibold text-[var(--accent-light)]">
            {product.priceLabel}
          </p>
        </div>
      </Link>
    </article>
  );
}
