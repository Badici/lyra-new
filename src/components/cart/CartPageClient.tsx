"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { formatRon } from "@/data/catalog";
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
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [county, setCounty] = useState("");
  const [city, setCity] = useState("");
  const [street, setStreet] = useState("");
  const [streetNumber, setStreetNumber] = useState("");
  const [addressDetails, setAddressDetails] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [addressSuggestions, setAddressSuggestions] = useState<AddressSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isFetchingAddress, setIsFetchingAddress] = useState(false);

  useEffect(() => {
    if (deliveryType !== "curier") {
      return;
    }

    const query = street.trim();
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
  }, [street, deliveryType]);

  const canPlaceOrder =
    deliveryType === "personal"
      ? items.length > 0 && firstName.trim() && phone.trim()
      : items.length > 0 &&
        firstName.trim() &&
        lastName.trim() &&
        phone.trim() &&
        email.trim() &&
        county.trim() &&
        city.trim() &&
        street.trim() &&
        streetNumber.trim();

  const deliveryLabel = useMemo(
    () =>
      deliveryType === "curier"
        ? "Curier (preț comunicat ulterior)"
        : "Ridicare personală (Șos. Chitilei sau Politehnica București) - gratuit",
    [deliveryType]
  );

  const buildOrderMessage = () => {
    const lines = items.map(
      (item, index) =>
        `${index + 1}. ${item.name} x${item.quantity} - ${formatRon(
          item.priceValueRon * item.quantity
        )} RON`
    );

    const deliveryDetails =
      deliveryType === "curier"
        ? [
            "Livrare: Curier (preț transport comunicat ulterior)",
            `Prenume: ${firstName}`,
            `Nume: ${lastName}`,
            `Telefon: ${phone}`,
            `Email: ${email}`,
            `Județ: ${county}`,
            `Oraș: ${city}`,
            `Stradă: ${street}`,
            `Număr: ${streetNumber}`,
            `Detalii adresă: ${addressDetails || "-"}`,
          ]
        : [
            "Livrare: Ridicare personală (gratuit)",
            "Punct ridicare: Șos. Chitilei sau Politehnica București",
            `Nume și prenume: ${firstName}`,
            `Telefon: ${phone}`,
          ];

    return [
      "[TAG-LYRABAITS-COMANDA]",
      "",
      "Comandă nouă din website-ul Lyra Baits.",
      "",
      "Produse:",
      ...lines,
      "",
      `Subtotal produse: ${formatRon(subtotalRon)} RON`,
      "",
      "Date livrare și contact:",
      ...deliveryDetails,
    ].join("\n");
  };

  if (orderPlaced) {
    return (
      <div className="mx-auto max-w-3xl rounded-2xl border border-white/10 bg-[var(--lake)]/50 p-8 text-center">
        <h1 className="text-3xl font-semibold text-[var(--cream)]">Mulțumim pentru comandă!</h1>
        <p className="mt-3 text-[var(--muted)]">
          Comanda a fost trimisă cu succes. Revenim rapid pe telefon sau email pentru
          confirmare și detaliile de livrare.
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/catalog"
            className="inline-flex rounded-xl bg-[var(--accent)] px-5 py-3 font-semibold text-white transition-colors hover:bg-[var(--accent-light)]"
          >
            Continuă cumpărăturile
          </Link>
          <Link
            href="/contact"
            className="inline-flex rounded-xl border border-white/20 px-5 py-3 font-semibold text-[var(--cream)] transition-colors hover:bg-white/5"
          >
            Date de contact
          </Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl rounded-2xl border border-white/10 bg-[var(--lake)]/50 p-8 text-center">
        <h1 className="text-2xl font-semibold text-[var(--cream)]">Coșul este gol</h1>
          <p className="mt-2 text-[var(--muted)]">
            Adaugă produse din catalog, apoi revino aici pentru finalizarea comenzii prin
            email.
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

        <div className="space-y-2 text-sm text-[var(--muted)]">
          <p className="text-[var(--cream)]">Metodă livrare</p>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="deliveryType"
              checked={deliveryType === "curier"}
              onChange={() => setDeliveryType("curier")}
            />
            Curier (preț transport comunicat ulterior)
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="deliveryType"
              checked={deliveryType === "personal"}
              onChange={() => setDeliveryType("personal")}
            />
            Ridicare personală (Șos. Chitilei sau Politehnica București) - gratuit
          </label>
        </div>
        <p className="rounded-xl border border-white/10 bg-black/10 px-3 py-2 text-xs text-[var(--muted)]">
          Prețul transportului va fi comunicat în funcție de distanță și greutatea coletului.
        </p>

        <div className="space-y-3">
          <label className="block text-sm text-[var(--muted)]">
            {deliveryType === "curier" ? "Prenume" : "Nume și prenume"}
            <input
              type="text"
              value={firstName}
              onChange={(event) => setFirstName(event.target.value)}
              className="mt-1 w-full rounded-lg border border-white/15 bg-[var(--background)] px-3 py-2 text-[var(--cream)] outline-none ring-[var(--accent)]/70 focus:ring-2"
              placeholder={deliveryType === "curier" ? "Ex: Andrei" : "Ex: Andrei Popescu"}
              required
              autoComplete="given-name"
            />
          </label>

          {deliveryType === "curier" ? (
            <>
              <label className="block text-sm text-[var(--muted)]">
                Nume
                <input
                  type="text"
                  value={lastName}
                  onChange={(event) => setLastName(event.target.value)}
                  className="mt-1 w-full rounded-lg border border-white/15 bg-[var(--background)] px-3 py-2 text-[var(--cream)] outline-none ring-[var(--accent)]/70 focus:ring-2"
                  placeholder="Ex: Popescu"
                  required
                  autoComplete="family-name"
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

              <label className="block text-sm text-[var(--muted)]">
                Adresă (stradă)
                <div className="relative mt-1">
                  <input
                    type="text"
                    value={street}
                    onChange={(event) => {
                      setStreet(event.target.value);
                      setShowSuggestions(true);
                    }}
                    onFocus={() => setShowSuggestions(true)}
                    className="w-full rounded-lg border border-white/15 bg-[var(--background)] px-3 py-2 text-[var(--cream)] outline-none ring-[var(--accent)]/70 focus:ring-2"
                    placeholder="Ex: Strada Lalelelor"
                    required
                    autoComplete="street-address"
                  />
                  {showSuggestions && street.trim().length >= 4 && (
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
                              setStreet(suggestion.address?.road ?? suggestion.display_name);
                              setCounty(suggestion.address?.county ?? "");
                              setCity(
                                suggestion.address?.city ??
                                  suggestion.address?.town ??
                                  suggestion.address?.village ??
                                  ""
                              );
                              setStreetNumber(suggestion.address?.house_number ?? "");
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
                  Oraș
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

              <div className="grid gap-3 sm:grid-cols-2">
                <label className="block text-sm text-[var(--muted)]">
                  Număr
                  <input
                    type="text"
                    value={streetNumber}
                    onChange={(event) => setStreetNumber(event.target.value)}
                    className="mt-1 w-full rounded-lg border border-white/15 bg-[var(--background)] px-3 py-2 text-[var(--cream)] outline-none ring-[var(--accent)]/70 focus:ring-2"
                    placeholder="Ex: 12A"
                    required
                    autoComplete="address-line2"
                  />
                </label>

                <label className="block text-sm text-[var(--muted)]">
                  Detalii adresă (opțional)
                  <input
                    type="text"
                    value={addressDetails}
                    onChange={(event) => setAddressDetails(event.target.value)}
                    className="mt-1 w-full rounded-lg border border-white/15 bg-[var(--background)] px-3 py-2 text-[var(--cream)] outline-none ring-[var(--accent)]/70 focus:ring-2"
                    placeholder="Ex: scara B, etaj 3, ap. 14"
                    autoComplete="off"
                  />
                </label>
              </div>
            </>
          ) : null}

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
        </div>

        <div className="space-y-1 rounded-xl border border-white/10 bg-black/10 p-4 text-sm">
          <p className="flex items-center justify-between text-[var(--muted)]">
            <span>Subtotal produse</span>
            <span>{formatRon(subtotalRon)} RON</span>
          </p>
          <p className="flex items-center justify-between text-[var(--muted)]">
            <span>Metodă livrare</span>
            <span className="text-right">{deliveryLabel}</span>
          </p>
          <p className="mt-2 flex items-center justify-between text-base font-semibold text-[var(--cream)]">
            <span>Total produse</span>
            <span>{formatRon(subtotalRon)} RON</span>
          </p>
        </div>

        <motion.button
          type="button"
          onClick={async () => {
            if (!canPlaceOrder || isSubmitting) {
              return;
            }

            setIsSubmitting(true);
            setStatusMessage("");

            const response = await fetch("https://formsubmit.co/ajax/raresbadici@gmail.com", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
              },
              body: JSON.stringify({
                _subject: "[LYRABAITS-COMANDA] Comandă nouă din website",
                _captcha: "false",
                _template: "table",
                message: buildOrderMessage(),
                email: deliveryType === "curier" ? email : "comanda@lyrabaits.ro",
              }),
            });

            if (!response.ok) {
              setStatusMessage(
                "Nu am putut trimite comanda pe email. Te rugăm încearcă din nou."
              );
              setIsSubmitting(false);
              return;
            }

            setStatusMessage(
              "Comanda a fost trimisă pe email. Revenim rapid cu confirmarea și detaliile de livrare."
            );
            clearCart();
            setOrderPlaced(true);
            setIsSubmitting(false);
          }}
          whileHover={canPlaceOrder && !isSubmitting ? { scale: 1.03 } : undefined}
          whileTap={canPlaceOrder && !isSubmitting ? { scale: 0.98 } : undefined}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className={`inline-flex w-full items-center justify-center rounded-xl px-5 py-3 font-semibold text-white transition-colors ${
            canPlaceOrder && !isSubmitting
              ? "bg-[var(--accent)] hover:bg-[var(--accent-light)]"
              : "cursor-not-allowed bg-[var(--accent)]/40"
          }`}
          disabled={!canPlaceOrder || isSubmitting}
        >
          {isSubmitting ? "Se trimite comanda..." : "Finalizează comanda"}
        </motion.button>

        {!canPlaceOrder ? (
          <p className="text-xs text-[var(--muted)]">
            Completează toate câmpurile obligatorii pentru metoda de livrare aleasă.
          </p>
        ) : null}
        {statusMessage ? (
          <p className="text-xs text-[var(--muted)]">{statusMessage}</p>
        ) : null}
      </aside>
    </div>
  );
}
