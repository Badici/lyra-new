import type { Metadata } from "next";
import { LegalNotice } from "@/components/public/legal-notice";

export const metadata: Metadata = {
  title: "Politica de confidențialitate",
  description: "Politica de confidențialitate LyraBaits — șablon GDPR.",
};

export default function ConfidentialitatePage() {
  return (
    <div className="section-lyra">
      <div className="container-lyra max-w-3xl">
        <h1 className="mb-6 font-display text-5xl tracking-wide">
          Politica de confidențialitate
        </h1>
        <LegalNotice />
        <div className="space-y-4 text-muted">
          <p>
            Descrie ce date personale sunt colectate (cont, comenzi, mesaje contact), temeiul legal,
            durata stocării și drepturile persoanei vizate. Versiunea finală trebuie aliniată la
            GDPR și la procesatorii folosiți (hosting, email).
          </p>
        </div>
      </div>
    </div>
  );
}
