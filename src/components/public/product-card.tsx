import Link from "next/link";
import { MagneticHover } from "@/components/motion/magnetic-hover";
import { MediaImage } from "@/components/ui/media-image";
import { formatRon } from "@/lib/money";
import { stockMessageRo } from "@/lib/stock";

type ProductCardData = {
  id: string;
  slug: string;
  name: string;
  shortDescription?: string | null;
  priceBani: number;
  stockQuantity: number;
  mainImageKey?: string | null;
};

export function ProductCard({ product }: { product: ProductCardData }) {
  const stockMsg = stockMessageRo(product.stockQuantity);

  return (
    <MagneticHover>
      <article className="group">
        <Link href={`/produse/${product.slug}`} className="block">
          <div className="shimmer-sheen mb-4 overflow-hidden rounded-2xl">
            <MediaImage
              src={product.mainImageKey}
              seed={`product-${product.slug}`}
              alt={product.name}
              ratio="square"
              className="transition duration-500 ease-out group-hover:scale-[1.04]"
            />
          </div>
          <h3 className="font-display text-2xl tracking-wide transition-colors duration-500 group-hover:text-accent">
            {product.name}
          </h3>
          {product.shortDescription ? (
            <p className="mt-1 line-clamp-2 text-sm text-muted">{product.shortDescription}</p>
          ) : null}
          <p className="mt-2 text-base font-medium">{formatRon(product.priceBani)}</p>
          {stockMsg ? (
            <p className="mt-2 text-xs leading-relaxed text-muted">{stockMsg}</p>
          ) : null}
        </Link>
      </article>
    </MagneticHover>
  );
}
