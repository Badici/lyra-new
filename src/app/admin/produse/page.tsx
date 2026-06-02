import { ProductsManager } from "@/components/admin/ProductsManager";
import { prisma } from "@/lib/db";

export default async function AdminProductsPage() {
  const [initialProducts, recipes, materialCategories, materials] = await Promise.all([
    prisma.product.findMany({
      select: {
        id: true,
        slug: true,
        name: true,
        basePriceRon: true,
        priceLabel: true,
        displayOrder: true,
        status: true,
      },
      orderBy: [{ displayOrder: "asc" }, { createdAt: "desc" }],
    }),
    prisma.recipe.findMany({
      select: {
        id: true,
        name: true,
        laborType: true,
        laborValue: true,
      },
      orderBy: { updatedAt: "desc" },
    }),
    prisma.materialCategory.findMany({
      select: {
        id: true,
        name: true,
      },
      orderBy: { name: "asc" },
    }),
    prisma.rawMaterial.findMany({
      select: {
        id: true,
        name: true,
        unitCostRon: true,
        categoryId: true,
      },
      where: { active: true },
      orderBy: { name: "asc" },
    }),
  ]);

  return (
    <div className="space-y-4">
      <header>
        <h1 className="text-3xl font-semibold text-[var(--cream)]">Produse</h1>
        <p className="mt-1 text-sm text-[var(--muted)]">
          Gestionare produse, prețuri și structură de catalog.
        </p>
      </header>
      <ProductsManager
        initialProducts={initialProducts}
        recipes={recipes}
        materialCategories={materialCategories}
        materials={materials}
      />
    </div>
  );
}
