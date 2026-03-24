export type NadaVariant = {
  id: string;
  name: string;
  description: string;
  promoPrice: string;
  regularPrice: string;
  image?: string;
};

export const nadaVariants: NadaVariant[] = [
  {
    id: "n-1",
    name: "Natur",
    description:
      "Nadă cerealieră cu aromă naturală, echilibrată pentru partide constante și răspuns rapid pe vadurile clasice.",
    promoPrice: "15 lei / 1 kg",
    regularPrice: "15 lei / 800 g",
    image: "/Nada natur.png",
  },
  {
    id: "n-2",
    name: "Căpșuni",
    description:
      "Bază natur cu arome de căpșuni și particule scufundătoare colorate, intens aromate, pentru nor activ și atracție vizuală.",
    promoPrice: "20 lei / 1 kg",
    regularPrice: "20 lei / 800 g",
    image: "/Nada capsuni.png",
  },
  {
    id: "n-3",
    name: "Usturoi",
    description:
      "Nadă natur îmbogățită cu aromă de usturoi, ideală când peștii răspund mai bine la profiluri puternice și persistente.",
    promoPrice: "20 lei / 1 kg",
    regularPrice: "20 lei / 800 g",
    image: "/nada usturoi.png",
  },
  {
    id: "n-4",
    name: "Fishmeal",
    description:
      "Rețetă cu conținut ridicat de fishmeal, gândită pentru selecție și menținerea peștilor mari în zona de hrănire.",
    promoPrice: "25 lei / 1 kg",
    regularPrice: "25 lei / 800 g",
    image: "/Nada fishmeal.png",
  },
  {
    id: "n-5",
    name: "Exotic",
    description:
      "Nadă premium, cu 3 tipuri de fishmeal și un plus discret de fluo, formulată pentru atracție maximă și partide exigente.",
    promoPrice: "30 lei / 1 kg",
    regularPrice: "30 lei / 800 g",
    image: "/Nada exotic.png",
  },
];
