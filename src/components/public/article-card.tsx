import Link from "next/link";
import { MagneticHover } from "@/components/motion/magnetic-hover";
import { PlaceholderMedia } from "@/components/ui/placeholder-media";

type ArticleCardData = {
  slug: string;
  title: string;
  excerpt?: string | null;
  publishedAt?: Date | null;
  authorName?: string | null;
  featured?: boolean;
};

export function ArticleCard({
  article,
  featured = false,
}: {
  article: ArticleCardData;
  featured?: boolean;
}) {
  const dateLabel = article.publishedAt
    ? new Intl.DateTimeFormat("ro-RO", { dateStyle: "medium" }).format(article.publishedAt)
    : null;

  return (
    <MagneticHover className={featured ? "md:col-span-2" : undefined}>
      <article className="group h-full">
        <Link href={`/articole/${article.slug}`} className="block h-full">
          <div
            className={`shimmer-sheen mb-4 overflow-hidden rounded-2xl ${featured ? "md:aspect-[21/9]" : ""}`}
          >
            <PlaceholderMedia
              seed={`article-${article.slug}`}
              ratio={featured ? "wide" : "video"}
              label="Articol"
              className="transition duration-500 ease-out group-hover:scale-[1.04]"
            />
          </div>
          {dateLabel ? (
            <p className="mb-1 text-xs uppercase tracking-wider text-muted">{dateLabel}</p>
          ) : null}
          <h3
            className={`font-display tracking-wide transition-colors duration-500 group-hover:text-accent ${featured ? "text-3xl md:text-4xl" : "text-2xl"}`}
          >
            {article.title}
          </h3>
          {article.excerpt ? (
            <p
              className={`mt-2 leading-relaxed text-muted ${featured ? "line-clamp-4 text-base" : "line-clamp-3 text-sm"}`}
            >
              {article.excerpt}
            </p>
          ) : null}
          {article.authorName ? (
            <p className="mt-3 text-xs text-muted">de {article.authorName}</p>
          ) : null}
        </Link>
      </article>
    </MagneticHover>
  );
}
