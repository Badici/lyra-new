import { notFound } from "next/navigation";
import { PageHeader } from "@/components/admin/page-header";
import { ProductForm } from "@/components/admin/product-form";
import { ConfirmDeleteForm } from "@/components/admin/confirm-delete-form";
import { deleteProduct } from "@/features/products/admin-actions";
import { getAdminProductById } from "@/features/products/admin-queries";
import { getActiveCategories } from "@/features/products/queries";

type Params = Promise<{ id: string }>;

export default async function EditProductPage({ params }: { params: Params }) {
  const { id } = await params;
  const [product, categories] = await Promise.all([
    getAdminProductById(id),
    getActiveCategories(),
  ]);
  if (!product) notFound();

  return (
    <div className="space-y-6 p-4 md:p-8">
      <PageHeader title={product.name} backHref="/admin/produse" />
      <ProductForm categories={categories} product={product} />
      <ConfirmDeleteForm
        action={deleteProduct}
        hiddenFields={{ id: product.id }}
        label="Șterge produsul"
        confirmMessage="Confirmi ștergerea produsului?"
      />
    </div>
  );
}
