import type { Metadata } from "next";

const DESCRIPTION =
  "Ce date păstrează LyraBaits când îți faci cont, plasezi o comandă sau ne scrii.";

export const metadata: Metadata = {
  title: "Politica de confidențialitate",
  description: DESCRIPTION,
  openGraph: {
    title: "Politica de confidențialitate",
    description: DESCRIPTION,
    url: "/politica-de-confidentialitate",
  },
};

export default function ConfidentialitatePage() {
  return (
    <div className="section-lyra">
      <div className="container-lyra max-w-3xl">
        <h1 className="mb-6 font-display text-5xl tracking-wide">
          Politica de confidențialitate
        </h1>
        <div className="space-y-4 text-muted">
          <p>
            Când îți faci cont, plasezi o comandă sau ne scrii, păstrăm datele necesare ca să îți
            răspundem și să livrăm: nume, email, telefon și adresă.
          </p>
          <p>Le folosim doar pentru cont, comenzi și mesaje.</p>
          <p>
            Dacă vrei să le corectăm sau să le ștergem, scrie-ne la{" "}
            <a href="mailto:contact@lyrabaits.ro" className="text-accent underline-offset-4 hover:underline">
              contact@lyrabaits.ro
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
