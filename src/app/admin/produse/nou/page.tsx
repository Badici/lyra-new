import { PageHeader } from "@/components/admin/page-header";
import { ProductForm } from "@/components/admin/product-form";
import { getActiveCategories } from "@/features/products/queries";

export default async function NewProductPage() {
  const categories = await getActiveCategories();

  return (
    <div className="space-y-6 p-4 md:p-8">
      <PageHeader title="Produs nou" backHref="/admin/produse" />
      <ProductForm categories={categories} />
    </div>
  );
}
