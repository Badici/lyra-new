import type { Metadata } from "next";
import { ArticleCard } from "@/components/public/article-card";
import { HeroCarousel, type HeroSlide } from "@/components/public/hero-carousel";
import { ProductCard } from "@/components/public/product-card";
import { ShowCard } from "@/components/public/show-card";
import { Reveal } from "@/components/motion/reveal";
import { Stagger } from "@/components/motion/stagger";
import { Parallax } from "@/components/motion/parallax";
import { LinkButton } from "@/components/ui/link-button";
import { PlaceholderMedia } from "@/components/ui/placeholder-media";
import {
  getPopularProducts,
  getPublishedArticles,
  getPublishedShows,
} from "@/features/products/queries";
import { PRODUCTION_SITE_URL, SITE_NAME, SITE_TAGLINE } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Acasă",
  description: SITE_TAGLINE,
  openGraph: {
    title: SITE_NAME,
    description: SITE_TAGLINE,
    url: PRODUCTION_SITE_URL,
  },
};

const HERO_SLIDES: HeroSlide[] = [
  {
    id: "produse",
    title: "Produse pentru apă și poveste",
    subtitle:
      "Monturi, nade și accesorii prezentate editorial — nu ca un catalog generic, ci ca un traseu prin universul LyraBaits.",
    seed: "hero-produse",
    href: "/produse",
    cta: "Descoperă produsele",
  },
  {
    id: "articole",
    title: "Articole din teren",
    subtitle:
      "Ghiduri, observații și materiale editoriale pentru pescari — conținut care poate fi înlocuit cu articole reale din admin.",
    seed: "hero-articole",
    href: "/articole",
    cta: "Citește articole",
  },
  {
    id: "emisiuni",
    title: "Emisiuni LyraBaits",
    subtitle:
      "Serii video și episoade publicate progresiv. Placeholder editorial până la conținut final.",
    seed: "hero-emisiuni",
    href: "/emisiuni",
    cta: "Vezi emisiunile",
  },
  {
    id: "poveste",
    title: "Povestea din spatele brandului",
    subtitle:
      "Un hub creat de pescari — produse, conținut și comunitate într-un singur ritm editorial.",
    seed: "hero-poveste",
    href: "/povestea-noastra",
    cta: "Povestea noastră",
  },
];

async function loadHomeData() {
  try {
    const [articles, shows, products] = await Promise.all([
      getPublishedArticles(4),
      getPublishedShows(),
      getPopularProducts(4),
    ]);
    return {
      articles,
      shows: shows.slice(0, 3),
      products,
    };
  } catch (error) {
    console.error("[home]", error);
    return { articles: [], shows: [], products: [] };
  }
}

export default async function HomePage() {
  const { articles, shows, products } = await loadHomeData();
  const [featuredArticle, ...restArticles] = articles;

  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: PRODUCTION_SITE_URL,
    logo: `${PRODUCTION_SITE_URL}/brand/logo-lyra.png`,
    description: SITE_TAGLINE,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
      />

      <HeroCarousel slides={HERO_SLIDES} />

      <section className="section-lyra section-veil">
        <div className="container-lyra relative">
          <Reveal>
            <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="font-hand mb-2 text-2xl text-accent">Popular</p>
                <h2 className="font-display text-4xl tracking-wide md:text-5xl">
                  Produse alese
                </h2>
              </div>
              <LinkButton href="/produse" variant="secondary">
                Vezi catalogul
              </LinkButton>
            </div>
          </Reveal>
          {products.length > 0 ? (
            <Stagger className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </Stagger>
          ) : (
            <p className="text-muted">
              Nu există încă produse publicate. Revino curând sau explorează structura
              catalogului.
            </p>
          )}
        </div>
      </section>

      <section className="section-lyra relative overflow-hidden bg-fog/35">
        <div
          className="pointer-events-none absolute -right-20 top-10 h-64 w-64 rounded-full bg-accent/10 blur-3xl"
          aria-hidden
        />
        <div className="container-lyra relative">
          <Reveal>
            <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="font-hand mb-2 text-2xl text-accent">Editorial</p>
                <h2 className="font-display text-4xl tracking-wide md:text-5xl">
                  Ultimele articole
                </h2>
              </div>
              <LinkButton href="/articole" variant="secondary">
                Toate articolele
              </LinkButton>
            </div>
          </Reveal>
          {articles.length > 0 ? (
            <div className="grid gap-8 md:grid-cols-3">
              {featuredArticle ? (
                <Reveal className="md:col-span-2" delay={0.05}>
                  <ArticleCard article={featuredArticle} featured />
                </Reveal>
              ) : null}
              <Stagger className="grid gap-8">
                {restArticles.slice(0, 2).map((article) => (
                  <ArticleCard key={article.id} article={article} />
                ))}
              </Stagger>
            </div>
          ) : (
            <p className="text-muted">Articolele vor apărea aici după publicare.</p>
          )}
        </div>
      </section>

      <section className="section-lyra">
        <div className="container-lyra">
          <Reveal>
            <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="font-hand mb-2 text-2xl text-accent">Video</p>
                <h2 className="font-display text-4xl tracking-wide md:text-5xl">Emisiuni</h2>
              </div>
              <LinkButton href="/emisiuni" variant="secondary">
                Vezi toate
              </LinkButton>
            </div>
          </Reveal>
          {shows.length > 0 ? (
            <Stagger className="grid gap-8 md:grid-cols-3">
              {shows.map((show) => (
                <ShowCard key={show.id} show={show} />
              ))}
            </Stagger>
          ) : (
            <p className="text-muted">Emisiunile vor fi listate aici când sunt publicate.</p>
          )}
        </div>
      </section>

      <section className="surface-forest section-lyra relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 grain-overlay opacity-30" aria-hidden />
        <div className="container-lyra relative grid items-center gap-10 md:grid-cols-2">
          <Reveal>
            <div>
              <p className="font-hand mb-2 text-2xl text-sand">Poveste</p>
              <h2 className="mb-4 font-display text-4xl tracking-wide md:text-5xl">
                Mai mult decât un magazin
              </h2>
              <p className="mb-6 max-w-lg text-sm leading-relaxed text-cream/80 md:text-base">
                Secțiune narativă cu placeholder artistic — fără istoric inventat. Conținutul
                final va fi adăugat de echipă.
              </p>
              <LinkButton href="/povestea-noastra" variant="accent">
                Povestea noastră
              </LinkButton>
            </div>
          </Reveal>
          <Parallax offset={40} speed={0.85}>
            <PlaceholderMedia
              seed="story-preview"
              ratio="portrait"
              label="Placeholder poveste"
              className="ring-1 ring-cream/10 shadow-soft"
            />
          </Parallax>
        </div>
      </section>
    </>
  );
}
