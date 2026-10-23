import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MediaImage } from "@/components/ui/media-image";
import { getEpisode } from "@/features/products/queries";
import { youtubeEmbedUrl, youtubeThumbnailUrl } from "@/lib/youtube";

type Props = { params: Promise<{ showSlug: string; episodeSlug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { showSlug, episodeSlug } = await params;
  try {
    const data = await getEpisode(showSlug, episodeSlug);
    if (!data) return { title: "Episod negăsit" };
    return {
      title: data.episode.seoTitle ?? data.episode.title,
      description:
        data.episode.seoDescription ?? data.episode.description ?? data.show.shortDescription ?? undefined,
    };
  } catch {
    return { title: "Episod" };
  }
}

export default async function EpisodePage({ params }: Props) {
  const { showSlug, episodeSlug } = await params;

  let data: Awaited<ReturnType<typeof getEpisode>> | null = null;
  try {
    data = await getEpisode(showSlug, episodeSlug);
  } catch (error) {
    console.error("[episode]", error);
  }

  if (!data) notFound();

  const { show, episode } = data;
  const embed = youtubeEmbedUrl(episode.videoUrl);

  return (
    <article className="section-lyra">
      <div className="container-lyra max-w-4xl">
        <nav className="mb-6 text-sm text-muted">
          <Link href="/emisiuni" className="hover:text-foreground">
            Emisiuni
          </Link>
          <span className="mx-2">/</span>
          <Link href={`/emisiuni/${show.slug}`} className="hover:text-foreground">
            {show.name}
          </Link>
        </nav>

        <p className="mb-2 text-xs uppercase tracking-widest text-muted">
          Episodul {episode.episodeNumber}
          {episode.seasonNumber ? ` · Sezon ${episode.seasonNumber}` : ""}
        </p>
        <h1 className="mb-6 font-display text-5xl tracking-wide">{episode.title}</h1>

        {embed ? (
          <div className="mb-8 aspect-video overflow-hidden rounded-2xl bg-depth">
            <iframe
              src={embed}
              title={episode.title}
              className="h-full w-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        ) : (
          <MediaImage
            src={episode.thumbnailKey ?? youtubeThumbnailUrl(episode.videoUrl)}
            seed={`episode-${episode.slug}`}
            alt={episode.title}
            ratio="video"
            className="mb-8"
          />
        )}

        {episode.description ? (
          <p className="leading-relaxed text-muted">{episode.description}</p>
        ) : (
          <p className="text-muted">Descriere episod — placeholder editorial.</p>
        )}
      </div>
    </article>
  );
}
