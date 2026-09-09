import type { Metadata } from "next";
import { Bebas_Neue, Caveat, Inter } from "next/font/google";
import { Toaster } from "sonner";
import { CartProvider } from "@/features/cart/cart-context";
import { PRODUCTION_SITE_URL, SITE_NAME, SITE_TAGLINE } from "@/lib/constants";
import "./globals.css";

const bebasNeue = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bebas",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const caveat = Caveat({
  subsets: ["latin"],
  variable: "--font-caveat",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(PRODUCTION_SITE_URL),
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_TAGLINE,
  openGraph: {
    type: "website",
    locale: "ro_RO",
    siteName: SITE_NAME,
    title: SITE_NAME,
    description: SITE_TAGLINE,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="ro"
      className={`${bebasNeue.variable} ${inter.variable} ${caveat.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col font-sans">
        <CartProvider>
          {children}
          <Toaster position="top-center" richColors closeButton />
        </CartProvider>
      </body>
    </html>
  );
}
