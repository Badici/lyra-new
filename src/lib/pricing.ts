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
  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: {
      recipe: {
        include: {
          items: {
            include: {
              material: true,
              materialCategory: {
                include: {
                  materials: true,
                },
              },
            },
          },
        },
      },
      recipeItems: {
        include: {
          material: true,
        },
      },
    },
  });

  if (!product) {
    return 0;
  }

  const newRecipeMaterialsCost = (product.recipe?.items ?? []).reduce((sum, item) => {
    if (item.material) {
      return sum + item.material.unitCostRon * item.qty;
    }
    if (item.materialCategory) {
      const cheapest = item.materialCategory.materials
        .filter((material) => material.active)
        .sort((a, b) => a.unitCostRon - b.unitCostRon)[0];
      if (!cheapest) {
        return sum;
      }
      return sum + cheapest.unitCostRon * item.qty;
    }
    return sum;
  }, 0);

  const legacyRecipeCost = product.recipeItems.reduce((sum, row) => {
    const base = row.material.unitCostRon * row.qty;
    const waste = base * (row.wastePct / 100);
    return sum + base + waste;
  }, 0);

  const recipeMaterialCost =
    newRecipeMaterialsCost > 0 ? newRecipeMaterialsCost : legacyRecipeCost;

  if (!product.recipe) {
    return recipeMaterialCost;
  }

  if (product.recipe.laborType === "PERCENT") {
    return recipeMaterialCost + recipeMaterialCost * (product.recipe.laborValue / 100);
  }

  return recipeMaterialCost + product.recipe.laborValue;
}

export async function resolveUnitPriceRon(productId: string, fallbackPriceRon: number) {
  const override = await getActivePriceOverride(productId);
  if (override) {
    return override.overrideRon;
  }
  return fallbackPriceRon;
}
