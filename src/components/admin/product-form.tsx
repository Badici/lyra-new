import { AdminForm } from "@/components/admin/admin-form";
import { ImageField } from "@/components/admin/image-field";
import { SubmitButton } from "@/components/admin/submit-button";
import { VariantFields, type VariantFieldValue } from "@/components/admin/variant-fields";
import { upsertProduct } from "@/features/products/admin-actions";
import { fromBani } from "@/lib/money";

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
  categoryLinks?: { categoryId: string }[];
  variants?: VariantFieldValue[];
};

export function ProductForm({
  categories,
  product,
}: {
  categories: CategoryOption[];
  product?: ProductFormValues;
}) {
  const selected = new Set(product ? [product.categoryId] : []);
  for (const link of product?.categoryLinks ?? []) selected.add(link.categoryId);

  return (
    <AdminForm action={upsertProduct} returnTo="/admin/produse" className="admin-card grid max-w-3xl gap-4 p-5">
      {product ? <input type="hidden" name="id" value={product.id} /> : null}
      <ImageField
        name="mainImageKey"
        label="Imagine principală"
        hint="1600×1600 px"
        defaultValue={product?.mainImageKey}
      />
      <div>
        <label className="admin-label" htmlFor="name">
          Nume
        </label>
        <input id="name" name="name" required minLength={2} defaultValue={product?.name} className="admin-input" />
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
          <input id="sku" name="sku" required minLength={2} defaultValue={product?.sku} className="admin-input" />
        </div>
      </div>
      <fieldset>
        <legend className="admin-label">Categorii</legend>
        <div className="flex flex-wrap gap-3">
          {categories.map((category) => (
            <label key={category.id} className="inline-flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                name="categoryIds"
                value={category.id}
                defaultChecked={selected.has(category.id)}
              />
              {category.name}
            </label>
          ))}
        </div>
      </fieldset>
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
          <p className="mb-2 text-xs leading-relaxed text-muted">
            De la 1 bucată, clientul pune produsul direct în coș. Sub 20 apare alerta de stoc
            aproape epuizat. 0 înseamnă la comandă. Dacă adaugi variante, stocul lor îl înlocuiește
            pe acesta.
          </p>
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
        <label className="admin-label" htmlFor="description">
          Descriere
        </label>
        <textarea
          id="description"
          name="description"
          defaultValue={product?.description ?? ""}
          className="admin-textarea"
        />
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
      <VariantFields variants={product?.variants} />
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
      <SubmitButton label="Salvează" pendingLabel="Se salvează…" variant="accent" />
    </AdminForm>
  );
}
