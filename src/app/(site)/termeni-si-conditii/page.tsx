import type { Metadata } from "next";
import { LegalNotice } from "@/components/public/legal-notice";

export const metadata: Metadata = {
  title: "Termeni și condiții",
  description: "Termeni și condiții LyraBaits — șablon pentru revizuire juridică.",
};

export default function TermeniPage() {
  return (
    <div className="section-lyra">
      <div className="container-lyra max-w-3xl">
        <h1 className="mb-6 font-display text-5xl tracking-wide">Termeni și condiții</h1>
        <LegalNotice />
        <div className="prose-sm space-y-4 text-muted">
          <p>
            Acest document descrie condițiile generale de utilizare a site-ului lyrabaits.ro și de
            plasare a comenzilor. Textul final trebuie validat de consilier juridic și completat
            cu datele firmei (denumire, CUI, sediu, contact).
          </p>
          <h2 className="font-display text-2xl text-foreground">Comenzi și plăți</h2>
          <p>
            Comenzile se plasează online; plata standard V1 este ramburs la livrare. Prețurile sunt
            confirmate server-side la finalizare.
          </p>
          <h2 className="font-display text-2xl text-foreground">Produse la comandă</h2>
          <p>
            Produsele fără stoc disponibil pot fi comandate; echipa LyraBaits contactează clientul
            pentru confirmarea termenului de livrare.
          </p>
        </div>
      </div>
    </div>
  );
}
