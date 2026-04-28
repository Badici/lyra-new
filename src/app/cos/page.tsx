import type { Metadata } from "next";
import { CartPageClient } from "@/components/cart/CartPageClient";

export const metadata: Metadata = {
  title: "Coș de cumpărături",
  description:
    "Coș mock Lyra Baits: adaugă produse, selectează livrarea și trimite mesajul precompletat pe WhatsApp.",
  alternates: {
    canonical: "/cos",
  },
};

export default function CartPage() {
  return (
    <main className="px-4 py-10 md:py-12">
      <div className="mx-auto w-full max-w-7xl">
        <header className="mb-8">
          <h1 className="text-3xl font-semibold text-[var(--cream)] md:text-4xl">
            Coșul tău
          </h1>
          <p className="mt-3 max-w-3xl text-[var(--muted)]">
            Acesta este un checkout mock. Completezi datele și trimiți direct pe
            WhatsApp lista de produse, împreună cu datele tale (adresă, telefon,
            email) și tipul
            de livrare.
          </p>
        </header>

        <CartPageClient />
      </div>
    </main>
  );
}
