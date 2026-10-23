import { PlaceholderMedia } from "@/components/ui/placeholder-media";
import { mediaUrl } from "@/lib/media-url";
import { cn } from "@/lib/utils";

type Props = {
  src?: string | null;
  seed: string;
  alt: string;
  className?: string;
  ratio?: "video" | "square" | "wide" | "portrait";
  priority?: boolean;
};

const ratios = {
  video: "aspect-video",
  square: "aspect-square",
  wide: "aspect-[21/9]",
  portrait: "aspect-[3/4]",
};

export function MediaImage({
  src,
  seed,
  alt,
  className,
  ratio = "video",
}: Props) {
  const url = mediaUrl(src);
  if (!url) {
    return (
      <PlaceholderMedia seed={seed} ratio={ratio} label={alt} className={className} />
    );
  }

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl bg-depth",
        ratios[ratio],
        className,
      )}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={url} alt={alt} className="absolute inset-0 h-full w-full object-cover" />
    </div>
  );
}
