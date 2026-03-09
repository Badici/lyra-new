export type Product = {
  id: string;
  name: string;
  pricePlaceholder: string;
  image?: string;
};

export const accessories: Product[] = [
  { id: "acc-1", name: "Agrafe rapide cu varnish 10 buc", pricePlaceholder: "— RON" },
  { id: "acc-2", name: "Carabină mică blocabilă", pricePlaceholder: "— RON" },
  { id: "acc-3", name: "Carnet impermeabil pescuit", pricePlaceholder: "— RON" },
  { id: "acc-4", name: "Chiuvetă portabilă camping 8L", pricePlaceholder: "— RON" },
  { id: "acc-5", name: "Cuie de cort cu șnur", pricePlaceholder: "— RON" },
  { id: "acc-6", name: "Cutie organizare cârlige siliconic", pricePlaceholder: "— RON" },
  { id: "acc-7", name: "Lanterne camping", pricePlaceholder: "— RON" },
  { id: "acc-8", name: "Scaun pliant pescuit", pricePlaceholder: "— RON" },
  { id: "acc-9", name: "Saci dormit camping", pricePlaceholder: "— RON" },
  { id: "acc-10", name: "Set undițe și accesorii", pricePlaceholder: "— RON" },
  { id: "acc-11", name: "Balanță electronică", pricePlaceholder: "— RON" },
  { id: "acc-12", name: "Cort pescuit 2 persoane", pricePlaceholder: "— RON" },
];

export type BoillieProduct = {
  id: string;
  name: string;
  description: string;
  price: string;
  image?: string;
};

export const bigFishProducts: BoillieProduct[] = [
  { id: "bf-1", name: "Boillies BigFish 20mm tari", description: "Momeală de calitate, diametru 20mm, formulă tare — rezistă la pești albi.", price: "40 RON / kg", image: "/boillie-tari.png" },
  { id: "bf-2", name: "Boillies BigFish 20mm solubile", description: "Boillies care se desfac în apă — atrag și țin peștii în zonă.", price: "35 RON / kg", image: "/boillie-solubile.png" },
  { id: "bf-3", name: "Set varietate hookbaits BigFish", description: "Mix de boillies în dimensiuni mici, ideale pentru cârlige.", price: "30 RON / 100g", image: "/boillie-carlig.png" },
  { id: "bf-4", name: "Pastă BigFish", description: "Pastă de calitate, aceeași rețetă ca boillies-urile BigFish.", price: "25 RON / 300g", image: "/pasta-boillie.png" },
];

export const mixDeNadire: BoillieProduct = {
  id: "mix-nadire",
  name: "Mix de nădire",
  description: "Amestec de boillies și forme diferite, pentru spod și baitboat. Ideale pentru atragerea în zonă.",
  price: "30 RON / kg",
  image: "/amestec-nadire-bun.png",
};

export const boilliesComingSoon = {
  name: "Boillie fruity",
  tagline: "În curând — arome fruity pentru vară.",
};

export type Montura = {
  id: string;
  name: string;
  price: string;
  image?: string;
};

export const monturi: Montura[] = [
  { id: "mont-1", name: "Montor inline pe leadcore, cu forfecă și fir de păr textil", price: "15 RON", image: "/momitor.png" },
  { id: "mont-2", name: "Plumb pastă inline pe leadcore, cu montură fir de păr textil", price: "15 RON", image: "/plumb-pasta.png" },
  { id: "mont-3", name: "Elicopter pe leadcore, cu fir de păr fluorcarbon", price: "15 RON", image: "/elicopter.png" },
  { id: "mont-4", name: "Elicopter fir camuflat natural, cu piatră naturală și fir de păr fluorcarbon", price: "22 RON", image: "/elicopter-piatra.png" },
];

export type PvaProduct = {
  id: string;
  name: string;
  description: string;
  price: string;
  image?: string;
};

export const pvaProducts: PvaProduct[] = [
  { id: "pva-1", name: "Pungă PVA", description: "Pungi PVA umplute cu mix propriu Lyra.", price: "18 RON / bucată", image: "/punga-pva.png" },
  { id: "pva-2", name: "Saculeți PVA", description: "Set 6 saculeți PVA, umpluți.", price: "10 RON / set", image: "/saculeti-pva.png" },
];

export type PlasticBait = {
  id: string;
  name: string;
  description?: string;
  price: string;
  image?: string;
};

export const plasticBaits: PlasticBait[] = [
  { id: "hb-1", name: "Porumb plastic galben", description: "Aromă de porumb natural.", price: "10 RON / 20 buc", image: "/porumb-plastic.png" },
  { id: "hb-2", name: "Viermi plastic multicolori", price: "10 RON / 20 buc", image: "/viermi-plastic.png" },
];

export const whatsappNumber = "+40728241412";
