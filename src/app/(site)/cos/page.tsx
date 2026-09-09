import type { Metadata } from "next";
import { CartPageClient } from "@/features/cart/cart-page-client";

export const metadata: Metadata = {
  title: "Coș",
  description: "Coșul tău LyraBaits — revizuiește produsele înainte de checkout.",
  robots: { index: false, follow: false },
};

export default function CosPage() {
  return <CartPageClient />;
}
