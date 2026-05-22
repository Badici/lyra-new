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
  pricingConfig?: ProductPricingConfig;
};

export type PricingChoice = {
  value: string;
  label: string;
  costRon: number;
  requires?: {
    optionId: string;
    values: string[];
  };
};

export type PricingOption = {
  id: string;
  label: string;
  placeholder: string;
  choices: PricingChoice[];
};

export type ProductPricingConfig = {
  options: PricingOption[];
  setSize?: number;
  markupPercent: number;
  fixedCosts?: {
    label: string;
    costRon: number;
  }[];
};

export const WHATSAPP_NUMBER = "40728241412";
export const DELIVERY_FEE_RON = 30;
export const DEFAULT_MARKUP_PERCENT = 100;
export const DEFAULT_PRODUCT_IMAGE = "/placeholder-product.svg";

const INLINE_LEADS: PricingChoice[] = [
  { value: "inline-tija-76", label: "Plumb in-line cu tijă - 76g", costRon: 3.4 },
  { value: "inline-tija-82", label: "Plumb in-line cu tijă - 82g", costRon: 3.6 },
  { value: "inline-tija-92", label: "Plumb in-line cu tijă - 92g", costRon: 3.8 },
  { value: "inline-tija-102", label: "Plumb in-line cu tijă - 102g", costRon: 4 },
  { value: "inline-tija-112", label: "Plumb in-line cu tijă - 112g", costRon: 4.2 },
  { value: "inline-tija-118", label: "Plumb in-line cu tijă - 118g", costRon: 4.4 },
  { value: "inline-tija-138", label: "Plumb in-line cu tijă - 138g", costRon: 4.6 },
  { value: "inline-insert-62", label: "Plumb in-line cu insert de cauciuc - 62g", costRon: 4.3 },
  { value: "inline-insert-74", label: "Plumb in-line cu insert de cauciuc - 74g", costRon: 4.5 },
  { value: "inline-insert-82", label: "Plumb in-line cu insert de cauciuc - 82g", costRon: 4.7 },
  { value: "inline-insert-95", label: "Plumb in-line cu insert de cauciuc - 95g", costRon: 4.9 },
  { value: "inline-insert-102", label: "Plumb in-line cu insert de cauciuc - 102g", costRon: 5.5 },
  { value: "inline-insert-112", label: "Plumb in-line cu insert de cauciuc - 112g", costRon: 5.7 },
  { value: "inline-insert-116", label: "Plumb in-line cu insert de cauciuc - 116g", costRon: 5.9 },
  { value: "inline-insert-128", label: "Plumb in-line cu insert de cauciuc - 128g", costRon: 6 },
];

const FIXED_LEADS: PricingChoice[] = [
  { value: "hex-70", label: "Plumb fix cu vârtej hexagonal - 70g", costRon: 3.7 },
  { value: "hex-80", label: "Plumb fix cu vârtej hexagonal - 80g", costRon: 3.8 },
  { value: "hex-90", label: "Plumb fix cu vârtej hexagonal - 90g", costRon: 3.9 },
  { value: "hex-100", label: "Plumb fix cu vârtej hexagonal - 100g", costRon: 4 },
  { value: "hex-110", label: "Plumb fix cu vârtej hexagonal - 110g", costRon: 4.1 },
  { value: "hex-120", label: "Plumb fix cu vârtej hexagonal - 120g", costRon: 4.2 },
  { value: "hex-130", label: "Plumb fix cu vârtej hexagonal - 130g", costRon: 4.3 },
  { value: "hex-140", label: "Plumb fix cu vârtej hexagonal - 140g", costRon: 4.4 },
  { value: "rotund-80", label: "Plumb fix cu vârtej rotund - 80g", costRon: 3.8 },
  { value: "rotund-90", label: "Plumb fix cu vârtej rotund - 90g", costRon: 3.9 },
  { value: "rotund-100", label: "Plumb fix cu vârtej rotund - 100g", costRon: 4 },
  { value: "rotund-110", label: "Plumb fix cu vârtej rotund - 110g", costRon: 4.1 },
  { value: "rotund-115", label: "Plumb fix cu vârtej rotund - 115g", costRon: 4.2 },
  { value: "rotund-120", label: "Plumb fix cu vârtej rotund - 120g", costRon: 4.3 },
  { value: "rotund-125", label: "Plumb fix cu vârtej rotund - 125g", costRon: 4.4 },
  { value: "rotund-130", label: "Plumb fix cu vârtej rotund - 130g", costRon: 4.5 },
  { value: "gripa-90", label: "Plumb grippa fix cu vârtej - 90g", costRon: 4.8 },
  { value: "gripa-100", label: "Plumb grippa fix cu vârtej - 100g", costRon: 5 },
  { value: "gripa-110", label: "Plumb grippa fix cu vârtej - 110g", costRon: 5.2 },
  { value: "gripa-120", label: "Plumb grippa fix cu vârtej - 120g", costRon: 5.4 },
  { value: "gripa-130", label: "Plumb grippa fix cu vârtej - 130g", costRon: 5.6 },
  { value: "gripa-150", label: "Plumb grippa fix cu vârtej - 150g", costRon: 5.8 },
  { value: "gripa-160", label: "Plumb grippa fix cu vârtej - 160g", costRon: 6 },
  { value: "gripa-180", label: "Plumb grippa fix cu vârtej - 180g", costRon: 7 },
  { value: "gripa-200", label: "Plumb grippa fix cu vârtej - 200g", costRon: 7.5 },
];

const BAG_LEADS: PricingChoice[] = [
  { value: "bag-50", label: "Plumb bag - 50g", costRon: 3 },
  { value: "bag-60", label: "Plumb bag - 60g", costRon: 3.2 },
  { value: "bag-70", label: "Plumb bag - 70g", costRon: 3.4 },
  { value: "bag-75", label: "Plumb bag - 75g", costRon: 3.5 },
  { value: "bag-80", label: "Plumb bag - 80g", costRon: 3.6 },
  { value: "bag-85", label: "Plumb bag - 85g", costRon: 3.7 },
  { value: "bag-90", label: "Plumb bag - 90g", costRon: 3.8 },
  { value: "bag-95", label: "Plumb bag - 95g", costRon: 3.9 },
  { value: "bag-110", label: "Plumb bag - 110g", costRon: 4 },
];

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
    priceLabel: "5 RON / plic (10 buc)",
    priceValueRon: 5,
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
    priceLabel: "15 RON / rola (100m)",
    priceValueRon: 15,
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
    priceLabel: "5 RON / plic (10 buc)",
    priceValueRon: 5,
    images: ["/produse-noi/carlige-accesorii/vartejuri.png"],
    specs: ["Mărime: 4", "Ambalare: 10 bucăți / plic"],
  },
  {
    slug: "montura-inline-leadcore",
    categorySlug: "monturi-forface",
    name: "Montură inline",
    shortDescription: "Leadcore, plumb 100g.",
    description:
      "Montură inline lucrată pe leadcore, cu plumb de 100g. Soluție simplă și eficientă pentru partide de staționar la crap.",
    priceLabel: "Preț calculat automat",
    priceValueRon: 0,
    images: ["/produse-noi/monturi-forface/montura-inline.png"],
    specs: [
      "Fir montură: leadcore sau textil",
      "Conectică: vârtej normal sau agrafă rapidă",
      "Plumbi in-line cu tijă sau insert de cauciuc",
    ],
    pricingConfig: {
      markupPercent: DEFAULT_MARKUP_PERCENT,
      options: [
        {
          id: "fir-montura",
          label: "Fir montură",
          placeholder: "Alege firul monturii",
          choices: [
            { value: "leadcore", label: "Leadcore", costRon: 1 },
            { value: "textil", label: "Fir textil", costRon: 0.5 },
          ],
        },
        {
          id: "conectica",
          label: "Tip agrafă",
          placeholder: "Alege tipul agrafei",
          choices: [
            { value: "vartej", label: "Vârtej normal", costRon: 0.3 },
            { value: "agrafa", label: "Agrafă rapidă", costRon: 0.4 },
          ],
        },
        {
          id: "plumb",
          label: "Plumb",
          placeholder: "Alege tipul și gramajul plumbului",
          choices: INLINE_LEADS,
        },
      ],
    },
  },
  {
    slug: "montura-plumb-pierdut",
    categorySlug: "monturi-forface",
    name: "Montură plumb pierdut",
    shortDescription: "Leadcore, plumb 100g, sistem plumb pierdut.",
    description:
      "Montură pe leadcore cu sistem plumb pierdut, plumb de 100g. Concepută pentru prezentări stabile în zone cu agățături.",
    priceLabel: "Preț calculat automat",
    priceValueRon: 0,
    images: ["/produse-noi/monturi-forface/montura-plumb-pierdut.png"],
    specs: [
      "Fir montură: leadcore sau textil",
      "Conectică: vârtej normal sau agrafă rapidă",
      "Plumbi ficși cu vârtej (hexagonali, rotunzi, grippa)",
      "Sistem plumb pierdut",
    ],
    pricingConfig: {
      markupPercent: DEFAULT_MARKUP_PERCENT,
      options: [
        {
          id: "fir-montura",
          label: "Fir montură",
          placeholder: "Alege firul monturii",
          choices: [
            { value: "leadcore", label: "Leadcore", costRon: 1 },
            { value: "textil", label: "Fir textil", costRon: 0.5 },
          ],
        },
        {
          id: "conectica",
          label: "Tip agrafă",
          placeholder: "Alege tipul agrafei",
          choices: [
            { value: "vartej", label: "Vârtej normal", costRon: 0.3 },
            { value: "agrafa", label: "Agrafă rapidă", costRon: 0.4 },
          ],
        },
        {
          id: "plumb",
          label: "Plumb",
          placeholder: "Alege tipul și gramajul plumbului",
          choices: FIXED_LEADS,
        },
      ],
    },
  },
  {
    slug: "montura-punga-pva",
    categorySlug: "monturi-forface",
    name: "Montură pungă PVA",
    shortDescription:
      "Leadcore, cârlig nr. 8, plumb 60g, mix pelete fishmeal + cerealier colorat.",
    description:
      "Montură cu pungă PVA lucrată pe leadcore, cu cârlig mărimea 8 și plumb de 60g. Greutate totală 90-100g, umplută cu mix de pelete fishmeal și cerealier colorat pentru atracție maximă.",
    priceLabel: "Preț calculat automat",
    priceValueRon: 0,
    images: ["/produse-noi/monturi-forface/montura-punga-pva.png"],
    specs: [
      "Fir montură: leadcore, textil sau fluorcarbon",
      "Cârlig: mărimea 4/6/8/10/12",
      "Momeală la cârlig: wafter sau boillies",
      "Plumbi bag în gramaje diferite",
    ],
    pricingConfig: {
      markupPercent: 85,
      fixedCosts: [
        { label: "Mix de umplere", costRon: 0.5 },
        { label: "Pungă PVA", costRon: 0.5 },
        { label: "Stopper momeală", costRon: 0.1 },
      ],
      options: [
        {
          id: "fir-montura",
          label: "Fir montură",
          placeholder: "Alege firul monturii",
          choices: [
            { value: "leadcore", label: "Leadcore", costRon: 1 },
            { value: "textil", label: "Fir textil", costRon: 0.5 },
            { value: "fluorcarbon", label: "Fluorcarbon", costRon: 0.5 },
          ],
        },
        {
          id: "marime-carlig",
          label: "Mărime cârlig",
          placeholder: "Alege mărimea cârligului",
          choices: [
            { value: "4", label: "4", costRon: 0.5 },
            { value: "6", label: "6", costRon: 0.5 },
            { value: "8", label: "8", costRon: 0.5 },
            { value: "10", label: "10", costRon: 0.5 },
            { value: "12", label: "12", costRon: 0.5 },
          ],
        },
        {
          id: "momeala-carlig",
          label: "Momeală la cârlig",
          placeholder: "Alege momeala de cârlig",
          choices: [
            { value: "boillies", label: "Boillies", costRon: 0 },
            { value: "wafter", label: "Wafter", costRon: 0 },
          ],
        },
        {
          id: "plumb",
          label: "Plumb",
          placeholder: "Alege gramajul plumbului",
          choices: BAG_LEADS,
        },
      ],
    },
    customOrderNote:
      "Pentru comenzi custom de minimum 20 de bucăți, realizăm orice tip de bag dorește clientul.",
  },
  {
    slug: "carlige-legate-set-5",
    categorySlug: "monturi-forface",
    name: "Cârlige legate - set 5 buc",
    shortDescription:
      "Set de 5 cârlige legate, configurabile după mărime, fir, tip montură și lungime rig.",
    description:
      "Cârlige legate la set de 5 bucăți, configurabile pe mărime cârlig, tip de fir pentru forfac, tip de montură și lungime rig. Prețul este calculat automat pe materiale și include adaosul standard de 30%.",
    priceLabel: "Preț calculat automat",
    priceValueRon: 0,
    images: ["/produse-noi/monturi-forface/monturi-cu-spin.png"],
    specs: [
      "Set: 5 cârlige legate",
      "Mărime cârlig: 4/6/8/10/12",
      "Fir forfac: textil sau fluorcarbon",
      "Tip montură: fir de păr / blowback cu varnish / cu spin / cu bandă / drig",
      "Lungime rig: 7 / 10 / 15 cm",
    ],
    pricingConfig: {
      markupPercent: DEFAULT_MARKUP_PERCENT,
      setSize: 5,
      options: [
        {
          id: "marime-carlig",
          label: "Mărime cârlig",
          placeholder: "Alege mărimea cârligului",
          choices: [
            { value: "4", label: "4", costRon: 0.5 },
            { value: "6", label: "6", costRon: 0.5 },
            { value: "8", label: "8", costRon: 0.5 },
            { value: "10", label: "10", costRon: 0.5 },
            { value: "12", label: "12", costRon: 0.5 },
          ],
        },
        {
          id: "fir-forfac",
          label: "Fir forfac",
          placeholder: "Alege firul forfacului",
          choices: [
            { value: "textil", label: "Textil", costRon: 0.1 },
            { value: "fluorcarbon", label: "Fluorcarbon", costRon: 0.1 },
          ],
        },
        {
          id: "tip-montura",
          label: "Tip montură",
          placeholder: "Alege tipul monturii",
          choices: [
            { value: "fir-par", label: "Fir de păr", costRon: 0 },
            { value: "blowback", label: "Blowback cu varnish", costRon: 0.1 },
            { value: "spin", label: "Cu spin", costRon: 0.2 },
            { value: "banda", label: "Cu bandă", costRon: 0.3 },
            {
              value: "drig",
              label: "Drig",
              costRon: 0.3,
              requires: {
                optionId: "fir-forfac",
                values: ["fluorcarbon"],
              },
            },
          ],
        },
        {
          id: "lungime-rig",
          label: "Lungime rig",
          placeholder: "Alege lungimea rigului",
          choices: [
            { value: "7", label: "7 cm", costRon: 0 },
            { value: "10", label: "10 cm", costRon: 0 },
            { value: "15", label: "15 cm", costRon: 0 },
          ],
        },
      ],
    },
  },
  {
    slug: "montura-elicopter",
    categorySlug: "monturi-forface",
    name: "Montură elicopter",
    shortDescription:
      "Montură elicopter configurabilă, cu preț calculat automat după materiale.",
    description:
      "Montură elicopter configurabilă pentru partide la crap. Alegi firul monturii, conectica și tipul de plumb, iar prețul final este calculat automat pe baza materialelor, cu adaos standard de 30%.",
    priceLabel: "Preț calculat automat",
    priceValueRon: 0,
    images: [DEFAULT_PRODUCT_IMAGE],
    specs: [
      "Fir montură: leadcore sau textil",
      "Conectică: vârtej normal sau agrafă rapidă",
      "Plumbi ficși cu vârtej (hexagonali, rotunzi, grippa)",
    ],
    pricingConfig: {
      markupPercent: DEFAULT_MARKUP_PERCENT,
      options: [
        {
          id: "fir-montura",
          label: "Fir montură",
          placeholder: "Alege firul monturii",
          choices: [
            { value: "leadcore", label: "Leadcore", costRon: 1 },
            { value: "textil", label: "Fir textil", costRon: 0.5 },
          ],
        },
        {
          id: "conectica",
          label: "Tip agrafă",
          placeholder: "Alege tipul agrafei",
          choices: [
            { value: "vartej", label: "Vârtej normal", costRon: 0.3 },
            { value: "agrafa", label: "Agrafă rapidă", costRon: 0.4 },
          ],
        },
        {
          id: "plumb",
          label: "Plumb",
          placeholder: "Alege tipul și gramajul plumbului",
          choices: FIXED_LEADS,
        },
      ],
    },
  },
  {
    slug: "mix-pelete-500g",
    categorySlug: "nade-aditivi",
    name: "Mix pelete 500g",
    shortDescription:
      "Mixul din bagurile noastre, în cutie rezistentă la apă, ideal pentru feeder, PVA sau momitor.",
    description:
      "Mix de pelete folosit în bagurile Lyra, ambalat în cutii de 500g rezistente la apă. Datorită ambalajului, doar umezești, folosești și arunci la gunoi: nu mai stai cu găleți după tine. Potrivit pentru feeder, PVA sau momitor.",
    priceLabel: "11 RON / 500g",
    priceValueRon: 11,
    images: ["/produse-noi/nade-aditivi/mix-pelete.png"],
    specs: [
      "Cantitate: 500g",
      "Ambalaj: cutie rezistentă la apă",
      "Utilizare: feeder, PVA, momitor",
    ],
  },
  {
    slug: "nada-fishmeal-800g",
    categorySlug: "nade-aditivi",
    name: "Nadă Fishmeal",
    shortDescription: "Nadă natur cu 30% făină de pește.",
    description:
      "Nadă pe bază cerealieră, cu adaos de 30% făină de pește. Formulă echilibrată pentru partide la crap pe vaduri solicitate.",
    priceLabel: "15 RON / 800g",
    priceValueRon: 15,
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
    priceLabel: "9 RON / 800g",
    priceValueRon: 9,
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
    priceLabel: "20 RON / 1.5kg",
    priceValueRon: 20,
    images: ["/produse-noi/nade-aditivi/nada-usturoi.png"],
    specs: ["Cantitate: 1.5kg", "Profil: cerealier, aromă intensă de usturoi"],
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

export function formatRon(value: number) {
  return new Intl.NumberFormat("ro-RO", {
    minimumFractionDigits: value % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export function isChoiceAllowed(
  choice: PricingChoice,
  selections: Record<string, string>
) {
  if (!choice.requires) {
    return true;
  }
  return choice.requires.values.includes(selections[choice.requires.optionId] ?? "");
}

export function calculateConfiguredPriceRon(
  product: CatalogProduct,
  selections: Record<string, string>
) {
  if (!product.pricingConfig) {
    return product.priceValueRon;
  }

  const optionCosts: number[] = [];
  for (const option of product.pricingConfig.options) {
    const selectedValue = selections[option.id];
    if (!selectedValue) {
      return null;
    }
    const choice = option.choices.find((entry) => entry.value === selectedValue);
    if (!choice || !isChoiceAllowed(choice, selections)) {
      return null;
    }
    optionCosts.push(choice.costRon);
  }

  const baseCost = optionCosts.reduce((sum, cost) => sum + cost, 0);
  const fixedCost = (product.pricingConfig.fixedCosts ?? []).reduce(
    (sum, entry) => sum + entry.costRon,
    0
  );
  const setSize = product.pricingConfig.setSize ?? 1;
  const beforeMarkup = (baseCost + fixedCost) * setSize;
  return beforeMarkup * (1 + product.pricingConfig.markupPercent / 100);
}

export function getMinimumConfiguredPriceRon(product: CatalogProduct) {
  if (!product.pricingConfig) {
    return product.priceValueRon;
  }

  const options = product.pricingConfig.options;
  let minPrice = Number.POSITIVE_INFINITY;

  const dfs = (optionIndex: number, selections: Record<string, string>) => {
    if (optionIndex === options.length) {
      const price = calculateConfiguredPriceRon(product, selections);
      if (typeof price === "number" && price < minPrice) {
        minPrice = price;
      }
      return;
    }

    const option = options[optionIndex];
    option.choices.forEach((choice) => {
      if (!isChoiceAllowed(choice, selections)) {
        return;
      }
      dfs(optionIndex + 1, { ...selections, [option.id]: choice.value });
    });
  };

  dfs(0, {});
  return minPrice;
}
