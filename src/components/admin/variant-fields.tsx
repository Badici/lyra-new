"use client";

import { useState } from "react";
import { fromBani } from "@/lib/money";

export type VariantFieldValue = {
  id: string;
  name: string;
  priceBani: number | null;
  stockQuantity: number;
  sku: string | null;
};

type Row = {
  key: string;
  id: string;
  name: string;
  priceRon: string;
  stock: string;
  sku: string;
};

function draft(variant?: VariantFieldValue): Row {
  return {
    key: variant?.id || crypto.randomUUID(),
    id: variant?.id ?? "",
    name: variant?.name ?? "",
    priceRon: variant?.priceBani == null ? "" : String(fromBani(variant.priceBani)),
    stock: variant ? String(variant.stockQuantity) : "0",
    sku: variant?.sku ?? "",
  };
}

export function VariantFields({ variants = [] }: { variants?: VariantFieldValue[] }) {
  const [rows, setRows] = useState<Row[]>(() => variants.map((variant) => draft(variant)));

  return (
    <fieldset className="space-y-3 rounded-2xl border border-border p-4">
      <legend className="px-1 text-sm text-muted">Variante</legend>
      <p className="text-xs leading-relaxed text-muted">
        Lasă prețul gol dacă varianta costă la fel ca produsul. Stocul fiecărei variante decide
        dacă se poate pune direct în coș.
      </p>
      {rows.map((row, index) => (
        <div key={row.key} className="grid gap-2 sm:grid-cols-2">
          <input type="hidden" name="variantId" value={row.id} />
          <input
            name="variantName"
            value={row.name}
            placeholder={`Variantă ${index + 1}`}
            aria-label={`Nume variantă ${index + 1}`}
            onChange={(event) => update(row.key, { name: event.target.value })}
            className="admin-input sm:col-span-2"
          />
          <input
            name="variantPriceRon"
            value={row.priceRon}
            inputMode="decimal"
            placeholder="Preț RON, sau gol"
            aria-label={`Preț variantă ${index + 1}`}
            onChange={(event) => update(row.key, { priceRon: event.target.value })}
            className="admin-input"
          />
          <input
            name="variantStock"
            value={row.stock}
            type="number"
            min="0"
            aria-label={`Stoc variantă ${index + 1}`}
            onChange={(event) => update(row.key, { stock: event.target.value })}
            className="admin-input"
          />
          <input
            name="variantSku"
            value={row.sku}
            placeholder="SKU variantă, opțional"
            aria-label={`SKU variantă ${index + 1}`}
            onChange={(event) => update(row.key, { sku: event.target.value })}
            className="admin-input"
          />
          <button
            type="button"
            className="text-left text-sm text-muted underline-offset-4 hover:underline"
            onClick={() => setRows((current) => current.filter((item) => item.key !== row.key))}
          >
            Elimină varianta
          </button>
        </div>
      ))}
      <button
        type="button"
        className="rounded-xl border border-border px-3 py-2 text-sm transition duration-300 ease-out hover:scale-[1.03] active:scale-[0.97]"
        onClick={() => setRows((current) => [...current, draft()])}
      >
        Adaugă variantă
      </button>
    </fieldset>
  );

  function update(key: string, patch: Partial<Row>) {
    setRows((current) => current.map((row) => (row.key === key ? { ...row, ...patch } : row)));
  }
}
