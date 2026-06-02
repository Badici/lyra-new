import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ProductCard } from "@/components/catalog/ProductCard";
import { WHATSAPP_NUMBER } from "@/data/catalog";
import { getCatalogProducts } from "@/lib/catalog-service";

export const metadata: Metadata = {
  title: "Produse pentru pescuit la crap",
  description:
    "Catalog Lyra Baits cu monturi, forface, cârlige, accesorii și pelete pentru pescuit la crap.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Produse pentru pescuit la crap | Lyra Baits",
    description:
      "Vezi monturi, forface, cârlige, accesorii și pelete din catalogul Lyra Baits.",
    type: "website",
    url: "/",
  },
};

export default async function Home() {
  const highlightedProducts = (await getCatalogProducts()).slice(0, 2);

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
        <div className="absolute -top-10 left-1/2 h-56 w-56 -translate-x-1/2 rounded-full bg-[var(--accent)]/25 blur-3xl md:h-80 md:w-80" />
        <div className="absolute bottom-8 right-8 hidden h-44 w-44 rounded-full border-2 border-[var(--accent-light)]/70 bg-[var(--accent)]/15 blur-[1px] md:block" />
        <div className="relative mx-auto max-w-5xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--accent-light)]">
            Lyra Baits
          </p>
          <h1 className="mt-4 text-4xl font-semibold text-[var(--cream)] md:text-6xl">
            Tot ce ai nevoie pentru pescuitul la crap
          </h1>
          <p className="mx-auto mt-5 max-w-3xl text-base leading-relaxed text-[var(--muted)] md:text-lg">
            Descoperă catalogul nostru complet, alege produsele dorite și trimite
            comanda direct pe WhatsApp în câteva secunde.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/catalog"
              className="rounded-xl bg-[var(--accent)] px-5 py-3 font-semibold text-white transition-colors hover:bg-[var(--accent-light)]"
            >
              Vezi catalogul de produse
            </Link>
          </div>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3 text-sm font-semibold uppercase tracking-wide md:text-base">
            <span className="rounded-full border-2 border-[var(--accent)]/65 bg-[var(--accent)]/20 px-5 py-2 text-[var(--accent-light)] shadow-[0_0_32px_rgba(251,191,36,0.28)]">
              Cel mai bun raport calitate-preț
            </span>
            <span className="rounded-full border-2 border-[var(--accent)]/65 bg-[var(--accent)]/20 px-5 py-2 text-[var(--accent-light)] shadow-[0_0_32px_rgba(251,191,36,0.28)]">
              Bag-uri la preț competitiv
            </span>
          </div>
          <p className="mt-6 text-sm text-[var(--muted)]">
            Comenzi rapide pe WhatsApp: +40 728 241 412
          </p>
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
              href="/catalog"
              className="text-sm font-semibold text-[var(--accent-light)] hover:underline"
            >
              Vezi catalogul complet
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
