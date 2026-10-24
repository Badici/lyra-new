export type OfferVariant = {
  priceBani: number | null;
  stockQuantity: number;
};

export function publicOffer(
  basePriceBani: number,
  baseStock: number,
  variants: OfferVariant[],
) {
  if (variants.length === 0) {
    return { priceBani: basePriceBani, fromPrice: false, stockQuantity: baseStock };
  }
  const prices = variants.map((variant) => variant.priceBani ?? basePriceBani);
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  return {
    priceBani: min,
    fromPrice: min !== max,
    stockQuantity: Math.max(...variants.map((variant) => variant.stockQuantity)),
  };
}

export function variantUnitPrice(basePriceBani: number, variantPriceBani: number | null) {
  return variantPriceBani ?? basePriceBani;
}
