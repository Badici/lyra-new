import type { Metadata } from "next";

import { ShutdownLanding } from "@/components/ShutdownLanding";

export const metadata: Metadata = {
  title: "LyraBaits se va întoarce în curând",
  description:
    "LyraBaits se va întoarce în curând. Ne vedem la târgul de pescuit de la Bacău, 23–25 octombrie, Sala de Atletism Doina Melinte.",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "LyraBaits se va întoarce în curând",
    description:
      "Ne vedem la târgul de pescuit de la Bacău, 23–25 octombrie. Contact: 0728 241 412.",
    type: "website",
    url: "/",
  },
};

export default function Home() {
  return <ShutdownLanding />;
}
