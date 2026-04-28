"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { DELIVERY_FEE_RON, WHATSAPP_NUMBER } from "@/data/catalog";
import { useCart } from "@/components/cart/CartProvider";

type DeliveryType = "curier" | "personal";

export function CartPageClient() {
  const { items, subtotalRon, updateQuantity, removeItem, clearCart } = useCart();
  const [deliveryType, setDeliveryType] = useState<DeliveryType>("curier");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  const deliveryFee = deliveryType === "curier" ? DELIVERY_FEE_RON : 0;
  const totalRon = subtotalRon + deliveryFee;

  const canSendMessage =
    items.length > 0 && address.trim() && phone.trim() && email.trim();

  const whatsappLink = useMemo(() => {
    const itemLines = items
      .map(
        (item, index) =>
          `${index + 1}. ${item.name} x${item.quantity} - ${(
            item.priceValueRon * item.quantity
          ).toFixed(2)} RON`
      )
      .join("\n");

    const deliveryLabel =
      deliveryType === "curier"
        ? `Curier (+${DELIVERY_FEE_RON} RON)`
        : "Livrare personală în București (0 RON)";

    const message = [
      "Salut! Vreau să plasez următoarea comandă:",
      "",
      itemLines,
      "",
      `Subtotal produse: ${subtotalRon.toFixed(2)} RON`,
      `Livrare: ${deliveryLabel}`,
      `Total estimat: ${totalRon.toFixed(2)} RON`,
      "",
      "Date client:",
      `Adresă: ${address || "-"}`,
      `Telefon: ${phone || "-"}`,
      `Email: ${email || "-"}`,
    ].join("\n");

    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  }, [items, subtotalRon, totalRon, deliveryType, address, phone, email]);

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl rounded-2xl border border-white/10 bg-[var(--lake)]/50 p-8 text-center">
        <h1 className="text-2xl font-semibold text-[var(--cream)]">Coșul este gol</h1>
        <p className="mt-2 text-[var(--muted)]">
          Adaugă produse din categorii, apoi revino aici pentru finalizarea comenzii.
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex rounded-xl bg-[var(--accent)] px-5 py-3 font-semibold text-white transition-colors hover:bg-[var(--accent-light)]"
        >
          Vezi produsele
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
      <section className="rounded-2xl border border-white/10 bg-[var(--lake)]/40 p-5 md:p-6">
        <h2 className="text-xl font-semibold text-[var(--cream)]">Produse în coș</h2>
        <ul className="mt-5 space-y-4">
          {items.map((item) => (
            <li
              key={item.productSlug}
              className="rounded-xl border border-white/10 bg-black/10 p-4"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-semibold text-[var(--cream)]">{item.name}</p>
                  <p className="text-sm text-[var(--muted)]">{item.priceLabel}</p>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={1}
                    value={item.quantity}
                    onChange={(event) =>
                      updateQuantity(item.productSlug, Math.max(1, Number(event.target.value) || 1))
                    }
                    className="w-20 rounded-lg border border-white/15 bg-[var(--background)] px-2 py-1.5 text-[var(--cream)] outline-none ring-[var(--accent)]/70 focus:ring-2"
                  />
                  <button
                    type="button"
                    onClick={() => removeItem(item.productSlug)}
                    className="rounded-lg border border-red-500/50 px-3 py-1.5 text-sm text-red-300 transition-colors hover:bg-red-500/10"
                  >
                    Șterge
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <button
          type="button"
          onClick={clearCart}
          className="mt-5 text-sm text-[var(--muted)] underline underline-offset-4 transition-colors hover:text-[var(--cream)]"
        >
          Golește coșul
        </button>
      </section>

      <aside className="space-y-5 rounded-2xl border border-white/10 bg-[var(--lake)] p-5 md:p-6">
        <h2 className="text-xl font-semibold text-[var(--cream)]">
          Finalizare comandă (mock)
        </h2>

        <div className="space-y-2 text-sm text-[var(--muted)]">
          <p className="text-[var(--cream)]">Metoda livrare</p>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="deliveryType"
              checked={deliveryType === "curier"}
              onChange={() => setDeliveryType("curier")}
            />
            Curier (+{DELIVERY_FEE_RON} RON)
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="deliveryType"
              checked={deliveryType === "personal"}
              onChange={() => setDeliveryType("personal")}
            />
            Livrare personală în București (0 RON)
          </label>
        </div>

        <div className="space-y-3">
          <label className="block text-sm text-[var(--muted)]">
            Adresă completă
            <input
              type="text"
              value={address}
              onChange={(event) => setAddress(event.target.value)}
              className="mt-1 w-full rounded-lg border border-white/15 bg-[var(--background)] px-3 py-2 text-[var(--cream)] outline-none ring-[var(--accent)]/70 focus:ring-2"
              placeholder="Ex: Str. Exemplu 10, București"
            />
          </label>

          <label className="block text-sm text-[var(--muted)]">
            Telefon
            <input
              type="tel"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              className="mt-1 w-full rounded-lg border border-white/15 bg-[var(--background)] px-3 py-2 text-[var(--cream)] outline-none ring-[var(--accent)]/70 focus:ring-2"
              placeholder="07xxxxxxxx"
            />
          </label>

          <label className="block text-sm text-[var(--muted)]">
            Email
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="mt-1 w-full rounded-lg border border-white/15 bg-[var(--background)] px-3 py-2 text-[var(--cream)] outline-none ring-[var(--accent)]/70 focus:ring-2"
              placeholder="email@domeniu.ro"
            />
          </label>
        </div>

        <div className="space-y-1 rounded-xl border border-white/10 bg-black/10 p-4 text-sm">
          <p className="flex items-center justify-between text-[var(--muted)]">
            <span>Subtotal produse</span>
            <span>{subtotalRon.toFixed(2)} RON</span>
          </p>
          <p className="flex items-center justify-between text-[var(--muted)]">
            <span>Livrare</span>
            <span>{deliveryFee.toFixed(2)} RON</span>
          </p>
          <p className="mt-2 flex items-center justify-between text-base font-semibold text-[var(--cream)]">
            <span>Total estimat</span>
            <span>{totalRon.toFixed(2)} RON</span>
          </p>
        </div>

        <a
          href={canSendMessage ? whatsappLink : "#"}
          target="_blank"
          rel="noopener noreferrer"
          className={`inline-flex w-full items-center justify-center rounded-xl px-5 py-3 font-semibold text-white transition-colors ${
            canSendMessage
              ? "bg-[#25D366] hover:bg-[#20bd5a]"
              : "cursor-not-allowed bg-[#25D366]/40"
          }`}
          aria-disabled={!canSendMessage}
        >
          Trimite comandă pe WhatsApp
        </a>

        {!canSendMessage ? (
          <p className="text-xs text-[var(--muted)]">
            Completează informațiile de livrare, telefonul și emailul pentru a genera
            mesajul complet.
          </p>
        ) : null}
      </aside>
    </div>
  );
}
