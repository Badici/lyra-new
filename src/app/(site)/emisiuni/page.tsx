import type { Metadata } from "next";
import { ShowCard } from "@/components/public/show-card";
import { MediaImage } from "@/components/ui/media-image";
import { getPublishedShows } from "@/features/products/queries";
import { SECTION_COPY } from "@/lib/section-copy";

export const metadata: Metadata = {
  title: "Emisiuni",
  description: SECTION_COPY.emisiuni.subtitle,
};

export default async function EmisiuniPage() {
  let shows: Awaited<ReturnType<typeof getPublishedShows>> = [];
  try {
    shows = await getPublishedShows();
  } catch (error) {
    console.error("[emisiuni]", error);
  }

  return (
    <div className="section-lyra">
      <div className="container-lyra">
        <div className="mb-12 grid items-center gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="font-hand mb-2 text-2xl text-accent">Video</p>
            <h1 className="mb-4 font-display text-5xl tracking-wide md:text-6xl">
              {SECTION_COPY.emisiuni.title}
            </h1>
            <p className="max-w-2xl text-muted">{SECTION_COPY.emisiuni.subtitle}</p>
          </div>
          <MediaImage
            src="/monutri.png"
            seed="emisiuni-lead"
            alt="Monturi de crap legate, cu plumb, momitor și boilies, pe o masă de lemn"
            ratio="wide"
          />
        </div>

        {shows.length > 0 ? (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {shows.map((show) => (
              <ShowCard key={show.id} show={show} />
            ))}
          </div>
        ) : (
          <p className="text-muted">Momentan nu există emisiuni.</p>
        )}
      </div>
    </div>
  );
}
