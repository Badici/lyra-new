import { prisma } from "@/lib/db";

export async function getActivePriceOverride(productId: string) {
  const now = new Date();
  return prisma.productPricingOverride.findFirst({
    where: {
      productId,
      active: true,
      activeFrom: {
        lte: now,
      },
      OR: [{ activeTo: null }, { activeTo: { gte: now } }],
    },
    orderBy: [{ activeFrom: "desc" }],
  });
}

export async function computeRecipeCost(productId: string) {
  const recipeRows = await prisma.productRecipe.findMany({
    where: { productId },
    include: { material: true },
  });

  return recipeRows.reduce((sum, row) => {
    const base = row.material.unitCostRon * row.qty;
    const waste = base * (row.wastePct / 100);
    return sum + base + waste;
  }, 0);
}

export async function resolveUnitPriceRon(productId: string, fallbackPriceRon: number) {
  const override = await getActivePriceOverride(productId);
  if (override) {
    return override.overrideRon;
  }
  return fallbackPriceRon;
}
