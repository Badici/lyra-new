import type { Metadata } from "next";
import { ArticleCard } from "@/components/public/article-card";
import { MediaImage } from "@/components/ui/media-image";
import { getPublishedArticles } from "@/features/products/queries";
import { EXAMPLE_PRODUCT_IMAGES, SECTION_COPY } from "@/lib/section-copy";

export const metadata: Metadata = {
  title: "Articole",
  description: SECTION_COPY.articole.subtitle,
};

export default async function ArticolePage() {
  let articles: Awaited<ReturnType<typeof getPublishedArticles>> = [];
  try {
    articles = await getPublishedArticles();
  } catch (error) {
    console.error("[articole]", error);
  }

  return (
    <div className="section-lyra">
      <div className="container-lyra">
        <div className="mb-12 grid items-center gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="font-hand mb-2 text-2xl text-accent">De pe mal</p>
            <h1 className="mb-4 font-display text-5xl tracking-wide md:text-6xl">
              {SECTION_COPY.articole.title}
            </h1>
            <p className="max-w-2xl text-muted">{SECTION_COPY.articole.subtitle}</p>
          </div>
          <MediaImage
            src={EXAMPLE_PRODUCT_IMAGES[1].src}
            seed="articole-lead"
            alt={EXAMPLE_PRODUCT_IMAGES[1].alt}
            ratio="wide"
          />
        </div>

        {articles.length > 0 ? (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        ) : (
          <p className="text-muted">Momentan nu există articole.</p>
        )}
      </div>
    </div>
  );
}
