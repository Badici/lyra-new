import type { Metadata } from "next";

const DESCRIPTION = "Cookie-urile folosite pe lyrabaits.ro.";

export const metadata: Metadata = {
  title: "Politica cookie",
  description: DESCRIPTION,
  openGraph: {
    title: "Politica cookie",
    description: DESCRIPTION,
    url: "/politica-cookie",
  },
};

export default function PoliticaCookiePage() {
  return (
    <div className="section-lyra">
      <div className="container-lyra max-w-3xl">
        <h1 className="mb-6 font-display text-5xl tracking-wide">Politica cookie</h1>
        <div className="space-y-4 text-muted">
          <p>
            Folosim cookie-uri esențiale ca să rămâi autentificat și ca site-ul să funcționeze,
            inclusiv pentru coș. Nu folosim cookie-uri de publicitate.
          </p>
        </div>
      </div>
    </div>
  );
}
