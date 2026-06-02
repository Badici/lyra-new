"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { WHATSAPP_NUMBER } from "@/data/catalog";
import { useCart } from "@/components/cart/CartProvider";

type DeliveryType = "curier" | "personal";

type AddressSuggestion = {
  place_id: number;
  display_name: string;
  address?: {
    county?: string;
    city?: string;
    town?: string;
    village?: string;
    postcode?: string;
    road?: string;
    house_number?: string;
    suburb?: string;
  };
};

export function CartPageClient() {
  const { items, subtotalRon, updateQuantity, removeItem, clearCart } = useCart();
  const [deliveryType, setDeliveryType] = useState<DeliveryType>("curier");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [county, setCounty] = useState("");
  const [city, setCity] = useState("");
  const [streetAddress, setStreetAddress] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [savedAddressHint, setSavedAddressHint] = useState("");
  const [addressSuggestions, setAddressSuggestions] = useState<AddressSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isFetchingAddress, setIsFetchingAddress] = useState(false);
  const [orderFeedback, setOrderFeedback] = useState("");
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);

  const deliveryFee = 0;
  const totalRon = subtotalRon + deliveryFee;

  useEffect(() => {
    const loadDefaultAddress = async () => {
      const response = await fetch("/api/account/addresses");
      if (!response.ok) {
        return;
      }
      const addresses = (await response.json()) as Array<{
        isDefault: boolean;
        fullName: string;
        phone: string;
        email: string;
        county: string;
        city: string;
        street: string;
        postalCode: string;
      }>;
      const defaultAddress =
        addresses.find((entry) => entry.isDefault) ?? addresses[0];
      if (!defaultAddress) {
        return;
      }
      setFullName(defaultAddress.fullName);
      setPhone(defaultAddress.phone);
      setEmail(defaultAddress.email);
      setCounty(defaultAddress.county);
      setCity(defaultAddress.city);
      setStreetAddress(defaultAddress.street);
      setPostalCode(defaultAddress.postalCode);
      setSavedAddressHint("Am precompletat adresa salvată din cont.");
    };

    void loadDefaultAddress();
  }, []);

  useEffect(() => {
    const query = streetAddress.trim();
    if (query.length < 4) {
      setAddressSuggestions([]);
      return;
    }

    const timeoutId = window.setTimeout(async () => {
      try {
        setIsFetchingAddress(true);
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=jsonv2&addressdetails=1&countrycodes=ro&limit=5&q=${encodeURIComponent(
            query
          )}`
        );
        if (!response.ok) {
          setAddressSuggestions([]);
          return;
        }
        const data = (await response.json()) as AddressSuggestion[];
        setAddressSuggestions(data);
      } catch {
        setAddressSuggestions([]);
      } finally {
        setIsFetchingAddress(false);
      }
    }, 350);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [streetAddress]);

  const canSendMessage = Boolean(
    items.length > 0 &&
      fullName.trim() &&
      phone.trim() &&
      email.trim() &&
      county.trim() &&
      city.trim() &&
      streetAddress.trim() &&
      postalCode.trim()
  );

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
        ? "Curier (cost comunicat ulterior în funcție de localitate)"
        : "Ridicare personală în București (0 RON)";

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
      `Nume complet: ${fullName || "-"}`,
      `Telefon: ${phone || "-"}`,
      `Email: ${email || "-"}`,
      `Județ: ${county || "-"}`,
      `Localitate: ${city || "-"}`,
      `Adresă: ${streetAddress || "-"}`,
      `Cod poștal: ${postalCode || "-"}`,
    ].join("\n");

    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  }, [
    items,
    subtotalRon,
    totalRon,
    deliveryType,
    fullName,
    phone,
    email,
    county,
    city,
    streetAddress,
    postalCode,
  ]);

  const placeOrder = async () => {
    if (!canSendMessage) {
      return;
    }

    setOrderFeedback("");
    setIsSubmittingOrder(true);
    const payload = {
      fullName,
      phone,
      email,
      county,
      city,
      street: streetAddress,
      postalCode,
      deliveryMethod:
        deliveryType === "curier"
          ? "COURIER"
          : ("PICKUP" as "COURIER" | "PICKUP"),
      deliveryCostRon: deliveryFee,
      idempotencyKey: crypto.randomUUID(),
      items: items.map((item) => ({
        productSlug: item.productSlug.split("::")[0],
        name: item.name,
        priceValueRon: item.priceValueRon,
        quantity: item.quantity,
      })),
    };

    const response = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    setIsSubmittingOrder(false);
    if (!response.ok) {
      const body = (await response.json()) as { error?: string };
      setOrderFeedback(body.error ?? "Comanda nu a putut fi înregistrată.");
      return;
    }
    const body = (await response.json()) as { number: string };
    clearCart();
    setOrderFeedback(
      `Comanda #${body.number} a fost înregistrată. Ai primit confirmare pe email.`
    );
  };

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl rounded-2xl border border-white/10 bg-[var(--lake)]/50 p-8 text-center">
        <h1 className="text-2xl font-semibold text-[var(--cream)]">Coșul este gol</h1>
        <p className="mt-2 text-[var(--muted)]">
          Adaugă produse din catalog, apoi revino aici pentru finalizarea comenzii.
        </p>
        <Link
          href="/catalog"
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
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.productSlug, Math.max(1, item.quantity - 1))}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/20 bg-[var(--background)] text-[var(--cream)] transition-colors hover:border-[var(--accent)]/60 hover:text-[var(--accent-light)]"
                    aria-label={`Scade cantitatea pentru ${item.name}`}
                  >
                    -
                  </button>
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
                    onClick={() => updateQuantity(item.productSlug, item.quantity + 1)}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/20 bg-[var(--background)] text-[var(--cream)] transition-colors hover:border-[var(--accent)]/60 hover:text-[var(--accent-light)]"
                    aria-label={`Crește cantitatea pentru ${item.name}`}
                  >
                    +
                  </button>
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
          Finalizare comandă
        </h2>
        <p className="text-xs text-[var(--muted)]">
          Ai cont?{" "}
          <Link href="/cont/login" className="text-[var(--accent-light)] hover:underline">
            Intră în cont
          </Link>{" "}
          pentru istoric comenzi. Poți comanda și fără cont.
        </p>
        {savedAddressHint ? (
          <p className="text-xs text-[var(--accent-light)]">{savedAddressHint}</p>
        ) : null}

        <div className="space-y-2 text-sm text-[var(--muted)]">
          <p className="text-[var(--cream)]">Metoda livrare</p>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="deliveryType"
              checked={deliveryType === "curier"}
              onChange={() => setDeliveryType("curier")}
            />
            Curier (costul transportului este comunicat ulterior)
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="deliveryType"
              checked={deliveryType === "personal"}
              onChange={() => setDeliveryType("personal")}
            />
            Ridicare personală în București (0 RON)
          </label>
        </div>

        <div className="space-y-3">
          <label className="block text-sm text-[var(--muted)]">
            Nume complet
            <input
              type="text"
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              className="mt-1 w-full rounded-lg border border-white/15 bg-[var(--background)] px-3 py-2 text-[var(--cream)] outline-none ring-[var(--accent)]/70 focus:ring-2"
              placeholder="Ex: Popescu Andrei"
              required
              autoComplete="name"
            />
          </label>

          <label className="block text-sm text-[var(--muted)]">
            Adresă completă
            <div className="relative mt-1">
              <input
                type="text"
                value={streetAddress}
                onChange={(event) => {
                  setStreetAddress(event.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                className="w-full rounded-lg border border-white/15 bg-[var(--background)] px-3 py-2 text-[var(--cream)] outline-none ring-[var(--accent)]/70 focus:ring-2"
                placeholder="Ex: Str. Exemplu 10, București"
                required
                autoComplete="street-address"
              />
              {showSuggestions && streetAddress.trim().length >= 4 && (
                <div className="absolute z-20 mt-2 max-h-56 w-full overflow-y-auto rounded-lg border border-white/15 bg-[var(--background)] p-1 shadow-lg">
                  {isFetchingAddress ? (
                    <p className="px-3 py-2 text-xs text-[var(--muted)]">
                      Căutăm adrese...
                    </p>
                  ) : addressSuggestions.length > 0 ? (
                    addressSuggestions.map((suggestion) => (
                      <button
                        key={suggestion.place_id}
                        type="button"
                        onClick={() => {
                          setStreetAddress(suggestion.display_name);
                          setCounty(suggestion.address?.county ?? "");
                          setCity(
                            suggestion.address?.city ??
                              suggestion.address?.town ??
                              suggestion.address?.village ??
                              ""
                          );
                          setPostalCode(suggestion.address?.postcode ?? "");
                          setShowSuggestions(false);
                        }}
                        className="w-full rounded-md px-3 py-2 text-left text-xs text-[var(--muted)] transition-colors hover:bg-white/5 hover:text-[var(--cream)]"
                      >
                        {suggestion.display_name}
                      </button>
                    ))
                  ) : (
                    <p className="px-3 py-2 text-xs text-[var(--muted)]">
                      Nu am găsit rezultate. Completează manual.
                    </p>
                  )}
                </div>
              )}
            </div>
          </label>

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block text-sm text-[var(--muted)]">
              Județ
              <input
                type="text"
                value={county}
                onChange={(event) => setCounty(event.target.value)}
                className="mt-1 w-full rounded-lg border border-white/15 bg-[var(--background)] px-3 py-2 text-[var(--cream)] outline-none ring-[var(--accent)]/70 focus:ring-2"
                placeholder="Ex: București"
                required
                autoComplete="address-level1"
              />
            </label>

            <label className="block text-sm text-[var(--muted)]">
              Localitate
              <input
                type="text"
                value={city}
                onChange={(event) => setCity(event.target.value)}
                className="mt-1 w-full rounded-lg border border-white/15 bg-[var(--background)] px-3 py-2 text-[var(--cream)] outline-none ring-[var(--accent)]/70 focus:ring-2"
                placeholder="Ex: București"
                required
                autoComplete="address-level2"
              />
            </label>
          </div>

          <label className="block text-sm text-[var(--muted)]">
            Cod poștal
            <input
              type="text"
              value={postalCode}
              onChange={(event) => setPostalCode(event.target.value)}
              className="mt-1 w-full rounded-lg border border-white/15 bg-[var(--background)] px-3 py-2 text-[var(--cream)] outline-none ring-[var(--accent)]/70 focus:ring-2"
              placeholder="Ex: 010101"
              required
              autoComplete="postal-code"
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
              required
              autoComplete="tel"
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
              required
              autoComplete="email"
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
            <span>
              {deliveryType === "personal" ? "0.00 RON" : "se comunică ulterior"}
            </span>
          </p>
          <p className="mt-2 flex items-center justify-between text-base font-semibold text-[var(--cream)]">
            <span>Total estimat</span>
            <span>
              {deliveryType === "personal"
                ? `${totalRon.toFixed(2)} RON`
                : `${subtotalRon.toFixed(2)} RON + transport`}
            </span>
          </p>
        </div>

        <motion.button
          type="button"
          disabled={!canSendMessage || isSubmittingOrder}
          onClick={placeOrder}
          whileHover={canSendMessage ? { scale: 1.03 } : undefined}
          whileTap={canSendMessage ? { scale: 0.98 } : undefined}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className={`inline-flex w-full items-center justify-center rounded-xl px-5 py-3 font-semibold text-white transition-colors ${
            canSendMessage
              ? "bg-[var(--accent)] hover:bg-[var(--accent-light)]"
              : "cursor-not-allowed bg-[var(--accent)]/40"
          }`}
          aria-disabled={!canSendMessage}
        >
          {isSubmittingOrder ? "Se înregistrează comanda..." : "Plasează comandă"}
        </motion.button>

        <a
          href={canSendMessage ? whatsappLink : "#"}
          target="_blank"
          rel="noopener noreferrer"
          className={`inline-flex w-full items-center justify-center rounded-xl border px-5 py-3 text-sm font-semibold transition-colors ${
            canSendMessage
              ? "border-[#25D366]/60 text-[#25D366] hover:bg-[#25D366]/10"
              : "cursor-not-allowed border-white/20 text-white/40"
          }`}
        >
          Sau trimite pe WhatsApp
        </a>

        {!canSendMessage ? (
          <p className="text-xs text-[var(--muted)]">
            Completează toate datele de livrare, numele, telefonul și emailul pentru
            a genera mesajul complet.
          </p>
        ) : null}
        {orderFeedback ? (
          <p className="text-xs text-[var(--accent-light)]">{orderFeedback}</p>
        ) : null}
      </aside>
    </div>
  );
}
