"use client";

import { useEffect, useState } from "react";
import { useCart } from "@/components/cart/CartProvider";

type AddToCartPayload = {
  productSlug: string;
  name: string;
  priceLabel: string;
  priceValueRon: number;
  image: string;
  variantSelector?: {
    label: string;
    values: string[];
    placeholder?: string;
  };
};

export function AddToCartButton({ product }: { product: AddToCartPayload }) {
  const [quantity, setQuantity] = useState(1);
  const [feedback, setFeedback] = useState("");
  const [selectedVariant, setSelectedVariant] = useState("");
  const { addItem } = useCart();
  const variantRequired = Boolean(product.variantSelector);
  const canAdd = !variantRequired || Boolean(selectedVariant);

  useEffect(() => {
    if (!feedback) {
      return;
    }

    const timeout = window.setTimeout(() => {
      setFeedback("");
    }, 2000);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [feedback]);

  return (
    <div className="space-y-3">
      {product.variantSelector ? (
        <div className="space-y-2">
          <label
            htmlFor="variant"
            className="text-sm font-medium text-[var(--cream)]"
          >
            {product.variantSelector.label}
          </label>
          <select
            id="variant"
            value={selectedVariant}
            onChange={(event) => setSelectedVariant(event.target.value)}
            className="w-full rounded-lg border border-white/15 bg-[var(--background)] px-3 py-2 text-[var(--cream)] outline-none ring-[var(--accent)]/70 focus:ring-2"
          >
            <option value="">
              {product.variantSelector.placeholder ?? "Alege opțiunea"}
            </option>
            {product.variantSelector.values.map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </div>
      ) : null}

      <div className="flex items-center gap-3">
        <label htmlFor="quantity" className="text-sm text-[var(--muted)]">
          Cantitate
        </label>
        <input
          id="quantity"
          type="number"
          min={1}
          value={quantity}
          onChange={(event) =>
            setQuantity(Math.max(1, Number(event.target.value) || 1))
          }
          className="w-20 rounded-lg border border-white/15 bg-[var(--background)] px-3 py-2 text-[var(--cream)] outline-none ring-[var(--accent)]/70 focus:ring-2"
        />
      </div>

      <button
        type="button"
        disabled={!canAdd}
        onClick={() => {
          const variantLabel = product.variantSelector?.label ?? "Variantă";
          const productName = selectedVariant
            ? `${product.name} (${variantLabel}: ${selectedVariant})`
            : product.name;
          const productSlug = selectedVariant
            ? `${product.productSlug}::${selectedVariant}`
            : product.productSlug;

          addItem(
            {
              ...product,
              name: productName,
              productSlug,
            },
            quantity
          );
          setFeedback("Produs adăugat în coș.");
        }}
        className={`inline-flex w-full items-center justify-center rounded-xl px-5 py-3 font-semibold text-white transition-colors ${
          canAdd
            ? "bg-[var(--accent)] hover:bg-[var(--accent-light)]"
            : "cursor-not-allowed bg-[var(--accent)]/40"
        }`}
      >
        Adaugă în coș
      </button>

      {variantRequired && !canAdd ? (
        <p className="text-sm text-[var(--muted)]">
          {product.variantSelector?.label === "Momeală la cârlig"
            ? "Selectează tipul de momeală de cârlig."
            : "Selectează mărimea înainte de a adăuga produsul în coș."}
        </p>
      ) : null}

      {feedback ? (
        <p className="text-sm text-green-400">{feedback}</p>
      ) : null}
    </div>
  );
}
