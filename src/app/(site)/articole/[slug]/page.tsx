import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { TipTapContent } from "@/components/public/tiptap-content";
import { MediaImage } from "@/components/ui/media-image";
import { getArticleBySlug } from "@/features/products/queries";

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

        <MediaImage
          src={article.coverImageKey}
          seed={`article-${article.slug}`}
          alt={article.title}
          ratio="wide"
          className="mb-10"
          priority
        />

        {article.excerpt ? (
          <p className="mb-8 text-lg leading-relaxed text-muted">{article.excerpt}</p>
        ) : null}

        <TipTapContent content={article.content} />
      </div>
    </article>
  );
}
