import type { Metadata } from "next";
import Image from "next/image";

const PARTNERS = [
  {
    name: "Plumbi și Momitoare",
    description:
      "Colaborăm cu Plumbi și Momitoare pentru o gamă de plumbi și momitoare de înaltă calitate, testate în cele mai dure condiții de pescuit și în concursuri.",
    promo:
      "Promo special pentru cei care accesează site-ul din link-ul de mai jos: 10+1 la orice achiziție de 10 plumbi din același tip și gramaj.",
    logo: "/logo-parteneri/plumbi-si-momitoare.png",
    logoAlt: "Logo Plumbi și Momitoare",
    link: "https://plumbisimomitoare.ro/?utm_source=lyrabaits&utm_medium=referral&utm_campaign=parteneri",
  },
  {
    name: "Jack's Carp",
    description:
      "Parteneriatul cu Jack's Carp completează oferta noastră de nade și momeli, cu produse apreciate pentru consistență, ingrediente atent alese și rezultate solide atât în concursuri, cât și în partide de plăcere.",
    promo: null,
    logo: "/logo-parteneri/jacks-carp.jpg",
    logoAlt: "Logo Jack's Carp",
    link: "https://jacks-carp.ro/?utm_source=lyrabaits&utm_medium=referral&utm_campaign=parteneri",
  },
];

export const metadata: Metadata = {
  title: "Parteneri | Lyra Baits",
  description:
    "Descoperă partenerii Lyra Baits: Plumbi și Momitoare și Jack's Carp. Accesează ofertele și produsele recomandate.",
  openGraph: {
    title: "Parteneri Lyra Baits",
    description:
      "Parteneriate Lyra Baits pentru plumbi, momitoare, nade și momeli de calitate.",
    url: "/parteneri",
    type: "website",
  },
};

export default function ParteneriPage() {
  return (
    <main className="px-4 py-14 md:py-16">
      <header className="mx-auto w-full max-w-6xl text-center">
        <h1 className="text-4xl font-semibold text-[var(--cream)] md:text-5xl">Parteneri</h1>
        <p className="mx-auto mt-4 max-w-3xl text-base text-[var(--muted)] md:text-lg">
          Colaborăm cu parteneri serioși pentru a-ți oferi produse testate, eficiente și de
          încredere, indiferent dacă pescuiești la amator sau în concursuri.
        </p>
      </header>

      <section className="mx-auto mt-10 grid w-full max-w-6xl gap-6 md:grid-cols-2">
        {PARTNERS.map((partner) => (
          <article
            key={partner.name}
            className="flex h-full flex-col rounded-2xl border border-white/10 bg-[var(--lake)]/35 p-6 shadow-[0_16px_40px_rgba(0,0,0,0.2)]"
          >
            <div className="relative mb-5 h-40 overflow-hidden rounded-xl border border-white/10 bg-black/20 p-2 md:h-44">
              <Image
                src={partner.logo}
                alt={partner.logoAlt}
                fill
                className="object-contain p-2"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>

            <h2 className="text-2xl font-semibold text-[var(--cream)]">{partner.name}</h2>
            <p className="mt-3 text-sm leading-relaxed text-[var(--muted)]">{partner.description}</p>

            {partner.promo ? (
              <p className="mb-4 mt-4 rounded-xl border border-[var(--accent)]/50 bg-[var(--accent)]/10 px-4 py-3 text-sm font-medium text-[var(--accent-light)]">
                {partner.promo}
              </p>
            ) : null}

            <a
              href={partner.link}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-auto inline-flex w-fit rounded-xl bg-[var(--accent)] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[var(--accent-light)]"
            >
              Vizitează {partner.name}
            </a>
          </article>
        ))}
      </section>
    </main>
  );
}
