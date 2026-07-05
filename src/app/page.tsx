import type { Metadata } from "next";

import { ShutdownLanding } from "@/components/ShutdownLanding";

export const metadata: Metadata = {
  title: "LyraBaits a devenit 24Baits",
  description:
    "LyraBaits a devenit 24Baits. Găsește produsele noastre pe 24baits.ro — nada, monturi și accesorii pentru pescuit la crap.",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "LyraBaits a devenit 24Baits",
    description: "Produsele LyraBaits sunt acum disponibile pe 24baits.ro.",
    type: "website",
    url: "/",
  },
};

export default function Home() {
  return <ShutdownLanding />;
}
