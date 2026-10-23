/** Money helpers — amounts stored and calculated in integer bani (1 RON = 100 bani). */

export type Bani = number & { readonly __brand: "bani" };

export function toBani(ron: number): Bani {
  if (!Number.isFinite(ron)) {
    throw new Error("Invalid RON amount");
  }
  return Math.round(ron * 100) as Bani;
}

export function fromBani(bani: number): number {
  return bani / 100;
}

export function formatRon(bani: number, locale = "ro-RO"): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "RON",
    minimumFractionDigits: 2,
  }).format(fromBani(bani));
}

export function multiplyBani(bani: number, quantity: number): Bani {
  if (!Number.isInteger(quantity) || quantity < 0) {
    throw new Error("Quantity must be a non-negative integer");
  }
  return (bani * quantity) as Bani;
}

export function sumBani(amounts: number[]): Bani {
  return amounts.reduce((acc, n) => acc + n, 0) as Bani;
}

export function assertBani(value: number): asserts value is Bani {
  if (!Number.isInteger(value)) {
    throw new Error("Money amount must be an integer number of bani");
  }
}
