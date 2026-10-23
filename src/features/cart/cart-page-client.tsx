"use client";

import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";
import { LinkButton } from "@/components/ui/link-button";
import { PlaceholderMedia } from "@/components/ui/placeholder-media";
import { useCart } from "@/features/cart/cart-context";
import { formatRon } from "@/lib/money";
import { stockMessageRo } from "@/lib/stock";

export function CartPageClient() {
  const { items, subtotalBani, setQuantity, removeItem, hydrated } = useCart();

  if (!hydrated) {
    return (
      <div className="container-lyra section-lyra">
        <p className="text-muted">Se încarcă coșul…</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container-lyra section-lyra">
        <h1 className="mb-3 font-display text-5xl tracking-wide">Coșul tău</h1>
        <p className="mb-8 max-w-lg text-muted">Coșul este gol. Explorează produsele LyraBaits.</p>
        <LinkButton href="/produse">Vezi produse</LinkButton>
      </div>
    );
  }

  return (
    <div className="container-lyra section-lyra">
      <h1 className="mb-8 font-display text-5xl tracking-wide">Coșul tău</h1>

      <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
        <ul className="space-y-6">
          {items.map((item) => {
            const stockMsg = stockMessageRo(item.stockQuantity);
            return (
              <li
                key={item.productId}
                className="grid gap-4 border-b border-border pb-6 sm:grid-cols-[7rem_1fr_auto]"
              >
                <PlaceholderMedia seed={`product-${item.slug}`} ratio="square" className="w-28" />
                <div>
                  <Link
                    href={`/produse/${item.slug}`}
                    className="font-display text-2xl tracking-wide hover:text-accent"
                  >
                    {item.name}
                  </Link>
                  <p className="mt-1 text-sm text-muted">{formatRon(item.priceBani)} / buc.</p>
                  {stockMsg ? (
                    <p className="mt-2 text-xs leading-relaxed text-muted">{stockMsg}</p>
                  ) : null}
                  <div className="mt-4 flex items-center gap-2">
                    <button
                      type="button"
                      className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border hover:bg-fog/60"
                      aria-label="Scade cantitatea"
                      onClick={() => setQuantity(item.productId, item.quantity - 1)}
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="min-w-8 text-center text-sm">{item.quantity}</span>
                    <button
                      type="button"
                      className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border hover:bg-fog/60"
                      aria-label="Crește cantitatea"
                      onClick={() => setQuantity(item.productId, item.quantity + 1)}
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      className="ml-2 inline-flex h-9 items-center gap-1 rounded-lg px-2 text-sm text-muted hover:bg-fog/60"
                      onClick={() => removeItem(item.productId)}
                    >
                      <Trash2 className="h-4 w-4" />
                      Elimină
                    </button>
                  </div>
                </div>
                <p className="text-right font-medium">
                  {formatRon(item.priceBani * item.quantity)}
                </p>
              </li>
            );
          })}
        </ul>

        <aside className="h-fit rounded-2xl border border-border bg-surface p-6">
          <h2 className="mb-4 font-display text-3xl tracking-wide">Sumar</h2>
          <div className="mb-6 flex items-center justify-between text-sm">
            <span className="text-muted">Subtotal</span>
            <span className="text-lg font-medium">{formatRon(subtotalBani)}</span>
          </div>
          <p className="mb-6 text-xs leading-relaxed text-muted">
            Plata se face ramburs la livrare. Prețurile sunt confirmate server-side la finalizare.
          </p>
          <LinkButton href="/checkout" variant="accent" className="w-full">
            Continuă spre checkout
          </LinkButton>
          <LinkButton href="/produse" variant="ghost" className="mt-3 w-full">
            Continuă cumpărăturile
          </LinkButton>
        </aside>
      </div>
    </div>
  );
}
