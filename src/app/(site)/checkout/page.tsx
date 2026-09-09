import type { Metadata } from "next";
import { CheckoutForm } from "@/features/orders/checkout-form";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Finalizează comanda LyraBaits — plată ramburs la livrare.",
  robots: { index: false, follow: false },
};

export default function CheckoutPage() {
  return (
    <div className="section-lyra">
      <div className="container-lyra">
        <p className="font-hand mb-2 text-2xl text-accent">Comandă</p>
        <h1 className="mb-8 font-display text-5xl tracking-wide">Checkout ramburs</h1>
        <CheckoutForm />
      </div>
    </div>
  );
}
