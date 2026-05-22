import Image from "next/image";
import Link from "next/link";
import {
  DEFAULT_PRODUCT_IMAGE,
  formatRon,
  getMinimumConfiguredPriceRon,
  type CatalogProduct,
} from "@/data/catalog";

export function ProductCard({ product }: { product: CatalogProduct }) {
  const productImage = product.images[0] ?? DEFAULT_PRODUCT_IMAGE;
  const isSvgImage = productImage.endsWith(".svg");
  const displayPrice = product.pricingConfig
    ? `Pornind de la ${formatRon(getMinimumConfiguredPriceRon(product))} RON`
    : product.priceLabel;

  return (
    <article className="overflow-hidden rounded-2xl border border-white/10 bg-[var(--lake)]">
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
          <h3 className="text-lg font-semibold text-[var(--cream)]">{product.name}</h3>
          <p className="line-clamp-2 text-sm text-[var(--muted)]">
            {product.shortDescription}
          </p>
          <p className="text-base font-semibold text-[var(--accent-light)]">
            {displayPrice}
          </p>
        </div>
      </Link>
    </article>
  );
}
