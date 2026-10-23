import type { Metadata } from "next";
import { ArticleCard } from "@/components/public/article-card";
import { HeroCarousel, type HeroSlide } from "@/components/public/hero-carousel";
import { ProductCard } from "@/components/public/product-card";
import { ShowCard } from "@/components/public/show-card";
import { Reveal } from "@/components/motion/reveal";
import { Stagger } from "@/components/motion/stagger";
import { Parallax } from "@/components/motion/parallax";
import { LinkButton } from "@/components/ui/link-button";
import Image from "next/image";
import {
  getPopularProducts,
  getProductsWithImages,
  getPublishedArticles,
  getPublishedShows,
} from "@/features/products/queries";
import { PRODUCTION_SITE_URL, SITE_NAME, SITE_TAGLINE } from "@/lib/constants";
import { ABOUT_IMAGE, EXAMPLE_PRODUCT_IMAGES, SECTION_COPY } from "@/lib/section-copy";

export const metadata: Metadata = {
  title: "Acasă",
  description: SITE_TAGLINE,
  openGraph: {
    title: SITE_NAME,
    description: SITE_TAGLINE,
    url: PRODUCTION_SITE_URL,
  },
};

function productPhoto(product: {
  name: string;
  mainImageKey: string | null;
  gallery: string[] | null;
}) {
  const src = product.mainImageKey || product.gallery?.[0];
  if (!src) return null;
  return { src, alt: product.name };
}

function heroSlides(
  productImages: { src: string; alt: string }[],
): HeroSlide[] {
  const photos = EXAMPLE_PRODUCT_IMAGES.map((image, index) => productImages[index] ?? image);

  return [
    {
      id: "produse",
      ...SECTION_COPY.produse,
      seed: "hero-produse",
      image: photos[0]?.src,
      imageAlt: photos[0]?.alt,
    },
    {
      id: "articole",
      ...SECTION_COPY.articole,
      seed: "hero-articole",
      image: photos[1]?.src,
      imageAlt: photos[1]?.alt,
    },
    {
      id: "emisiuni",
      ...SECTION_COPY.emisiuni,
      seed: "hero-emisiuni",
      image: photos[2]?.src,
      imageAlt: photos[2]?.alt,
    },
    {
      id: "poveste",
      ...SECTION_COPY.poveste,
      seed: "hero-poveste",
      image: ABOUT_IMAGE.src,
      imageAlt: ABOUT_IMAGE.alt,
    },
  ];
}

async function loadHomeData() {
  try {
    const [articles, shows, products, picturedProducts] = await Promise.all([
      getPublishedArticles(4),
      getPublishedShows(),
      getPopularProducts(4),
      getProductsWithImages(3),
    ]);
    return {
      articles,
      shows: shows.slice(0, 3),
      products,
      picturedProducts,
    };
  } catch (error) {
    console.error("[home]", error);
    return { articles: [], shows: [], products: [], picturedProducts: [] };
  }
}

export default async function HomePage() {
  const { articles, shows, products, picturedProducts } = await loadHomeData();
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

      <HeroCarousel
        slides={heroSlides(
          picturedProducts.map(productPhoto).filter((photo) => photo !== null),
        )}
      />

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
            <p className="text-muted">Momentan nu există produse disponibile.</p>
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
                <p className="font-hand mb-2 text-2xl text-accent">De pe mal</p>
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
            <p className="text-muted">Momentan nu există articole.</p>
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
            <p className="text-muted">Momentan nu există emisiuni.</p>
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
                {SECTION_COPY.poveste.title}
              </h2>
              <p className="mb-6 max-w-lg text-sm leading-relaxed text-cream/80 md:text-base">
                {SECTION_COPY.poveste.subtitle}
              </p>
              <LinkButton href="/povestea-noastra" variant="accent">
                Povestea noastră
              </LinkButton>
            </div>
          </Reveal>
          <Parallax offset={40} speed={0.85}>
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-depth shadow-soft ring-1 ring-cream/10">
              <Image
                src={ABOUT_IMAGE.src}
                alt={ABOUT_IMAGE.alt}
                fill
                sizes="(min-width: 768px) 36rem, 100vw"
                className="object-cover"
              />
            </div>
          </Parallax>
        </div>
      </section>
    </>
  );
}
