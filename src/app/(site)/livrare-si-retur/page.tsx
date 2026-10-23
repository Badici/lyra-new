import type { Metadata } from "next";
import Link from "next/link";

const DESCRIPTION = "Cum se livrează comenzile LyraBaits și cum poți cere un retur.";

export const metadata: Metadata = {
  title: "Livrare și retur",
  description: DESCRIPTION,
  openGraph: {
    title: "Livrare și retur",
    description: DESCRIPTION,
    url: "/livrare-si-retur",
  },
};

export default function LivrareReturPage() {
  return (
    <div className="section-lyra">
      <div className="container-lyra max-w-3xl">
        <h1 className="mb-6 font-display text-5xl tracking-wide">Livrare și retur</h1>
        <div className="space-y-4 text-muted">
          <p>
            Plata se face ramburs, la livrare. După comandă te contactăm dacă trebuie confirmat
            termenul, mai ales pentru produsele făcute la comandă.
          </p>
          <p>
            Pentru un retur, scrie-ne pe{" "}
            <Link href="/contact" className="text-accent underline-offset-4 hover:underline">
              pagina de contact
            </Link>{" "}
            și îți spunem pașii.
          </p>
        </div>
      </div>
    </div>
  );
}
