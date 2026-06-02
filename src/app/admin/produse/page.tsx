import { ProductsManager } from "@/components/admin/ProductsManager";
import { prisma } from "@/lib/db";

export default async function AdminProductsPage() {
  const initialProducts = await prisma.product.findMany({
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
  });

  return (
    <div className="space-y-4">
      <header>
        <h1 className="text-3xl font-semibold text-[var(--cream)]">Produse</h1>
        <p className="mt-1 text-sm text-[var(--muted)]">
          Gestionare produse, prețuri și structură de catalog.
        </p>
      </header>
      <ProductsManager initialProducts={initialProducts} />
    </div>
  );
}
