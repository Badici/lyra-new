import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AddToCartButton } from "@/components/cart/AddToCartButton";
import { ProductGallery } from "@/components/catalog/ProductGallery";
import { ProductCard } from "@/components/catalog/ProductCard";
import {
  getProductBySlug,
  products,
  WHATSAPP_NUMBER,
} from "@/data/catalog";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    return {
      title: "Produs inexistent",
    };
  }

  return {
    title: product.name,
    description: `${product.shortDescription} ${product.priceLabel}.`,
    alternates: {
      canonical: `/produse/${product.slug}`,
    },
    openGraph: {
      title: `${product.name} | Lyra Baits`,
      description: product.shortDescription,
      images: [product.images[0]],
      type: "website",
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) {
    notFound();
  }

  const getDeterministicScore = (candidateSlug: string) => {
    const seed = `${product.slug}:${candidateSlug}`;
    let hash = 0;
    for (let index = 0; index < seed.length; index += 1) {
      hash = (hash * 31 + seed.charCodeAt(index)) >>> 0;
    }
    return hash;
  };

  const relatedProducts = products
    .filter((entry) => entry.slug !== product.slug)
    .sort(
      (a, b) => getDeterministicScore(a.slug) - getDeterministicScore(b.slug)
    )
    .slice(0, 3);

  return (
    <main className="px-4 py-10 md:py-12">
      <div className="mx-auto w-full max-w-7xl">
        <Link
          href={`/categorii/${product.categorySlug}`}
          className="text-sm text-[var(--muted)] hover:text-[var(--cream)]"
        >
          ← Înapoi la categorie
        </Link>

        <section className="mt-5 grid gap-8 lg:grid-cols-2">
          <ProductGallery images={product.images} productName={product.name} />

          <div className="space-y-5">
            <h1 className="text-3xl font-semibold text-[var(--cream)] md:text-4xl">
              {product.name}
            </h1>
            <p className="text-xl font-semibold text-[var(--accent-light)]">
              {product.priceLabel}
            </p>
            <p className="leading-relaxed text-[var(--muted)]">{product.description}</p>

            <div className="rounded-xl border border-white/10 bg-[var(--lake)]/50 p-4">
              <p className="text-sm font-semibold uppercase tracking-wide text-[var(--accent-light)]">
                Specificații
              </p>
              <ul className="mt-3 space-y-2 text-sm text-[var(--muted)]">
                {product.specs.map((spec) => (
                  <li key={spec}>- {spec}</li>
                ))}
              </ul>
            </div>

            {product.customOrderNote ? (
              <div className="rounded-xl border border-[var(--accent)]/40 bg-[var(--accent)]/10 p-4">
                <p className="text-sm font-semibold uppercase tracking-wide text-[var(--accent-light)]">
                  Comenzi custom
                </p>
                <p className="mt-2 text-sm leading-relaxed text-[var(--cream)]/90">
                  {product.customOrderNote}
                </p>
                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
                    "Salut, vreau să comand baguri făcute la comandă."
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex rounded-lg bg-[#25D366] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#20bd5a]"
                >
                  Mesaj pe WhatsApp
                </a>
              </div>
            ) : null}

            <AddToCartButton
              product={{
                productSlug: product.slug,
                name: product.name,
                priceLabel: product.priceLabel,
                priceValueRon: product.priceValueRon,
                image: product.images[0],
                variantSelector: product.variantSelector,
              }}
            />
          </div>
        </section>

        {relatedProducts.length > 0 ? (
          <section className="mt-14">
            <h2 className="text-2xl font-semibold text-[var(--cream)]">
              Produse recomandate
            </h2>
            <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {relatedProducts.map((entry) => (
                <ProductCard key={entry.slug} product={entry} />
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </main>
  );
}
