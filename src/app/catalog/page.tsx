import type { Metadata } from "next";
import Link from "next/link";
import { ProductCard } from "@/components/catalog/ProductCard";
import { getCatalogProducts } from "@/lib/catalog-service";

export const metadata: Metadata = {
  title: "Catalog produse",
  description:
    "Catalogul complet Lyra Baits cu monturi, forface, cârlige, accesorii și pelete pentru pescuit la crap.",
  alternates: {
    canonical: "/catalog",
  },
  openGraph: {
    title: "Catalog produse | Lyra Baits",
    description:
      "Vezi toate produsele disponibile Lyra Baits, cu detalii și comandă rapidă pe WhatsApp.",
    type: "website",
    url: "/catalog",
  },
};

export default async function CatalogPage() {
  const displayProducts = await getCatalogProducts();

  return (
    <main className="px-4 py-10 md:py-12">
      <div className="mx-auto w-full max-w-7xl">
        <Link href="/" className="text-sm text-[var(--muted)] hover:text-[var(--cream)]">
          ← Înapoi la acasă
        </Link>

        <header className="mt-5 mb-8">
          <h1 className="text-3xl font-semibold text-[var(--cream)] md:text-4xl">
            Catalog produse
          </h1>
          <p className="mt-3 max-w-3xl text-[var(--muted)]">
            Toată gama disponibilă Lyra Baits, într-un singur loc. Alege produsul,
            configurează-l dacă este cazul și adaugă-l direct în coș.
          </p>
        </header>

        <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {displayProducts.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </section>
      </div>
    </main>
  );
}
