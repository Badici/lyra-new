import { MaterialsManager } from "@/components/admin/MaterialsManager";
import { prisma } from "@/lib/db";

export default async function AdminMaterialsPage() {
  const [initialRows, initialCategories] = await Promise.all([
    prisma.rawMaterial.findMany({
      select: {
        id: true,
        name: true,
        unitCostRon: true,
        active: true,
        categoryId: true,
        category: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: { updatedAt: "desc" },
    }),
    prisma.materialCategory.findMany({
      select: {
        id: true,
        name: true,
        description: true,
      },
      orderBy: { name: "asc" },
    }),
  ]);

  return (
    <div className="space-y-4">
      <header>
        <h1 className="text-3xl font-semibold text-[var(--cream)]">Materii prime</h1>
        <p className="mt-1 text-sm text-[var(--muted)]">
          Controlezi costurile de producție pentru calculele de profit.
        </p>
      </header>
      <MaterialsManager initialRows={initialRows} initialCategories={initialCategories} />
    </div>
  );
}
