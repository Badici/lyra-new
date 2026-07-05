import type { Metadata } from "next";
import { DM_Sans, Instrument_Serif } from "next/font/google";
import { CartProvider } from "@/components/cart/CartProvider";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin", "latin-ext"],
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://lyrabaits.ro";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "LyraBaits a devenit 24Baits",
    template: "%s | 24Baits",
  },
  description:
    "LyraBaits a devenit 24Baits. Găsește produsele noastre pe 24baits.ro.",
  applicationName: "LyraBaits → 24Baits",
  keywords: [
    "pelete crap",
    "pungi PVA",
    "monturi crap",
    "forface crap",
    "accesorii pescuit",
    "Lyra Baits",
    "pescuit la crap România",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "ro_RO",
    url: "/",
    siteName: "LyraBaits → 24Baits",
    title: "LyraBaits a devenit 24Baits",
    description: "Produsele LyraBaits sunt acum disponibile pe 24baits.ro.",
  },
  twitter: {
    card: "summary_large_image",
    title: "LyraBaits a devenit 24Baits",
    description: "Găsește produsele noastre pe 24baits.ro.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ro">
      <body
        className={`${dmSans.variable} ${instrumentSerif.variable} font-sans antialiased`}
      >
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
