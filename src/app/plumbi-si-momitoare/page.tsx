import type { Metadata } from "next";

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
  return (
    <main className="px-4 py-10 md:py-12">
      <div className="mx-auto w-full max-w-4xl rounded-2xl border border-white/10 bg-[var(--lake)]/30 p-6 md:p-8">
        <h1 className="text-3xl font-semibold text-[var(--cream)] md:text-4xl">
          Plumbi și momitoare
        </h1>
        <p className="mt-3 text-[var(--muted)]">
          Pentru gama completă de plumbi și momitoare colaborăm cu Levi, de la
          plumbisimomitoare.ro.
        </p>

        <a
          href="/api/affiliate/redirect?target=levi"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 rounded-xl bg-[var(--accent)] px-5 py-3 font-semibold text-white hover:bg-[var(--accent-light)]"
        >
          Vezi oferta pe plumbisimomitoare.ro
        </a>
      </div>
    </main>
  );
}
