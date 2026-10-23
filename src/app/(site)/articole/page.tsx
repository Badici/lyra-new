import type { Metadata } from "next";
import { ArticleCard } from "@/components/public/article-card";
import { getPublishedArticles } from "@/features/products/queries";

export const metadata: Metadata = {
  title: "Articole",
  description: "Articole LyraBaits — ghiduri, observații și povești pentru pescari.",
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
        <p className="font-hand mb-2 text-2xl text-accent">De pe mal</p>
        <h1 className="mb-4 font-display text-5xl tracking-wide md:text-6xl">Articole</h1>
        <p className="mb-10 max-w-2xl text-muted">
          Ghiduri, observații și povești pentru pescarii de crap.
        </p>

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
