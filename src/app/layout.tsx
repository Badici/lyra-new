import type { Metadata } from "next";
import { DM_Sans, Instrument_Serif } from "next/font/google";
import { CartProvider } from "@/components/cart/CartProvider";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
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
    default: "Lyra Baits - Monturi și accesorii pentru pescuit la crap",
    template: "%s | Lyra Baits",
  },
  description:
    "Monturi, forface, cârlige, accesorii și pelete pentru pescuit la crap. Comandă rapid prin WhatsApp de la Lyra Baits.",
  applicationName: "Lyra Baits",
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
    siteName: "Lyra Baits",
    title: "Lyra Baits - Monturi și accesorii pentru pescuit la crap",
    description:
      "Produse pentru pescuit la crap: monturi, forface, cârlige, accesorii și pelete. Comenzi prin WhatsApp.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Lyra Baits - Monturi și accesorii pentru pescuit la crap",
    description:
      "Monturi, forface, cârlige, accesorii și pelete pentru pescuit la crap.",
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
        <CartProvider>
          <SiteHeader />
          {children}
          <SiteFooter />
        </CartProvider>
      </body>
    </html>
  );
}
