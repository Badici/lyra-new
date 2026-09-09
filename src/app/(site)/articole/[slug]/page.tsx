import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PlaceholderMedia } from "@/components/ui/placeholder-media";
import { getArticleBySlug } from "@/features/products/queries";
import { extractTipTapText } from "@/lib/content";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const article = await getArticleBySlug(slug);
    if (!article) return { title: "Articol negăsit" };
    return {
      title: article.seoTitle ?? article.title,
      description: article.seoDescription ?? article.excerpt ?? undefined,
    };
  } catch {
    return { title: "Articol" };
  }
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;

  let article: Awaited<ReturnType<typeof getArticleBySlug>> | undefined;
  try {
    article = await getArticleBySlug(slug);
  } catch (error) {
    console.error("[article]", error);
  }

  if (!article) notFound();

  const body = extractTipTapText(article.content);
  const dateLabel = article.publishedAt
    ? new Intl.DateTimeFormat("ro-RO", { dateStyle: "long" }).format(article.publishedAt)
    : null;

  return (
    <article className="section-lyra">
      <div className="container-lyra max-w-3xl">
        <Link href="/articole" className="mb-6 inline-block text-sm text-muted hover:text-foreground">
          ← Toate articolele
        </Link>

        {dateLabel ? (
          <p className="mb-2 text-xs uppercase tracking-widest text-muted">{dateLabel}</p>
        ) : null}
        <h1 className="mb-4 font-display text-5xl tracking-wide">{article.title}</h1>
        {article.authorName ? (
          <p className="mb-8 text-sm text-muted">de {article.authorName}</p>
        ) : null}

        <PlaceholderMedia
          seed={`article-${article.slug}`}
          ratio="wide"
          label="Copertă articol"
          className="mb-10"
        />

        {article.excerpt ? (
          <p className="mb-8 text-lg leading-relaxed text-muted">{article.excerpt}</p>
        ) : null}

        {body ? (
          <div className="space-y-4 leading-relaxed text-foreground">
            {body.split("\n\n").map((paragraph) => (
              <p key={paragraph.slice(0, 32)}>{paragraph}</p>
            ))}
          </div>
        ) : (
          <p className="text-muted">Conținut editorial în curs de publicare.</p>
        )}
      </div>
    </article>
  );
}
