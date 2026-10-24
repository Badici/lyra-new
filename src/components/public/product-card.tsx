import Link from "next/link";
import { MagneticHover } from "@/components/motion/magnetic-hover";
import { MediaImage } from "@/components/ui/media-image";
import { StockNotice } from "@/components/public/stock-notice";
import { formatRon } from "@/lib/money";
import { publicOffer, type OfferVariant } from "@/lib/offer";

type ProductCardData = {
  id: string;
  slug: string;
  name: string;
  shortDescription?: string | null;
  priceBani: number;
  stockQuantity: number;
  mainImageKey?: string | null;
  variants?: OfferVariant[];
};

export function ProductCard({ product }: { product: ProductCardData }) {
  const offer = publicOffer(product.priceBani, product.stockQuantity, product.variants ?? []);

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
          <p className="mt-2 text-base font-medium">
            {offer.fromPrice ? `de la ${formatRon(offer.priceBani)}` : formatRon(offer.priceBani)}
          </p>
          <StockNotice stockQuantity={offer.stockQuantity} compact />
        </Link>
      </article>
    </MagneticHover>
  );
}
