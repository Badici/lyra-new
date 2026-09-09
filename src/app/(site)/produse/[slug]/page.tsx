import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductCard } from "@/components/public/product-card";
import { PlaceholderMedia } from "@/components/ui/placeholder-media";
import { AddToCartButton } from "@/features/cart/add-to-cart-button";
import {
  getProductBySlug,
  getRelatedProducts,
} from "@/features/products/queries";
import { formatRon } from "@/lib/money";
import { stockMessageRo } from "@/lib/stock";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const product = await getProductBySlug(slug);
    if (!product) return { title: "Produs negăsit" };
    return {
      title: product.seoTitle ?? product.name,
      description:
        product.seoDescription ?? product.shortDescription ?? product.description ?? undefined,
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

  const stockMsg = stockMessageRo(product.stockQuantity);

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
          <PlaceholderMedia
            seed={`product-${product.slug}`}
            ratio="square"
            label={product.name}
          />

          <div>
            <h1 className="mb-3 font-display text-5xl tracking-wide">{product.name}</h1>
            <p className="mb-4 text-2xl font-medium">{formatRon(product.priceBani)}</p>
            {product.compareAtPriceBani ? (
              <p className="mb-4 text-sm text-muted line-through">
                {formatRon(product.compareAtPriceBani)}
              </p>
            ) : null}
            {stockMsg ? (
              <p className="mb-6 rounded-xl border border-border bg-fog/40 px-4 py-3 text-sm leading-relaxed text-muted">
                {stockMsg}
              </p>
            ) : null}
            {product.shortDescription ? (
              <p className="mb-6 text-muted">{product.shortDescription}</p>
            ) : null}
            <AddToCartButton
              productId={product.id}
              slug={product.slug}
              name={product.name}
              priceBani={product.priceBani}
              stockQuantity={product.stockQuantity}
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
