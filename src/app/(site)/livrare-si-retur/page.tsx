import type { Metadata } from "next";
import { LegalNotice } from "@/components/public/legal-notice";

export const metadata: Metadata = {
  title: "Livrare și retur",
  description: "Informații livrare și retur LyraBaits — șablon comercial.",
};

export default function LivrareReturPage() {
  return (
    <div className="section-lyra">
      <div className="container-lyra max-w-3xl">
        <h1 className="mb-6 font-display text-5xl tracking-wide">Livrare și retur</h1>
        <LegalNotice />
        <div className="space-y-4 text-muted">
          <p>
            Include termene orientative de livrare, costuri, curieri, procedura de retur conform
            legislației consumatorului și excepțiile pentru produse personalizate, dacă e cazul.
          </p>
        </div>
      </div>
    </div>
  );
}
