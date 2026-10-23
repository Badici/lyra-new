import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Termeni și condiții",
  description: "Condițiile de utilizare a site-ului și de plasare a comenzilor LyraBaits.",
  openGraph: {
    title: "Termeni și condiții",
    description: "Condițiile de utilizare a site-ului și de plasare a comenzilor LyraBaits.",
    url: "/termeni-si-conditii",
  },
};

export default function TermeniPage() {
  return (
    <div className="section-lyra">
      <div className="container-lyra max-w-3xl">
        <h1 className="mb-6 font-display text-5xl tracking-wide">Termeni și condiții</h1>
        <div className="space-y-4 text-muted">
          <p>
            Pe lyrabaits.ro poți vedea produsele și plasa comenzi. Mai jos sunt condițiile generale
            de folosire a site-ului.
          </p>
          <h2 className="font-display text-2xl text-foreground">Comenzi și plăți</h2>
          <p>Comenzile se plasează online, iar plata se face ramburs, la livrare.</p>
          <h2 className="font-display text-2xl text-foreground">Produse la comandă</h2>
          <p>
            Produsele care nu sunt pe stoc pot fi comandate. Te contactăm ca să stabilim termenul
            de livrare.
          </p>
        </div>
      </div>
    </div>
  );
}
