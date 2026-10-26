import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageStats } from "@/components/public/page-stats";
import { ProductCard } from "@/components/public/product-card";
import { ProductPurchase } from "@/components/public/product-purchase";
import { ProductGallery } from "@/components/public/product-gallery";
import { MediaImage } from "@/components/ui/media-image";
import {
  getProductBySlug,
  getRelatedProducts,
} from "@/features/products/queries";
import { getPublicSiteUrl } from "@/lib/env";
import { absoluteMedia } from "@/lib/media-url";

type Props = { params: Promise<{ slug: string }> };

export const revalidate = 0;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const product = await getProductBySlug(slug);
    if (!product) return { title: "Produs negăsit" };
    const title = product.seoTitle ?? product.name;
    const description =
      product.seoDescription ?? product.shortDescription ?? product.description ?? undefined;
    const image = absoluteMedia(product.mainImageKey, getPublicSiteUrl());
    return {
      title,
      description,
      openGraph: {
        title,
        description,
        url: `${getPublicSiteUrl()}/produse/${product.slug}`,
        ...(image ? { images: [{ url: image, alt: product.name }] } : {}),
      },
    };
  } catch {
    return { title: "Produs" };
  }
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;

  let product: Awaited<ReturnType<typeof getProductBySlug>> | undefined;
  let related: Awaited<ReturnType<typeof getRelatedProducts>> = [];

  try {
    product = await getProductBySlug(slug);
    if (product) {
      related = await getRelatedProducts(product.categoryId, product.id);
    }
  } catch (error) {
    console.error("[product]", error);
  }

  if (!product) notFound();

  const photos = product.gallery?.length
    ? product.gallery
    : product.mainImageKey
      ? [product.mainImageKey]
      : [];

  return (
    <article className="section-lyra">
      <div className="container-lyra">
        <nav className="mb-6 text-sm text-muted" aria-label="Breadcrumb">
          <Link href="/produse" className="hover:text-foreground">
            Produse
          </Link>
          {product.category ? (
            <>
              <span className="mx-2">/</span>
              <span>{product.category.name}</span>
            </>
          ) : null}
        </nav>

        <div className="grid gap-10 lg:grid-cols-2">
          {photos.length > 0 ? (
            <ProductGallery images={photos} alt={product.name} />
          ) : (
            <MediaImage
              src={null}
              seed={`product-${product.slug}`}
              alt={product.name}
              ratio="square"
              priority
            />
          )}

          <div>
            <h1 className="mb-3 font-display text-5xl tracking-wide">{product.name}</h1>
            <PageStats
              kind="product"
              slug={product.slug}
              initialCount={product.viewCount}
              title={product.name}
            />
            {product.shortDescription ? (
              <p className="mb-6 text-muted">{product.shortDescription}</p>
            ) : null}
            <ProductPurchase
              productId={product.id}
              slug={product.slug}
              name={product.name}
              priceBani={product.priceBani}
              compareAtPriceBani={product.compareAtPriceBani}
              stockQuantity={product.stockQuantity}
              variants={product.variants.map((variant) => ({
                id: variant.id,
                name: variant.name,
                priceBani: variant.priceBani,
                stockQuantity: variant.stockQuantity,
              }))}
            />
          </div>
        </div>

        {(product.description || product.story || product.usageInstructions) && (
          <div className="mt-16 grid gap-10 lg:grid-cols-3">
            {product.description ? (
              <section>
                <h2 className="mb-3 font-display text-3xl tracking-wide">Descriere</h2>
                <p className="leading-relaxed text-muted">{product.description}</p>
              </section>
            ) : null}
            {product.story ? (
              <section>
                <h2 className="mb-3 font-display text-3xl tracking-wide">Poveste produs</h2>
                <p className="leading-relaxed text-muted">{product.story}</p>
              </section>
            ) : null}
            {product.usageInstructions ? (
              <section>
                <h2 className="mb-3 font-display text-3xl tracking-wide">Utilizare</h2>
                <p className="leading-relaxed text-muted">{product.usageInstructions}</p>
              </section>
            ) : null}
          </div>
        )}

        {related.length > 0 ? (
          <section className="mt-16">
            <h2 className="mb-8 font-display text-4xl tracking-wide">Produse similare</h2>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((item) => (
                <ProductCard key={item.id} product={item} />
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </article>
  );
}
