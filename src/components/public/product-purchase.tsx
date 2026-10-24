"use client";

import { useState } from "react";
import { Minus, Plus } from "lucide-react";
import { toast } from "sonner";
import { StockNotice } from "@/components/public/stock-notice";
import { Button } from "@/components/ui/button";
import { useCart } from "@/features/cart/cart-context";
import { formatRon } from "@/lib/money";
import { variantUnitPrice } from "@/lib/offer";

export type PurchaseVariant = {
  id: string;
  name: string;
  priceBani: number | null;
  stockQuantity: number;
};

type Props = {
  productId: string;
  slug: string;
  name: string;
  priceBani: number;
  compareAtPriceBani?: number | null;
  stockQuantity: number;
  variants: PurchaseVariant[];
};

export function ProductPurchase({
  productId,
  slug,
  name,
  priceBani,
  compareAtPriceBani,
  stockQuantity,
  variants,
}: Props) {
  const { addItem } = useCart();
  const [variantId, setVariantId] = useState(variants[0]?.id ?? "");
  const [quantity, setQuantity] = useState(1);
  const [pending, setPending] = useState(false);

  const variant = variants.find((item) => item.id === variantId) ?? null;
  const unitPrice = variant ? variantUnitPrice(priceBani, variant.priceBani) : priceBani;
  const stock = variant ? variant.stockQuantity : stockQuantity;
  const maxQuantity = stock > 0 ? stock : 99;
  const safeQuantity = Math.min(Math.max(1, quantity), maxQuantity);

  function changeQuantity(next: number) {
    if (!Number.isFinite(next)) return;
    setQuantity(Math.min(Math.max(1, Math.floor(next)), maxQuantity));
  }

  function add() {
    if (variants.length > 0 && !variant) {
      toast.error("Alege o variantă.");
      return;
    }
    setPending(true);
    const lineName = variant ? `${name} — ${variant.name}` : name;
    addItem(
      {
        productId,
        variantId: variant?.id ?? null,
        slug,
        name: lineName,
        priceBani: unitPrice,
        stockQuantity: stock,
      },
      safeQuantity,
    );
    toast.success(`${lineName} a fost adăugat în coș`);
    setPending(false);
  }

  return (
    <div>
      <p className="mb-2 text-2xl font-medium">{formatRon(unitPrice)}</p>
      {compareAtPriceBani && (!variant || variant.priceBani == null) ? (
        <p className="mb-4 text-sm text-muted line-through">{formatRon(compareAtPriceBani)}</p>
      ) : null}
      {variants.length > 0 ? (
        <fieldset className="mb-4">
          <legend className="mb-2 text-sm text-muted">Variantă</legend>
          <div className="flex flex-wrap gap-2">
            {variants.map((item) => {
              const selected = item.id === variantId;
              const itemPrice = variantUnitPrice(priceBani, item.priceBani);
              return (
                <label
                  key={item.id}
                  className={`cursor-pointer rounded-xl border px-3 py-2 text-sm transition duration-300 ease-out ${
                    selected ? "border-accent bg-accent/10" : "border-border hover:scale-[1.03]"
                  }`}
                >
                  <input
                    type="radio"
                    name="variant"
                    value={item.id}
                    checked={selected}
                    onChange={() => {
                      setVariantId(item.id);
                      setQuantity(1);
                    }}
                    className="sr-only"
                  />
                  <span className="block font-medium">{item.name}</span>
                  <span className="text-xs text-muted">{formatRon(itemPrice)}</span>
                </label>
              );
            })}
          </div>
        </fieldset>
      ) : null}
      <div className="mb-4">
        <StockNotice stockQuantity={stock} />
      </div>
      <div className="mb-4 flex items-center gap-3">
        <span className="text-sm text-muted" id="quantity-label">
          Cantitate
        </span>
        <div className="inline-flex items-center rounded-xl border border-border" role="group" aria-labelledby="quantity-label">
          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-l-xl transition duration-300 ease-out hover:bg-fog/60 active:scale-95"
            aria-label="Scade cantitatea"
            onClick={() => changeQuantity(safeQuantity - 1)}
          >
            <Minus className="h-4 w-4" />
          </button>
          <input
            type="number"
            min={1}
            max={maxQuantity}
            value={safeQuantity}
            aria-label="Cantitate de adăugat în coș"
            onChange={(event) => changeQuantity(Number(event.target.value))}
            className="h-11 w-14 border-x border-border bg-transparent text-center text-sm outline-none"
          />
          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-r-xl transition duration-300 ease-out hover:bg-fog/60 active:scale-95"
            aria-label="Crește cantitatea"
            onClick={() => changeQuantity(safeQuantity + 1)}
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>
      <Button variant="accent" size="lg" disabled={pending} onClick={add}>
        Adaugă în coș
      </Button>
    </div>
  );
}
