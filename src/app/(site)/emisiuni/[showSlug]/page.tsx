import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MediaImage } from "@/components/ui/media-image";
import { getShowBySlug } from "@/features/products/queries";
import { youtubeThumbnailUrl } from "@/lib/youtube";

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
          <MediaImage
            src={show.coverImageKey}
            seed={`show-${show.slug}`}
            alt={show.name}
            ratio="wide"
            priority
          />
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
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {show.episodes.map((episode) => {
              const thumb =
                episode.thumbnailKey ?? youtubeThumbnailUrl(episode.videoUrl);
              return (
                <li key={episode.id}>
                  <Link
                    href={`/emisiuni/${show.slug}/${episode.slug}`}
                    className="group block"
                  >
                    <MediaImage
                      src={thumb}
                      seed={`episode-${episode.slug}`}
                      alt={episode.title}
                      ratio="video"
                      className="mb-3 transition duration-500 group-hover:scale-[1.02]"
                    />
                    <p className="text-xs uppercase tracking-widest text-muted">
                      Ep. {episode.episodeNumber}
                      {episode.seasonNumber ? ` · Sezon ${episode.seasonNumber}` : ""}
                    </p>
                    <h3 className="font-display text-2xl tracking-wide group-hover:text-accent">
                      {episode.title}
                    </h3>
                    {episode.description ? (
                      <p className="mt-1 line-clamp-2 text-sm text-muted">{episode.description}</p>
                    ) : null}
                  </Link>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="text-muted">Nu există episoade publicate pentru această emisiune.</p>
        )}
      </div>
    </div>
  );
}
