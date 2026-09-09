import type { Metadata } from "next";
import { ArticleCard } from "@/components/public/article-card";
import { getPublishedArticles } from "@/features/products/queries";

export const metadata: Metadata = {
  title: "Articole",
  description: "Articole editoriale LyraBaits — ghiduri, observații și materiale pentru pescari.",
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
        <p className="font-hand mb-2 text-2xl text-accent">Editorial</p>
        <h1 className="mb-4 font-display text-5xl tracking-wide md:text-6xl">Articole</h1>
        <p className="mb-10 max-w-2xl text-muted">
          Materiale publicate din admin. Dacă baza de date este goală, această pagină rămâne
          pregătită pentru conținut real.
        </p>

        {articles.length > 0 ? (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        ) : (
          <p className="text-muted">Nu există articole publicate momentan.</p>
        )}
      </div>
    </div>
  );
}
