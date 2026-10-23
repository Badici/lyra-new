"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCart } from "@/features/cart/cart-context";
import { submitOrderAction } from "@/features/orders/actions";
import { formatRon } from "@/lib/money";
import { stockMessageRo } from "@/lib/stock";

export function CheckoutForm() {
  const router = useRouter();
  const { items, subtotalBani, clear, hydrated } = useCart();
  const [pending, setPending] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  if (!hydrated) {
    return <p className="text-muted">Se încarcă…</p>;
  }

  if (items.length === 0) {
    return (
      <div>
        <p className="mb-4 text-muted">Coșul este gol.</p>
        <Link href="/produse" className="text-accent underline-offset-4 hover:underline">
          Vezi produse
        </Link>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    setFieldErrors({});

    const form = e.currentTarget;
    const fd = new FormData(form);

    const payload = {
      customerName: String(fd.get("customerName") ?? ""),
      customerEmail: String(fd.get("customerEmail") ?? ""),
      customerPhone: String(fd.get("customerPhone") ?? ""),
      shippingCounty: String(fd.get("shippingCounty") ?? ""),
      shippingCity: String(fd.get("shippingCity") ?? ""),
      shippingPostalCode: String(fd.get("shippingPostalCode") ?? "") || undefined,
      shippingStreetLine: String(fd.get("shippingStreetLine") ?? ""),
      shippingDetails: String(fd.get("shippingDetails") ?? "") || undefined,
      notes: String(fd.get("notes") ?? "") || undefined,
      termsAccepted: fd.get("termsAccepted") === "on",
      items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
    };

    const result = await submitOrderAction(payload);
    setPending(false);

    if (!result.ok) {
      if (result.fieldErrors) setFieldErrors(result.fieldErrors);
      toast.error(result.error);
      return;
    }

    clear();
    toast.success(
      `Comanda ${result.orderNumber} a fost înregistrată. Plata: ramburs la livrare.`,
    );
    router.push(`/?comanda=${encodeURIComponent(result.orderNumber)}`);
  }

  const err = (name: string) => fieldErrors[name]?.[0];

  return (
    <form onSubmit={handleSubmit} className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="space-y-5">
        <fieldset className="space-y-4">
          <legend className="mb-2 font-display text-3xl tracking-wide">Date contact</legend>
          <div>
            <Label htmlFor="customerName">Nume complet</Label>
            <Input id="customerName" name="customerName" autoComplete="name" required />
            {err("customerName") ? (
              <p className="mt-1 text-xs text-red-700">{err("customerName")}</p>
            ) : null}
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="customerEmail">Email</Label>
              <Input
                id="customerEmail"
                name="customerEmail"
                type="email"
                autoComplete="email"
                required
              />
              {err("customerEmail") ? (
                <p className="mt-1 text-xs text-red-700">{err("customerEmail")}</p>
              ) : null}
            </div>
            <div>
              <Label htmlFor="customerPhone">Telefon</Label>
              <Input
                id="customerPhone"
                name="customerPhone"
                type="tel"
                autoComplete="tel"
                required
              />
              {err("customerPhone") ? (
                <p className="mt-1 text-xs text-red-700">{err("customerPhone")}</p>
              ) : null}
            </div>
          </div>
        </fieldset>

        <fieldset className="space-y-4">
          <legend className="mb-2 font-display text-3xl tracking-wide">Adresă livrare</legend>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="shippingCounty">Județ</Label>
              <Input id="shippingCounty" name="shippingCounty" required />
              {err("shippingCounty") ? (
                <p className="mt-1 text-xs text-red-700">{err("shippingCounty")}</p>
              ) : null}
            </div>
            <div>
              <Label htmlFor="shippingCity">Localitate</Label>
              <Input id="shippingCity" name="shippingCity" required />
              {err("shippingCity") ? (
                <p className="mt-1 text-xs text-red-700">{err("shippingCity")}</p>
              ) : null}
            </div>
          </div>
          <div>
            <Label htmlFor="shippingPostalCode">Cod poștal (opțional)</Label>
            <Input id="shippingPostalCode" name="shippingPostalCode" />
          </div>
          <div>
            <Label htmlFor="shippingStreetLine">Stradă, număr</Label>
            <Input id="shippingStreetLine" name="shippingStreetLine" required />
            {err("shippingStreetLine") ? (
              <p className="mt-1 text-xs text-red-700">{err("shippingStreetLine")}</p>
            ) : null}
          </div>
          <div>
            <Label htmlFor="shippingDetails">Detalii livrare (opțional)</Label>
            <Textarea id="shippingDetails" name="shippingDetails" rows={3} />
          </div>
        </fieldset>

        <div>
          <Label htmlFor="notes">Observații comandă (opțional)</Label>
          <Textarea id="notes" name="notes" rows={3} />
        </div>

        <label className="flex items-start gap-3 text-sm leading-relaxed">
          <input
            type="checkbox"
            name="termsAccepted"
            className="mt-1 h-4 w-4 rounded border-border accent-accent"
            required
          />
          <span>
            Accept{" "}
            <Link href="/termeni-si-conditii" className="text-accent underline-offset-4 hover:underline">
              termenii și condițiile
            </Link>{" "}
            și confirm că datele sunt corecte.
          </span>
        </label>
        {err("termsAccepted") ? (
          <p className="text-xs text-red-700">{err("termsAccepted")}</p>
        ) : null}
      </div>

      <aside className="h-fit rounded-2xl border border-border bg-surface p-6">
        <h2 className="mb-4 font-display text-3xl tracking-wide">Comanda ta</h2>
        <ul className="mb-6 space-y-4">
          {items.map((item) => {
            const stockMsg = stockMessageRo(item.stockQuantity);
            return (
              <li key={item.productId} className="border-b border-border pb-4 text-sm">
                <div className="flex justify-between gap-4">
                  <span>
                    {item.name} × {item.quantity}
                  </span>
                  <span>{formatRon(item.priceBani * item.quantity)}</span>
                </div>
                {stockMsg ? (
                  <p className="mt-2 text-xs leading-relaxed text-muted">{stockMsg}</p>
                ) : null}
              </li>
            );
          })}
        </ul>
        <div className="mb-4 flex justify-between text-base font-medium">
          <span>Total (ramburs)</span>
          <span>{formatRon(subtotalBani)}</span>
        </div>
        <p className="mb-6 text-xs leading-relaxed text-muted">
          Plata la livrare (ramburs). Comanda se înregistrează în sistem; un membru Lyra te
          contactează dacă e nevoie de confirmarea termenului de livrare.
        </p>
        <Button type="submit" variant="accent" size="lg" className="w-full" disabled={pending}>
          {pending ? "Se trimite…" : "Plasează comanda"}
        </Button>
      </aside>
    </form>
  );
}
