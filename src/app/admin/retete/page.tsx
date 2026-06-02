import { RecipesManager } from "@/components/admin/RecipesManager";
import { prisma } from "@/lib/db";

export default async function AdminRecipesPage() {
  const [products, materials, initialRows] = await Promise.all([
    prisma.product.findMany({
      select: { id: true, name: true },
      where: { status: "ACTIVE" },
      orderBy: { name: "asc" },
    }),
    prisma.rawMaterial.findMany({
      select: { id: true, name: true, unit: true },
      where: { active: true },
      orderBy: { name: "asc" },
    }),
    prisma.productRecipe.findMany({
      include: {
        product: { select: { name: true } },
        material: { select: { name: true, unit: true } },
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
      <RecipesManager products={products} materials={materials} initialRows={initialRows} />
    </div>
  );
}
