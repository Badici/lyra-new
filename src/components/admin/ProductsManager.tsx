"use client";

import { useState } from "react";

type ProductRow = {
  id: string;
  slug: string;
  name: string;
  basePriceRon: number;
  priceLabel: string;
  displayOrder: number;
  status: "ACTIVE" | "DRAFT" | "ARCHIVED";
};

const DEFAULT_FORM = {
  slug: "",
  name: "",
  shortDescription: "",
  description: "",
  specs: "",
  images: "",
  basePriceRon: 0,
  priceLabel: "",
  isConfigurable: false,
  displayOrder: 100,
  status: "ACTIVE",
};

export function ProductsManager({ initialProducts }: { initialProducts: ProductRow[] }) {
  const [products, setProducts] = useState<ProductRow[]>(initialProducts);
  const [form, setForm] = useState({ ...DEFAULT_FORM });
  const [error, setError] = useState("");

  const load = async () => {
    const response = await fetch("/api/admin/products");
    if (!response.ok) {
      setError("Nu am putut încărca produsele.");
      return;
    }
    const rows = (await response.json()) as ProductRow[];
    setProducts(rows);
  };

  return (
    <div className="space-y-5">
      <form
        className="grid gap-3 rounded-2xl border border-white/10 bg-[var(--lake)]/30 p-4 md:grid-cols-2"
        onSubmit={async (event) => {
          event.preventDefault();
          setError("");
          const payload = {
            slug: form.slug,
            name: form.name,
            shortDescription: form.shortDescription,
            description: form.description,
            specs: form.specs
              .split("\n")
              .map((entry) => entry.trim())
              .filter(Boolean),
            images: form.images
              .split("\n")
              .map((entry) => entry.trim())
              .filter(Boolean),
            basePriceRon: Number(form.basePriceRon),
            priceLabel: form.priceLabel,
            isConfigurable: form.isConfigurable,
            displayOrder: Number(form.displayOrder),
            status: form.status,
          };
          const response = await fetch("/api/admin/products", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });
          if (!response.ok) {
            const body = (await response.json()) as { error?: string };
            setError(body.error ?? "Nu am putut crea produsul.");
            return;
          }
          setForm({ ...DEFAULT_FORM });
          await load();
        }}
      >
        <h2 className="md:col-span-2 text-xl font-semibold text-[var(--cream)]">
          Adaugă produs
        </h2>
        <input
          placeholder="Slug"
          value={form.slug}
          onChange={(event) => setForm((v) => ({ ...v, slug: event.target.value }))}
          className="rounded-lg border border-white/15 bg-[var(--background)] px-3 py-2 text-sm text-[var(--cream)]"
        />
        <input
          placeholder="Nume"
          value={form.name}
          onChange={(event) => setForm((v) => ({ ...v, name: event.target.value }))}
          className="rounded-lg border border-white/15 bg-[var(--background)] px-3 py-2 text-sm text-[var(--cream)]"
        />
        <textarea
          placeholder="Descriere scurtă"
          value={form.shortDescription}
          onChange={(event) =>
            setForm((v) => ({ ...v, shortDescription: event.target.value }))
          }
          className="md:col-span-2 rounded-lg border border-white/15 bg-[var(--background)] px-3 py-2 text-sm text-[var(--cream)]"
        />
        <textarea
          placeholder="Descriere completă"
          value={form.description}
          onChange={(event) => setForm((v) => ({ ...v, description: event.target.value }))}
          className="md:col-span-2 rounded-lg border border-white/15 bg-[var(--background)] px-3 py-2 text-sm text-[var(--cream)]"
        />
        <textarea
          placeholder={"Specificații, una pe linie"}
          value={form.specs}
          onChange={(event) => setForm((v) => ({ ...v, specs: event.target.value }))}
          className="rounded-lg border border-white/15 bg-[var(--background)] px-3 py-2 text-sm text-[var(--cream)]"
        />
        <textarea
          placeholder={"Imagini URL, una pe linie"}
          value={form.images}
          onChange={(event) => setForm((v) => ({ ...v, images: event.target.value }))}
          className="rounded-lg border border-white/15 bg-[var(--background)] px-3 py-2 text-sm text-[var(--cream)]"
        />
        <input
          type="number"
          step="0.01"
          placeholder="Preț bază RON"
          value={form.basePriceRon}
          onChange={(event) =>
            setForm((v) => ({ ...v, basePriceRon: Number(event.target.value) }))
          }
          className="rounded-lg border border-white/15 bg-[var(--background)] px-3 py-2 text-sm text-[var(--cream)]"
        />
        <input
          placeholder="Label preț"
          value={form.priceLabel}
          onChange={(event) => setForm((v) => ({ ...v, priceLabel: event.target.value }))}
          className="rounded-lg border border-white/15 bg-[var(--background)] px-3 py-2 text-sm text-[var(--cream)]"
        />
        <input
          type="number"
          placeholder="Ordine afișare"
          value={form.displayOrder}
          onChange={(event) =>
            setForm((v) => ({ ...v, displayOrder: Number(event.target.value) }))
          }
          className="rounded-lg border border-white/15 bg-[var(--background)] px-3 py-2 text-sm text-[var(--cream)]"
        />
        <select
          value={form.status}
          onChange={(event) =>
            setForm((v) => ({
              ...v,
              status: event.target.value as ProductRow["status"],
            }))
          }
          className="rounded-lg border border-white/15 bg-[var(--background)] px-3 py-2 text-sm text-[var(--cream)]"
        >
          <option value="ACTIVE">Activ</option>
          <option value="DRAFT">Draft</option>
          <option value="ARCHIVED">Arhivat</option>
        </select>
        <label className="flex items-center gap-2 text-sm text-[var(--muted)]">
          <input
            type="checkbox"
            checked={form.isConfigurable}
            onChange={(event) =>
              setForm((v) => ({ ...v, isConfigurable: event.target.checked }))
            }
          />
          Preț calculat/configurabil
        </label>
        {error ? <p className="md:col-span-2 text-sm text-red-300">{error}</p> : null}
        <button
          type="submit"
          className="md:col-span-2 rounded-xl bg-[var(--accent)] px-4 py-2 font-semibold text-white hover:bg-[var(--accent-light)]"
        >
          Salvează produs
        </button>
      </form>

      <section className="rounded-2xl border border-white/10 bg-[var(--lake)]/30 p-4">
        <h3 className="text-lg font-semibold text-[var(--cream)]">Produse existente</h3>
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-[var(--muted)]">
                <th className="p-2">Nume</th>
                <th className="p-2">Slug</th>
                <th className="p-2">Preț bază</th>
                <th className="p-2">Ordine</th>
                <th className="p-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-t border-white/10 text-[var(--cream)]">
                  <td className="p-2">{product.name}</td>
                  <td className="p-2 text-[var(--muted)]">{product.slug}</td>
                  <td className="p-2">{product.basePriceRon.toFixed(2)} RON</td>
                  <td className="p-2">{product.displayOrder}</td>
                  <td className="p-2">{product.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
