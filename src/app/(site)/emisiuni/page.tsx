import type { Metadata } from "next";
import { ShowCard } from "@/components/public/show-card";
import { getPublishedShows } from "@/features/products/queries";

export const metadata: Metadata = {
  title: "Emisiuni",
  description: "Emisiuni video LyraBaits — serii și episoade pentru comunitatea de pescari.",
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
        <p className="font-hand mb-2 text-2xl text-accent">Video</p>
        <h1 className="mb-4 font-display text-5xl tracking-wide md:text-6xl">Emisiuni</h1>
        <p className="mb-10 max-w-2xl text-muted">
          Serii publicate progresiv. Thumbnail-urile sunt placeholder local până la media finală.
        </p>

        {shows.length > 0 ? (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {shows.map((show) => (
              <ShowCard key={show.id} show={show} />
            ))}
          </div>
        ) : (
          <p className="text-muted">Nu există emisiuni publicate momentan.</p>
        )}
      </div>
    </div>
  );
}
