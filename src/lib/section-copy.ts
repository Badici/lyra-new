export const SECTION_COPY = {
  produse: {
    title: "Produse de la pescari, pentru pescari",
    subtitle:
      "Monturi, nade și accesorii legate manual, testate intensiv atât în concursuri, cât și în partide de plăcere.",
    cta: "Descoperă produsele",
    href: "/produse",
  },
  articole: {
    title: "Citește articole",
    subtitle: "Ghiduri, recenzii de produse și lacuri, discuții despre pescuit.",
    cta: "Citește articole",
    href: "/articole",
  },
  emisiuni: {
    title: "Emisiuni LyraBaits",
    subtitle:
      "Emisiuni video disponibile pe canalul LyraBaits de YouTube. Ateliere de monturi, rezumate de partidă, recenzii de produse.",
    cta: "Vezi emisiunile",
    href: "/emisiuni",
  },
  poveste: {
    title: "Povestea din spatele brandului",
    subtitle:
      "Un brand creat din pasiunea reală pentru pescuit și petrecutul timpului pe malul lacului.",
    cta: "Povestea noastră",
    href: "/povestea-noastra",
  },
} as const;

/** A doua fotografie din povestea brandului. */
export const ABOUT_IMAGE = {
  src: "/despre_noi_2.jpeg",
  alt: "Pescar LyraBaits ținând un crap, la apus, pe malul apei",
} as const;

/** Câte o poză de produs, folosită când o secțiune nu are încă imagine proprie. */
export const EXAMPLE_PRODUCT_IMAGES = [
  {
    src: "/exemple/montura-inline.png",
    alt: "Montură inline LyraBaits",
  },
  {
    src: "/exemple/nada-natur.png",
    alt: "Nadă naturală LyraBaits",
  },
  {
    src: "/exemple/momitor-longcast.png",
    alt: "Momitor longcast legat LyraBaits",
  },
] as const;
