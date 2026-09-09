import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PlaceholderMedia } from "@/components/ui/placeholder-media";
import { getShowBySlug } from "@/features/products/queries";

type Props = { params: Promise<{ showSlug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { showSlug } = await params;
  try {
    const show = await getShowBySlug(showSlug);
    if (!show) return { title: "Emisiune negăsită" };
    return {
      title: show.seoTitle ?? show.name,
      description: show.seoDescription ?? show.shortDescription ?? show.description ?? undefined,
    };
  } catch {
    return { title: "Emisiune" };
  }
}

export default async function ShowPage({ params }: Props) {
  const { showSlug } = await params;

  let show: Awaited<ReturnType<typeof getShowBySlug>> | undefined;
  try {
    show = await getShowBySlug(showSlug);
  } catch (error) {
    console.error("[show]", error);
  }

  if (!show) notFound();

  return (
    <div className="section-lyra">
      <div className="container-lyra">
        <Link href="/emisiuni" className="mb-6 inline-block text-sm text-muted hover:text-foreground">
          ← Toate emisiunile
        </Link>

        <div className="mb-10 grid gap-8 lg:grid-cols-2">
          <PlaceholderMedia seed={`show-${show.slug}`} ratio="wide" label={show.name} />
          <div>
            <h1 className="mb-4 font-display text-5xl tracking-wide">{show.name}</h1>
            <p className="leading-relaxed text-muted">
              {show.description ??
                show.shortDescription ??
                "Descriere emisiune — placeholder editorial."}
            </p>
          </div>
        </div>

        <h2 className="mb-6 font-display text-4xl tracking-wide">Episoade</h2>
        {show.episodes.length > 0 ? (
          <ul className="divide-y divide-border">
            {show.episodes.map((episode) => (
              <li key={episode.id} className="flex flex-wrap items-center justify-between gap-4 py-4">
                <div>
                  <p className="text-xs uppercase tracking-widest text-muted">
                    Ep. {episode.episodeNumber}
                    {episode.seasonNumber ? ` · Sezon ${episode.seasonNumber}` : ""}
                  </p>
                  <Link
                    href={`/emisiuni/${show.slug}/${episode.slug}`}
                    className="font-display text-2xl tracking-wide hover:text-accent"
                  >
                    {episode.title}
                  </Link>
                  {episode.description ? (
                    <p className="mt-1 max-w-2xl text-sm text-muted">{episode.description}</p>
                  ) : null}
                </div>
                <Link
                  href={`/emisiuni/${show.slug}/${episode.slug}`}
                  className="text-sm text-accent underline-offset-4 hover:underline"
                >
                  Vezi episodul
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-muted">Nu există episoade publicate pentru această emisiune.</p>
        )}
      </div>
    </div>
  );
}
