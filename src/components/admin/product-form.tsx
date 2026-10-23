import { upsertProduct } from "@/features/products/admin-actions";
import { fromBani } from "@/lib/money";
import { ImageField } from "@/components/admin/image-field";

type CategoryOption = { id: string; name: string };

export type ProductFormValues = {
  id: string;
  name: string;
  slug: string;
  sku: string;
  categoryId: string;
  shortDescription: string | null;
  description: string | null;
  story: string | null;
  usageInstructions: string | null;
  priceBani: number;
  compareAtPriceBani: number | null;
  stockQuantity: number;
  isActive: boolean;
  isFeatured: boolean;
  isPopular: boolean;
  mainImageKey: string | null;
};

export function ProductForm({
  categories,
  product,
}: {
  categories: CategoryOption[];
  product?: ProductFormValues;
}) {
  return (
    <form action={upsertProduct} className="admin-card grid max-w-3xl gap-4 p-5">
      {product ? <input type="hidden" name="id" value={product.id} /> : null}
      <ImageField name="mainImageKey" label="Imagine principală" defaultValue={product?.mainImageKey} />
      <div>
        <label className="admin-label" htmlFor="name">
          Nume
        </label>
        <input id="name" name="name" required defaultValue={product?.name} className="admin-input" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="admin-label" htmlFor="slug">
            Slug (opțional)
          </label>
          <input id="slug" name="slug" defaultValue={product?.slug} className="admin-input" />
        </div>
        <div>
          <label className="admin-label" htmlFor="sku">
            SKU
          </label>
          <input id="sku" name="sku" required defaultValue={product?.sku} className="admin-input" />
        </div>
      </div>
      <div>
        <label className="admin-label" htmlFor="categoryId">
          Categorie
        </label>
        <select
          id="categoryId"
          name="categoryId"
          required
          defaultValue={product?.categoryId}
          className="admin-select"
        >
          <option value="">Selectează</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="admin-label" htmlFor="priceRon">
            Preț (RON)
          </label>
          <input
            id="priceRon"
            name="priceRon"
            type="number"
            step="0.01"
            min="0.01"
            required
            defaultValue={product ? fromBani(product.priceBani) : ""}
            className="admin-input"
          />
        </div>
        <div>
          <label className="admin-label" htmlFor="stockQuantity">
            Stoc
          </label>
          <input
            id="stockQuantity"
            name="stockQuantity"
            type="number"
            min="0"
            required
            defaultValue={product?.stockQuantity ?? 0}
            className="admin-input"
          />
        </div>
      </div>
      <div>
        <label className="admin-label" htmlFor="shortDescription">
          Descriere scurtă
        </label>
        <textarea
          id="shortDescription"
          name="shortDescription"
          defaultValue={product?.shortDescription ?? ""}
          className="admin-textarea"
        />
      </div>
      <div>
        <label className="admin-label" htmlFor="story">
          Poveste
        </label>
        <textarea id="story" name="story" defaultValue={product?.story ?? ""} className="admin-textarea" />
      </div>
      <div>
        <label className="admin-label" htmlFor="usageInstructions">
          Utilizare
        </label>
        <textarea
          id="usageInstructions"
          name="usageInstructions"
          defaultValue={product?.usageInstructions ?? ""}
          className="admin-textarea"
        />
      </div>
      <div className="flex flex-wrap gap-4 text-sm">
        <label className="inline-flex items-center gap-2">
          <input type="checkbox" name="isActive" defaultChecked={product?.isActive ?? true} />
          Activ
        </label>
        <label className="inline-flex items-center gap-2">
          <input type="checkbox" name="isFeatured" defaultChecked={product?.isFeatured} />
          Featured
        </label>
        <label className="inline-flex items-center gap-2">
          <input type="checkbox" name="isPopular" defaultChecked={product?.isPopular} />
          Popular
        </label>
      </div>
      <button type="submit" className="rounded-xl bg-accent px-4 py-2 text-sm text-cream">
        Salvează
      </button>
    </form>
  );
}
