import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductCard } from "@/components/public/product-card";
import { MediaImage } from "@/components/ui/media-image";
import { getCategoryBySlug, getProductsByCategory } from "@/features/products/queries";
import { getPublicSiteUrl } from "@/lib/env";
import { absoluteMedia } from "@/lib/media-url";
import { SECTION_COPY } from "@/lib/section-copy";

type Props = { params: Promise<{ slug: string }> };

export const revalidate = 60;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const category = await getCategoryBySlug(slug);
    if (!category) return { title: "Categorie negăsită" };
    const title = category.seoTitle ?? category.heroTitle ?? category.name;
    const description =
      category.seoDescription ??
      category.heroDescription ??
      category.shortDescription ??
      category.description ??
      SECTION_COPY.produse.subtitle;
    const image = absoluteMedia(category.imageKey, getPublicSiteUrl());
    return {
      title,
      description,
      openGraph: {
        title,
        description,
        url: `${getPublicSiteUrl()}/produse/categorie/${category.slug}`,
        ...(image ? { images: [{ url: image, alt: category.name }] } : {}),
      },
    };
  } catch {
    return { title: "Categorie" };
  }
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  let category: Awaited<ReturnType<typeof getCategoryBySlug>> = undefined;
  let products: Awaited<ReturnType<typeof getProductsByCategory>> = [];

  try {
    category = await getCategoryBySlug(slug);
    if (category) products = await getProductsByCategory(category.id);
  } catch (error) {
    console.error("[categorie]", error);
  }

  if (!category) notFound();

  const title = category.heroTitle ?? category.name;
  const description =
    category.heroDescription ?? category.shortDescription ?? category.description;

  return (
    <div>
      <section className="surface-depth py-16 md:py-20">
        <div className="container-lyra grid items-center gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <nav className="mb-4 text-sm text-cream/70" aria-label="Breadcrumb">
              <Link href="/produse" className="hover:text-cream">
                Produse
              </Link>
              <span className="mx-2">/</span>
              <span>{category.name}</span>
            </nav>
            <h1 className="mb-4 font-display text-5xl tracking-wide md:text-6xl">{title}</h1>
            {description ? <p className="max-w-2xl text-cream/80">{description}</p> : null}
          </div>
          <MediaImage
            src={category.imageKey}
            seed={category.visualTheme?.gradientSeed ?? `category-${category.slug}`}
            alt={category.name}
            ratio="wide"
          />
        </div>
      </section>

      <section className="section-lyra">
        <div className="container-lyra">
          {products.length > 0 ? (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <p className="text-muted">Momentan nu există produse disponibile în această categorie.</p>
          )}
        </div>
      </section>
    </div>
  );
}
