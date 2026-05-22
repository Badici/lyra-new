"use client";

import { useEffect, useState } from "react";
import {
  calculateConfiguredPriceRon,
  formatRon,
  type ProductPricingConfig,
} from "@/data/catalog";
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
  pricingConfig?: ProductPricingConfig;
};

export function AddToCartButton({ product }: { product: AddToCartPayload }) {
  const [quantity, setQuantity] = useState(1);
  const [feedback, setFeedback] = useState("");
  const [selectedVariant, setSelectedVariant] = useState("");
  const [selectedConfig, setSelectedConfig] = useState<Record<string, string>>({});
  const { addItem } = useCart();
  const variantRequired = Boolean(product.variantSelector);
  const hasPricingConfig = Boolean(product.pricingConfig);

  const calculatedPrice = hasPricingConfig
    ? calculateConfiguredPriceRon(
        {
          slug: product.productSlug,
          categorySlug: "monturi-forface",
          name: product.name,
          shortDescription: "",
          description: "",
          priceLabel: "",
          priceValueRon: 0,
          images: [product.image],
          specs: [],
          pricingConfig: product.pricingConfig,
        },
        selectedConfig
      )
    : null;

  const canAdd = hasPricingConfig
    ? typeof calculatedPrice === "number"
    : !variantRequired || Boolean(selectedVariant);

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

  const getMissingConfigMessage = () => {
    if (!product.pricingConfig) {
      return "";
    }

    for (const option of product.pricingConfig.options) {
      const selectedValue = selectedConfig[option.id];
      if (!selectedValue) {
        if (option.label === "Momeală la cârlig") {
          return "Selectează tipul de momeală de cârlig.";
        }
        return `Selectează ${option.label.toLowerCase()}.`;
      }
    }

    if (calculatedPrice === null) {
      return "Configurația aleasă nu este validă. Verifică opțiunile selectate.";
    }

    return "";
  };

  return (
    <div className="space-y-3">
      {product.pricingConfig
        ? product.pricingConfig.options.map((option) => {
            const availableChoices = option.choices.filter((choice) => {
              if (!choice.requires) {
                return true;
              }
              const requiredValue = selectedConfig[choice.requires.optionId];
              return choice.requires.values.includes(requiredValue ?? "");
            });

            return (
              <div key={option.id} className="space-y-2">
                <label
                  htmlFor={`config-${option.id}`}
                  className="text-sm font-medium text-[var(--cream)]"
                >
                  {option.label}
                </label>
                <select
                  id={`config-${option.id}`}
                  value={selectedConfig[option.id] ?? ""}
                  onChange={(event) =>
                    setSelectedConfig((current) => ({
                      ...current,
                      [option.id]: event.target.value,
                    }))
                  }
                  className="w-full rounded-lg border border-white/15 bg-[var(--background)] px-3 py-2 text-[var(--cream)] outline-none ring-[var(--accent)]/70 focus:ring-2"
                >
                  <option value="">{option.placeholder}</option>
                  {availableChoices.map((choice) => (
                    <option key={choice.value} value={choice.value}>
                      {choice.label}
                    </option>
                  ))}
                </select>
              </div>
            );
          })
        : null}

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

      {hasPricingConfig && typeof calculatedPrice === "number" ? (
        <p className="text-sm font-semibold text-[var(--accent-light)]">
          Preț final: {formatRon(calculatedPrice)} RON
          {product.pricingConfig?.setSize
            ? ` / set (${product.pricingConfig.setSize} buc)`
            : ""}
        </p>
      ) : null}

      <button
        type="button"
        disabled={!canAdd}
        onClick={() => {
          if (product.pricingConfig && typeof calculatedPrice === "number") {
            const configSummary = product.pricingConfig.options
              .map((option) => {
                const selectedValue = selectedConfig[option.id];
                const selectedChoice = option.choices.find(
                  (choice) => choice.value === selectedValue
                );
                if (!selectedChoice) {
                  return null;
                }
                return `${option.label}: ${selectedChoice.label}`;
              })
              .filter(Boolean)
              .join(", ");

            const configuredName = `${product.name} (${configSummary})`;
            const configuredSlug = `${product.productSlug}::${product.pricingConfig.options
              .map((option) => `${option.id}=${selectedConfig[option.id] ?? ""}`)
              .join("|")}`;

            addItem(
              {
                ...product,
                name: configuredName,
                productSlug: configuredSlug,
                priceValueRon: calculatedPrice,
                priceLabel: `${formatRon(calculatedPrice)} RON`,
              },
              quantity
            );
            setFeedback("Produs adăugat în coș.");
            return;
          }

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

      {hasPricingConfig && !canAdd ? (
        <p className="text-sm text-[var(--muted)]">{getMissingConfigMessage()}</p>
      ) : null}

      {feedback ? (
        <p className="text-sm text-green-400">{feedback}</p>
      ) : null}
    </div>
  );
}
