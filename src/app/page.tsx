import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CategoryCard } from "@/components/catalog/CategoryCard";
import { ProductCard } from "@/components/catalog/ProductCard";
import {
  categories,
  getProductsByCategory,
  products,
  WHATSAPP_NUMBER,
} from "@/data/catalog";

export const metadata: Metadata = {
  title: "Produse pentru pescuit la crap",
  description:
    "Catalog Lyra Baits cu produse organizate pe categorii: cârlige, monturi, forface, nade, pelete și aditivi pentru pescuit la crap.",
  alternates: {
    canonical: "/",
  },
};

export default function Home() {
  const highlightedProducts = products.slice(0, 2);

  return (
    <main>
      <section className="relative overflow-hidden border-b border-white/10 px-4 py-20 md:py-28">
        <Image
          src="/hero.jpeg"
          alt="Produse Lyra Baits pentru pescuit la crap"
          fill
          priority
          className="object-cover opacity-35"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--background)]/35 via-[var(--background)]/75 to-[var(--background)]" />
        <div className="relative mx-auto max-w-5xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--accent-light)]">
            Lyra Baits
          </p>
          <h1 className="mt-4 text-4xl font-semibold text-[var(--cream)] md:text-6xl">
            Tot ce ai nevoie pentru pescuitul la crap
          </h1>
          <p className="mx-auto mt-5 max-w-3xl text-base leading-relaxed text-[var(--muted)] md:text-lg">
            Descoperă categoriile noastre, intră pe produsul dorit și trimite
            comandă direct pe WhatsApp în câteva secunde.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/categorii/carlige-accesorii"
              className="rounded-xl bg-[var(--accent)] px-5 py-3 font-semibold text-white transition-colors hover:bg-[var(--accent-light)]"
            >
              Vezi cârlige și accesorii
            </Link>
            <Link
              href="/categorii/monturi-forface"
              className="rounded-xl border border-[var(--accent)]/50 bg-[var(--lake)] px-5 py-3 font-semibold text-[var(--cream)] transition-colors hover:bg-[var(--accent)]/20"
            >
              Vezi monturi și forface
            </Link>
            <Link
              href="/categorii/nade-aditivi"
              className="rounded-xl border border-[var(--accent)]/50 bg-[var(--lake)] px-5 py-3 font-semibold text-[var(--cream)] transition-colors hover:bg-[var(--accent)]/20"
            >
              Vezi nade și aditivi
            </Link>
          </div>
          <p className="mt-6 text-sm text-[var(--muted)]">
            Comenzi rapide pe WhatsApp: +40 728 241 412
          </p>
        </div>
      </section>

      <section className="px-4 py-14 md:py-16">
        <div className="mx-auto w-full max-w-7xl">
          <div className="mb-8">
            <h2 className="text-3xl font-semibold text-[var(--cream)]">
              Categorii de produse
            </h2>
            <p className="mt-2 text-[var(--muted)]">
              Fiecare categorie are pagină separată, cu produse detaliate și poze.
            </p>
          </div>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {categories.map((category) => (
              <CategoryCard
                key={category.slug}
                category={category}
                productCount={getProductsByCategory(category.slug).length}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-[var(--lake)]/25 px-4 py-14 md:py-16">
        <div className="mx-auto w-full max-w-7xl">
          <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="text-3xl font-semibold text-[var(--cream)]">
                Produse recomandate
              </h2>
              <p className="mt-2 text-[var(--muted)]">
                O selecție rapidă din catalogul nou Lyra Baits.
              </p>
            </div>
            <Link
              href="/categorii/nade-aditivi"
              className="text-sm font-semibold text-[var(--accent-light)] hover:underline"
            >
              Vezi toate produsele din nade și aditivi
            </Link>
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            {highlightedProducts.map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-14 md:py-16">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 rounded-2xl border border-white/10 bg-[var(--lake)] p-6 md:flex-row md:items-center md:justify-between md:p-8">
          <div>
            <h2 className="text-2xl font-semibold text-[var(--cream)]">
              Ai lista finală de produse?
            </h2>
            <p className="mt-2 text-[var(--muted)]">
              În coș completezi datele de livrare (adresă, telefon, email), iar
              mesajul pentru WhatsApp se generează automat.
            </p>
          </div>
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex rounded-xl bg-[#25D366] px-5 py-3 font-semibold text-white transition-colors hover:bg-[#20bd5a]"
          >
            Contact direct pe WhatsApp
          </a>
        </div>
      </section>
    </main>
  );
}
