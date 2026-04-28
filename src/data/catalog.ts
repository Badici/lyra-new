export type ProductCategory = {
  slug: string;
  name: string;
  description: string;
  heroImage: string;
};

export type CatalogProduct = {
  slug: string;
  categorySlug: ProductCategory["slug"];
  name: string;
  shortDescription: string;
  description: string;
  priceLabel: string;
  priceValueRon: number;
  images: string[];
  specs: string[];
  variantSelector?: {
    label: string;
    values: string[];
    placeholder?: string;
  };
  customOrderNote?: string;
};

export const WHATSAPP_NUMBER = "40728241412";
export const DELIVERY_FEE_RON = 30;

export const categories: ProductCategory[] = [
  {
    slug: "carlige-accesorii",
    name: "Cârlige și accesorii",
    description:
      "Cârlige wide gape, fir pentru forfac și vârtejuri pentru monturi curate și eficiente.",
    heroImage: "/produse-noi/carlige-accesorii/carlige1.png",
  },
  {
    slug: "monturi-forface",
    name: "Monturi și forface",
    description:
      "Monturi pregătite pe leadcore și seturi de rig-uri pentru partide la crap.",
    heroImage: "/produse-noi/monturi-forface/montura-inline.png",
  },
  {
    slug: "nade-aditivi",
    name: "Nade și aditivi",
    description:
      "Nade, pelete și aditivi pentru atracție rapidă pe vad și constanță pe toată partida.",
    heroImage: "/produse-noi/nade-aditivi/mix-pelete.png",
  },
];

export const products: CatalogProduct[] = [
  {
    slug: "carlige-wide-gape",
    categorySlug: "carlige-accesorii",
    name: "Cârlige wide gape",
    shortDescription: "Mărimi 4, 6, 8, 10 - plic de 10 bucăți.",
    description:
      "Cârlige wide gape pentru pescuit la crap, disponibile în mărimile 4, 6, 8 și 10. Potrivite pentru prezentări echilibrate cu waftere sau pop-up și pentru monturi cu boillies. Este gama noastră proprie de cârlige, cu un raport calitate-preț extraordinar.",
    priceLabel: "7 RON / plic (10 buc)",
    priceValueRon: 7,
    images: [
      "/produse-noi/carlige-accesorii/carlige1.png",
      "/produse-noi/carlige-accesorii/carlige2.png",
    ],
    specs: [
      "Mărimi disponibile: 4, 6, 8, 10",
      "Forma: wide gape",
      "Ambalare: 10 bucăți / plic",
    ],
    variantSelector: {
      label: "Mărime",
      values: ["4", "6", "8", "10"],
      placeholder: "Alege mărimea",
    },
  },
  {
    slug: "fir-forfac-textil-014",
    categorySlug: "carlige-accesorii",
    name: "Fir forfac textil 0.14",
    shortDescription: "Rolă 100m, verde, mătăsos, ideal pentru forface.",
    description:
      "Fir pentru forface pe textil, grosime 0.14 mm, culoare verde. Material mătăsos, împletit în 8 pentru extra rezistență, ușor de lucrat și potrivit pentru orice rig care se leagă cu fir textil.",
    priceLabel: "20 RON / rola (100m)",
    priceValueRon: 20,
    images: ["/produse-noi/carlige-accesorii/fir-forfac.png"],
    specs: [
      "Lungime: 100 metri",
      "Grosime: 0.14 mm",
      "Culoare: verde",
    ],
  },
  {
    slug: "vartejuri-marimea-4",
    categorySlug: "carlige-accesorii",
    name: "Vârtejuri mărimea 4",
    shortDescription: "Plic cu 10 bucăți pentru monturi pe crap.",
    description:
      "Vârtejuri mărimea 4, rezistente, pentru monturi sigure, în care te poți baza în cele mai complicate drilluri.",
    priceLabel: "7 RON / plic (10 buc)",
    priceValueRon: 7,
    images: ["/produse-noi/carlige-accesorii/vartejuri.png"],
    specs: ["Mărime: 4", "Ambalare: 10 bucăți / plic"],
  },
  {
    slug: "montura-inline-leadcore",
    categorySlug: "monturi-forface",
    name: "Montură inline",
    shortDescription: "Leadcore, plumb 100g, agrafă rapidă.",
    description:
      "Montură inline lucrată pe leadcore, cu plumb de 100g și agrafă rapidă. Soluție simplă și eficientă pentru partide de staționar la crap.",
    priceLabel: "13.5 RON / bucata",
    priceValueRon: 13.5,
    images: ["/produse-noi/monturi-forface/montura-inline.png"],
    specs: ["Leadcore", "Plumb: 100g", "Agrafă rapidă inclusă"],
  },
  {
    slug: "montura-plumb-pierdut",
    categorySlug: "monturi-forface",
    name: "Montură plumb pierdut",
    shortDescription: "Leadcore, plumb 100g, agrafă rapidă, sistem plumb pierdut.",
    description:
      "Montură pe leadcore cu sistem plumb pierdut, plumb de 100g și agrafă rapidă. Concepută pentru prezentări stabile în zone cu agățături.",
    priceLabel: "14.5 RON / bucata",
    priceValueRon: 14.5,
    images: ["/produse-noi/monturi-forface/montura-plumb-pierdut.png"],
    specs: [
      "Leadcore",
      "Plumb: 100g",
      "Agrafă rapidă",
      "Sistem plumb pierdut",
    ],
  },
  {
    slug: "montura-punga-pva",
    categorySlug: "monturi-forface",
    name: "Montură pungă PVA",
    shortDescription:
      "Leadcore, cârlig nr. 8, plumb 60g, mix pelete fishmeal + cerealier colorat.",
    description:
      "Montură cu pungă PVA lucrată pe leadcore, cu cârlig mărimea 8 și plumb de 60g. Greutate totală 90-100g, umplută cu mix de pelete fishmeal și cerealier colorat pentru atracție maximă.",
    priceLabel: "14 RON / bucata",
    priceValueRon: 14,
    images: ["/produse-noi/monturi-forface/montura-punga-pva.png"],
    specs: [
      "Leadcore",
      "Cârlig: mărimea 8",
      "Plumb: 60g",
      "Greutate totală: 90-100g",
      "Momeală la cârlig: wafter sau boillies (la alegere)",
    ],
    variantSelector: {
      label: "Momeală la cârlig",
      values: ["Boillies", "Wafter"],
      placeholder: "Alege momeala de cârlig",
    },
    customOrderNote:
      "Pentru comenzi custom de minimum 20 de bucăți, realizăm orice tip de bag dorește clientul.",
  },
  {
    slug: "monturi-cu-spin-set",
    categorySlug: "monturi-forface",
    name: "Monturi cu spin - set 10 buc",
    shortDescription:
      "Cârlige 8 sau 10, fir textil 0.14, lungime rig 7cm, cu penar cadou.",
    description:
      "Set de 10 monturi cu spin, realizate cu cârlige wide gape mărimea 8 sau 10 și fir textil 0.14. Lungime rig 7 cm, livrate cu penar cadou.",
    priceLabel: "45 RON / set",
    priceValueRon: 45,
    images: ["/produse-noi/monturi-forface/monturi-cu-spin.png"],
    specs: [
      "Set: 10 monturi",
      "Cârlige: mărimea 8 sau 10",
      "Fir textil: 0.14",
      "Lungime rig: 7 cm",
      "Bonus: penar cadou",
    ],
  },
  {
    slug: "mix-pelete-500g",
    categorySlug: "nade-aditivi",
    name: "Mix pelete 500g",
    shortDescription:
      "Mixul din bagurile noastre, în cutie rezistentă la apă, ideal pentru feeder, PVA sau momitor.",
    description:
      "Mix de pelete folosit în bagurile Lyra, ambalat în cutii de 500g rezistente la apă. Datorită ambalajului, doar umezești, folosești și arunci la gunoi: nu mai stai cu găleți după tine. Potrivit pentru feeder, PVA sau momitor.",
    priceLabel: "15 RON / 500g",
    priceValueRon: 15,
    images: ["/produse-noi/nade-aditivi/mix-pelete.png"],
    specs: [
      "Cantitate: 500g",
      "Ambalaj: cutie rezistentă la apă",
      "Utilizare: feeder, PVA, momitor",
    ],
  },
  {
    slug: "nada-exotic-800g",
    categorySlug: "nade-aditivi",
    name: "Nadă Exotic",
    shortDescription:
      "Mix premium cu aditivi, cereale și fishmeal, aromă ușoară de usturoi.",
    description:
      "Nadă premium cu mix de aditivi, cereale și fishmeal, îmbogățită cu aromă fină de usturoi și făină de pește pentru atracție ridicată.",
    priceLabel: "30 RON / 800g",
    priceValueRon: 30,
    images: ["/produse-noi/nade-aditivi/nada-exotic.png"],
    specs: ["Cantitate: 800g", "Profil: cerealier + fishmeal + aditivi"],
  },
  {
    slug: "nada-fishmeal-800g",
    categorySlug: "nade-aditivi",
    name: "Nadă Fishmeal",
    shortDescription: "Nadă natur cu 30% făină de pește.",
    description:
      "Nadă pe bază cerealieră, cu adaos de 30% făină de pește. Formulă echilibrată pentru partide la crap pe vaduri solicitate.",
    priceLabel: "25 RON / 800g",
    priceValueRon: 25,
    images: ["/produse-noi/nade-aditivi/nada-fishmeal.png"],
    specs: ["Cantitate: 800g", "Raport fishmeal: 30%"],
  },
  {
    slug: "nada-natur-800g",
    categorySlug: "nade-aditivi",
    name: "Nadă Natur",
    shortDescription: "Nadă cerealieră simplă, fără aditivi.",
    description:
      "Nadă simplă, cerealieră, fără aditivi. Soluție bună pentru partide clasice sau pentru a fi combinată cu aditivi lichizi.",
    priceLabel: "15 RON / 800g",
    priceValueRon: 15,
    images: ["/produse-noi/nade-aditivi/nada-natur.png"],
    specs: ["Cantitate: 800g", "Compoziție: făină cerealieră pură"],
  },
  {
    slug: "nada-usturoi-1-5kg",
    categorySlug: "nade-aditivi",
    name: "Nadă Usturoi",
    shortDescription: "Nadă cerealieră cu aromă intensă de usturoi.",
    description:
      "Nadă cerealieră cu aromă intensă de usturoi, recomandată când peștii răspund la profiluri puternice de atracție.",
    priceLabel: "40 RON / 1.5kg",
    priceValueRon: 40,
    images: ["/produse-noi/nade-aditivi/nada-usturoi.png"],
    specs: ["Cantitate: 1.5kg", "Profil: cerealier, aromă intensă de usturoi"],
  },
  {
    slug: "seringa-aditivi-10ml",
    categorySlug: "nade-aditivi",
    name: "Seringă aditivi 10ml",
    shortDescription:
      "Pentru aditivarea nadei, peletelor sau injectare în pungi PVA.",
    description:
      "Seringă de aditiv 10ml, suficientă pentru aproximativ 10 baguri sau 1kg de pelete când este diluată în apă. Utilă pentru aditivare rapidă direct pe vad.",
    priceLabel: "5 RON / bucata",
    priceValueRon: 5,
    images: ["/produse-noi/nade-aditivi/seringa-aditivi.png"],
    specs: [
      "Cantitate: 10ml",
      "Utilizare: aditivare nade, pelete, injectare PVA",
      "Conține: alcool, făină de pește, arome, puțin fluo, aminoacizi",
    ],
  },
];

export function getCategoryBySlug(slug: string) {
  return categories.find((category) => category.slug === slug);
}

export function getProductsByCategory(categorySlug: string) {
  return products.filter((product) => product.categorySlug === categorySlug);
}

export function getProductBySlug(slug: string) {
  return products.find((product) => product.slug === slug);
}
