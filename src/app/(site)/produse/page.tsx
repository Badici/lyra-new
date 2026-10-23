import type { Metadata } from "next";
import Link from "next/link";
import { ProductCard } from "@/components/public/product-card";
import { MediaImage } from "@/components/ui/media-image";
import { getCatalogJourney } from "@/features/products/queries";

export const metadata: Metadata = {
  title: "Produse",
  description:
    "Parcurge catalogul LyraBaits pe categorii — monturi, nade, accesorii și altele, prezentate editorial.",
};

export default async function ProdusePage() {
  let sections: Awaited<ReturnType<typeof getCatalogJourney>> = [];
  try {
    sections = await getCatalogJourney();
  } catch (error) {
    console.error("[produse]", error);
  }

  return (
    <div>
      <section className="surface-depth py-16 md:py-20">
        <div className="container-lyra">
          <p className="font-hand mb-2 text-2xl text-sand">Catalog editorial</p>
          <h1 className="mb-4 font-display text-5xl tracking-wide md:text-6xl">Produse</h1>
          <p className="max-w-2xl text-cream/80">
            Un traseu prin categorii — fiecare secțiune poate fi personalizată din admin cu
            titluri hero, descrieri și teme vizuale.
          </p>
        </div>
      </section>

      {sections.length === 0 ? (
        <section className="section-lyra">
          <div className="container-lyra">
            <p className="text-muted">
              Catalogul nu conține încă categorii active. Rulează seed-ul sau adaugă categorii din
              admin.
            </p>
          </div>
        </section>
      ) : (
        sections.map(({ category, products }) => (
          <section key={category.id} id={category.slug} className="section-lyra border-t border-border">
            <div className="container-lyra">
              <div className="mb-10 grid items-center gap-8 lg:grid-cols-[1fr_1.1fr]">
                <div>
                  <p className="mb-2 text-xs uppercase tracking-widest text-muted">Categorie</p>
                  <h2 className="mb-3 font-display text-4xl tracking-wide md:text-5xl">
                    {category.heroTitle ?? category.name}
                  </h2>
                  <p className="max-w-xl text-muted">
                    {category.heroDescription ??
                      category.shortDescription ??
                      category.description ??
                      "Descriere categorie — placeholder până la conținut final."}
                  </p>
                  <Link
                    href={`#${category.slug}`}
                    className="mt-4 inline-block text-sm text-accent underline-offset-4 hover:underline"
                  >
                    Explorează {category.name}
                  </Link>
                </div>
                <MediaImage
                  src={category.imageKey}
                  seed={category.visualTheme?.gradientSeed ?? `category-${category.slug}`}
                  alt={category.name}
                  ratio="wide"
                />
              </div>

              {products.length > 0 ? (
                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted">
                  Nu există produse active în această categorie momentan.
                </p>
              )}
            </div>
          </section>
        ))
      )}
    </div>
  );
}
