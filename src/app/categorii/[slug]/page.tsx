import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductCard } from "@/components/catalog/ProductCard";
import {
  categories,
  getCategoryBySlug,
  getProductsByCategory,
} from "@/data/catalog";

type CategoryPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return categories.map((category) => ({ slug: category.slug }));
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);

  if (!category) {
    return {
      title: "Categorie inexistentă",
    };
  }

  return {
    title: category.name,
    description: `${category.description} Vezi toate produsele din categoria ${category.name}.`,
    alternates: {
      canonical: `/categorii/${category.slug}`,
    },
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);
  if (!category) {
    notFound();
  }

  const categoryProducts = getProductsByCategory(category.slug);

  return (
    <main className="px-4 py-10 md:py-12">
      <div className="mx-auto w-full max-w-7xl">
        <Link href="/" className="text-sm text-[var(--muted)] hover:text-[var(--cream)]">
          ← Înapoi la acasă
        </Link>

        <header className="mt-5 mb-8">
          <h1 className="text-3xl font-semibold text-[var(--cream)] md:text-4xl">
            {category.name}
          </h1>
          <p className="mt-3 max-w-3xl text-[var(--muted)]">{category.description}</p>
        </header>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {categoryProducts.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      </div>
    </main>
  );
}
