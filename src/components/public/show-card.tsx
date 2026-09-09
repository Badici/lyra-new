import Link from "next/link";
import { MagneticHover } from "@/components/motion/magnetic-hover";
import { MediaImage } from "@/components/ui/media-image";

type ShowCardData = {
  slug: string;
  name: string;
  shortDescription?: string | null;
  coverImageKey?: string | null;
  episodeCount?: number;
};

export function ShowCard({ show }: { show: ShowCardData }) {
  return (
    <MagneticHover>
      <article className="group">
        <Link href={`/emisiuni/${show.slug}`} className="block">
          <div className="shimmer-sheen mb-4 overflow-hidden rounded-2xl">
            <MediaImage
              src={show.coverImageKey}
              seed={`show-${show.slug}`}
              alt={show.name}
              ratio="video"
              className="transition duration-500 ease-out group-hover:scale-[1.04]"
            />
          </div>
          <h3 className="font-display text-2xl tracking-wide transition-colors duration-500 group-hover:text-accent">
            {show.name}
          </h3>
          {show.shortDescription ? (
            <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted">
              {show.shortDescription}
            </p>
          ) : null}
          {typeof show.episodeCount === "number" ? (
            <p className="mt-3 text-xs text-muted">
              {show.episodeCount} {show.episodeCount === 1 ? "episod" : "episoade"}
            </p>
          ) : null}
        </Link>
      </article>
    </MagneticHover>
  );
}
