export type NadaVariant = {
  id: string;
  name: string;
  pricePlaceholder: string;
  image?: string;
};

export const nadaVariants: NadaVariant[] = [
  { id: "n-1", name: "Vanilie", pricePlaceholder: "15 RON / 800g", image: "/vanilie.png" },
  { id: "n-2", name: "Tutti Frutti", pricePlaceholder: "15 RON / 800g", image: "/tutti-frutti.png" },
  { id: "n-3", name: "Capsuni și miere", pricePlaceholder: "15 RON / 800g", image: "/capsuni-miere.png" },
  { id: "n-4", name: "Larve", pricePlaceholder: "15 RON / 800g", image: "/larve.png" },
];
