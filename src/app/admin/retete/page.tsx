import { RecipesManager } from "@/components/admin/RecipesManager";
import { prisma } from "@/lib/db";

export default async function AdminRecipesPage() {
  const [materials, materialCategories, initialRows] = await Promise.all([
    prisma.rawMaterial.findMany({
      select: {
        id: true,
        name: true,
        unit: true,
        category: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      where: { active: true },
      orderBy: { name: "asc" },
    }),
    prisma.materialCategory.findMany({
      select: {
        id: true,
        name: true,
      },
      orderBy: { name: "asc" },
    }),
    prisma.recipe.findMany({
      include: {
        items: {
          include: {
            material: {
              include: {
                category: {
                  select: { name: true },
                },
              },
            },
            materialCategory: {
              include: {
                materials: {
                  where: { active: true },
                  orderBy: { name: "asc" },
                },
              },
            },
          },
        },
        products: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: { updatedAt: "desc" },
    }),
  ]);

  return (
    <div className="space-y-4">
      <header>
        <h1 className="text-3xl font-semibold text-[var(--cream)]">Rețete produse</h1>
        <p className="mt-1 text-sm text-[var(--muted)]">
          Asociezi materii prime pe produs pentru cost și profit real.
        </p>
      </header>
      <RecipesManager
        materials={materials}
        materialCategories={materialCategories}
        initialRows={initialRows}
      />
    </div>
  );
}
