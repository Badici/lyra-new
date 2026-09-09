import { cn } from "@/lib/utils";
import { placeholderStyle } from "@/lib/media";

type Props = {
  seed: string;
  className?: string;
  label?: string;
  ratio?: "video" | "square" | "wide" | "portrait";
};

const ratios = {
  video: "aspect-video",
  square: "aspect-square",
  wide: "aspect-[21/9]",
  portrait: "aspect-[3/4]",
};

export function PlaceholderMedia({
  seed,
  className,
  label,
  ratio = "video",
}: Props) {
  return (
    <div
      role="img"
      aria-label={label ?? "Imagine placeholder LyraBaits"}
      className={cn(
        "placeholder-media relative overflow-hidden rounded-2xl",
        ratios[ratio],
        className,
      )}
      style={placeholderStyle(seed)}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(243,238,228,0.22),transparent_45%)]" />
      <div
        className="pointer-events-none absolute inset-0 opacity-30 mix-blend-overlay"
        style={{
          backgroundImage:
            "repeating-linear-gradient(135deg, transparent 0 10px, rgba(0,0,0,0.08) 10px 11px)",
        }}
        aria-hidden
      />
      <div className="pointer-events-none absolute inset-0 grain-overlay opacity-25" aria-hidden />
      {label ? (
        <span className="absolute bottom-3 left-3 rounded-full bg-depth/55 px-3 py-1 text-xs tracking-wide text-cream backdrop-blur-sm">
          {label}
        </span>
      ) : null}
    </div>
  );
}
