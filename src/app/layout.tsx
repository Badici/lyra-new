import type { Metadata } from "next";
import { DM_Sans, Instrument_Serif } from "next/font/google";
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
    default: "Lyra Baits - Momeala si monturi pentru pescuit la crap",
    template: "%s | Lyra Baits",
  },
  description:
    "Momeala pentru pescuit la crap, pungi PVA, monturi, forface si amestec de nadire. Comanda rapid prin WhatsApp de la Lyra Baits.",
  applicationName: "Lyra Baits",
  keywords: [
    "momeala crap",
    "nada crap",
    "pungi PVA",
    "monturi crap",
    "forface crap",
    "amestec nadire",
    "boillies",
    "accesorii pescuit",
    "Lyra Baits",
    "pescuit la crap Romania",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "ro_RO",
    url: "/",
    siteName: "Lyra Baits",
    title: "Lyra Baits - Momeala si monturi pentru pescuit la crap",
    description:
      "Produse pentru pescuit la crap: nada, pungi PVA, monturi, forface si amestec de nadire. Comenzi prin WhatsApp.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Lyra Baits - Momeala si monturi pentru pescuit la crap",
    description:
      "Nada, monturi, forface, pungi PVA si amestec de nadire pentru pescuit la crap.",
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
        {children}
      </body>
    </html>
  );
}
