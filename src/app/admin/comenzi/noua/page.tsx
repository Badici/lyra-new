import { ManualOrderForm } from "@/components/admin/ManualOrderForm";
import { prisma } from "@/lib/db";

export default async function AdminManualOrderPage() {
  const products = await prisma.product.findMany({
    where: { status: "ACTIVE" },
    select: { slug: true, name: true, basePriceRon: true },
    orderBy: { name: "asc" },
  });

  return <ManualOrderForm products={products} />;
}
