"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export type CartItem = {
  productSlug: string;
  name: string;
  priceLabel: string;
  priceValueRon: number;
  image: string;
  quantity: number;
};

type CartContextValue = {
  items: CartItem[];
  cartCount: number;
  subtotalRon: number;
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  updateQuantity: (productSlug: string, quantity: number) => void;
  removeItem: (productSlug: string) => void;
  clearCart: () => void;
};

const CART_STORAGE_KEY = "lyra-cart-v1";

const CartContext = createContext<CartContextValue | null>(null);

function readStoredCart() {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed as CartItem[];
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(readStoredCart);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addItem = useCallback(
    (item: Omit<CartItem, "quantity">, quantity = 1) => {
      setItems((current) => {
        const existing = current.find(
          (entry) => entry.productSlug === item.productSlug
        );

        if (existing) {
          return current.map((entry) =>
            entry.productSlug === item.productSlug
              ? { ...entry, quantity: entry.quantity + quantity }
              : entry
          );
        }

        return [...current, { ...item, quantity }];
      });
    },
    []
  );

  const updateQuantity = useCallback((productSlug: string, quantity: number) => {
    if (quantity <= 0) {
      setItems((current) =>
        current.filter((entry) => entry.productSlug !== productSlug)
      );
      return;
    }

    setItems((current) =>
      current.map((entry) =>
        entry.productSlug === productSlug ? { ...entry, quantity } : entry
      )
    );
  }, []);

  const removeItem = useCallback((productSlug: string) => {
    setItems((current) =>
      current.filter((entry) => entry.productSlug !== productSlug)
    );
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const value = useMemo<CartContextValue>(() => {
    const cartCount = items.reduce((total, item) => total + item.quantity, 0);
    const subtotalRon = items.reduce(
      (total, item) => total + item.priceValueRon * item.quantity,
      0
    );

    return {
      items,
      cartCount,
      subtotalRon,
      addItem,
      updateQuantity,
      removeItem,
      clearCart,
    };
  }, [items, addItem, updateQuantity, removeItem, clearCart]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used inside CartProvider.");
  }
  return context;
}
