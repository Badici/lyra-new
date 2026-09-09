import type { Metadata } from "next";
import { LegalNotice } from "@/components/public/legal-notice";

export const metadata: Metadata = {
  title: "Politica cookie",
  description: "Politica cookie LyraBaits — șablon pentru consimțământ și categorii.",
};

export default function PoliticaCookiePage() {
  return (
    <div className="section-lyra">
      <div className="container-lyra max-w-3xl">
        <h1 className="mb-6 font-display text-5xl tracking-wide">Politica cookie</h1>
        <LegalNotice />
        <div className="space-y-4 text-muted">
          <p>
            Enumeră cookie-urile esențiale (sesiune, coș), analitice și de marketing — dacă vor fi
            folosite — plus modalitatea de gestionare a preferințelor.
          </p>
        </div>
      </div>
    </div>
  );
}
