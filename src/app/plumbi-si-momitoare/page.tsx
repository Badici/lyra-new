import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Plumbi și momitoare",
  description:
    "Colaborare Lyra Baits cu plumbisimomitoare.ro pentru plumbi și momitoare premium.",
  alternates: {
    canonical: "/plumbi-si-momitoare",
  },
  openGraph: {
    title: "Plumbi și momitoare | Lyra Baits",
    description: "Acces direct la oferta Levi de la plumbisimomitoare.ro.",
    type: "website",
    url: "/plumbi-si-momitoare",
  },
};

export default function LeadPage() {
  const items = [
    { src: "/plumbi/plumb-bag.png", alt: "Plumb bag pentru monturi PVA" },
    { src: "/plumbi/plumb-para-inline.png", alt: "Plumb para inline pentru crap" },
    { src: "/plumbi/plumb-para.png", alt: "Plumb para pentru lansări la distanță" },
    { src: "/plumbi/plumbi-lacrima.png", alt: "Plumbi lacrimă pentru monturi fixe" },
    { src: "/plumbi/plumbi-trident-1.png", alt: "Plumb trident pentru substrat greu" },
    { src: "/plumbi/plumb-pasta.png", alt: "Plumb pentru pastă cu prindere sigură" },
    { src: "/plumbi/momitoare-3-spite.png", alt: "Momitor trei spițe pentru feeder" },
    { src: "/plumbi/momitoare-medii.png", alt: "Set momitoare medii pentru pescuit staționar" },
    { src: "/plumbi/momitoare-dunare.png", alt: "Momitoare pentru curent puternic Dunăre" },
    { src: "/plumbi/7.png", alt: "Plumbi și momitoare diverse gramaje" },
  ];

  return (
    <main className="px-4 py-10 md:py-12">
      <section className="mx-auto w-full max-w-7xl overflow-hidden rounded-3xl border border-white/10 bg-[var(--lake)]/30">
        <div className="relative border-b border-white/10 px-6 py-10 md:px-10 md:py-14">
          <div className="absolute -top-10 right-0 h-40 w-40 rounded-full bg-[var(--accent)]/25 blur-3xl" />
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--accent-light)]">
            Colaborare oficială
          </p>
          <h1 className="mt-3 text-3xl font-semibold text-[var(--cream)] md:text-5xl">
            Plumbi și momitoare de la Levi
          </h1>
          <p className="mt-4 max-w-3xl text-[var(--muted)]">
            Pentru gama completă de plumbi și momitoare colaborăm cu Levi, de la
            plumbisimomitoare.ro. Mai jos ai o selecție vizuală din oferta disponibilă.
          </p>
          <a
            href="/api/affiliate/redirect?target=levi"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex rounded-xl bg-[var(--accent)] px-6 py-3 font-semibold text-white transition-colors hover:bg-[var(--accent-light)]"
          >
            Vezi oferta completă pe plumbisimomitoare.ro
          </a>
        </div>

        <div className="grid gap-4 p-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((item) => (
            <article
              key={item.src}
              className="group overflow-hidden rounded-2xl border border-white/10 bg-black/10"
            >
              <div className="relative aspect-square">
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 1024px) 50vw, 25vw"
                />
              </div>
              <p className="p-3 text-sm text-[var(--muted)]">{item.alt}</p>
            </article>
          ))}
        </div>
      </section>
      <div className="mx-auto mt-6 max-w-7xl rounded-2xl border border-[var(--accent)]/30 bg-[var(--accent)]/10 p-4 text-sm text-[var(--cream)]">
        Link-ul de mai sus include tracking UTM, ca să poți vedea traficul venit din Lyra către
        plumbisimomitoare.ro.
      </div>
    </main>
  );
}
