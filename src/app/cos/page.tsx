import type { Metadata } from "next";
import { CartPageClient } from "@/components/cart/CartPageClient";

export const metadata: Metadata = {
  title: "Coș de cumpărături",
  description:
    "Completează datele de contact și trimite comanda pe WhatsApp pentru confirmare și detalii de livrare.",
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
            După ce completezi datele de contact, apasă butonul „Trimite comandă pe
            WhatsApp”, iar noi îți vom răspunde în cel mai scurt timp pentru
            confirmare și termenii de livrare.
          </p>
        </header>

        <CartPageClient />
      </div>
    </main>
  );
}
