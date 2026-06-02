import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import type { CatalogProduct } from "@/data/catalog";

type ProductWithRecipe = Prisma.ProductGetPayload<{
  include: {
    recipe: {
      include: {
        items: {
          include: {
            material: true;
            materialCategory: {
              include: {
                materials: true;
              };
            };
          };
        };
      };
    };
  };
}>;

function buildPricingConfigFromRecipe(row: ProductWithRecipe) {
  if (row.pricingMode !== "AUTO" || !row.recipe) {
    return undefined;
  }

  const categoryItems = row.recipe.items.filter((item) => item.materialCategory);
  const fixedMaterialItems = row.recipe.items.filter((item) => item.material);

  const options = categoryItems
    .map((item, index) => {
    const category = item.materialCategory!;
    return {
      id: `recipe-category-${category.id}-${index}`,
      label: category.name,
      placeholder: `Alege ${category.name.toLowerCase()}`,
      choices: category.materials
        .filter((material) => material.active)
        .map((material) => ({
          value: material.id,
          label: material.name,
          costRon: material.unitCostRon * item.qty,
        })),
      };
    })
    .filter((option) => option.choices.length > 0);

  const fixedCosts = fixedMaterialItems.map((item) => ({
    label: item.material!.name,
    costRon: item.material!.unitCostRon * item.qty,
  }));

  if (row.recipe.laborType === "FIXED" && row.recipe.laborValue > 0) {
    fixedCosts.push({
      label: "Manoperă",
      costRon: row.recipe.laborValue,
    });
  }

  const generatedConfig = {
    options,
    fixedCosts,
    markupPercent: row.recipe.laborType === "PERCENT" ? row.recipe.laborValue : 0,
  };

  if (generatedConfig.options.length === 0 && generatedConfig.fixedCosts.length === 0) {
    return undefined;
  }

  return generatedConfig;
}

function mapProduct(row: ProductWithRecipe): CatalogProduct {
  const pricingConfig =
    buildPricingConfigFromRecipe(row) ??
    (row.pricingConfigJson && typeof row.pricingConfigJson === "object"
      ? (row.pricingConfigJson as CatalogProduct["pricingConfig"])
      : undefined);

  const variantSelector =
    row.variantSelectorLabel && row.variantValues.length > 0
      ? {
          label: row.variantSelectorLabel,
          values: row.variantValues,
          placeholder: row.variantPlaceholder ?? undefined,
        }
      : undefined;

  return {
    slug: row.slug,
    name: row.name,
    shortDescription: row.shortDescription,
    description: row.description,
    priceLabel: row.priceLabel,
    priceValueRon: row.basePriceRon,
    images: row.images,
    specs: row.specs,
    variantSelector,
    customOrderNote: row.customOrderNote ?? undefined,
    pricingConfig,
  };
}

export async function getProductsFromDb() {
  if (!process.env.DATABASE_URL) {
    return [];
  }
  const rows = await prisma.product.findMany({
    where: {
      status: "ACTIVE",
    },
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
    },
    orderBy: [{ displayOrder: "asc" }, { name: "asc" }],
  });
  return rows.map(mapProduct);
}

export async function getProductBySlugFromDb(slug: string) {
  if (!process.env.DATABASE_URL) {
    return null;
  }
  const row = await prisma.product.findUnique({
    where: { slug },
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
    },
  });
  if (!row || row.status !== "ACTIVE") {
    return null;
  }
  return mapProduct(row);
}
