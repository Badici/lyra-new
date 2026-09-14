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
    default: "LyraBaits se va întoarce în curând",
    template: "%s | LyraBaits",
  },
  description:
    "LyraBaits se va întoarce în curând. Ne vedem la târgul de pescuit de la Bacău, 23–25 octombrie.",
  applicationName: "LyraBaits",
  keywords: [
    "pelete crap",
    "pungi PVA",
    "monturi crap",
    "forface crap",
    "accesorii pescuit",
    "Lyra Baits",
    "pescuit la crap România",
    "Hunting Moldavia",
    "târg pescuit Bacău",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "ro_RO",
    url: "/",
    siteName: "LyraBaits",
    title: "LyraBaits se va întoarce în curând",
    description:
      "Ne vedem la târgul de pescuit de la Bacău, 23–25 octombrie. Contact: 0728 241 412.",
  },
  twitter: {
    card: "summary_large_image",
    title: "LyraBaits se va întoarce în curând",
    description:
      "Ne vedem la târgul de pescuit de la Bacău, 23–25 octombrie. Contact: 0728 241 412.",
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
