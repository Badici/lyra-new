"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useSyncExternalStore,
} from "react";

export type CartItem = {
  lineId: string;
  productId: string;
  variantId?: string | null;
  slug: string;
  name: string;
  priceBani: number;
  quantity: number;
  stockQuantity: number;
};

type CartContextValue = {
  items: CartItem[];
  itemCount: number;
  subtotalBani: number;
  addItem: (item: Omit<CartItem, "quantity" | "lineId">, quantity?: number) => void;
  removeItem: (lineId: string) => void;
  setQuantity: (lineId: string, quantity: number) => void;
  clear: () => void;
  hydrated: boolean;
};

const STORAGE_KEY = "lyra.cart.v1";
const EMPTY_CART: CartItem[] = [];

const CartContext = createContext<CartContextValue | null>(null);

let memoryCart: CartItem[] = [];
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}

function readStorage(): CartItem[] {
  if (typeof window === "undefined") return memoryCart;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as CartItem[];
    if (!Array.isArray(parsed)) return [];
    return parsed.map((item) => ({
      ...item,
      variantId: item.variantId ?? null,
      lineId: item.lineId || (item.variantId ? `${item.productId}:${item.variantId}` : item.productId),
    }));
  } catch {
    return [];
  }
}

function writeStorage(items: CartItem[]) {
  memoryCart = items;
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }
  emit();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return memoryCart;
}

function getServerSnapshot(): CartItem[] {
  return EMPTY_CART;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const items = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  useEffect(() => {
    memoryCart = readStorage();
    emit();
  }, []);

  const addItem = useCallback((item: Omit<CartItem, "quantity" | "lineId">, quantity = 1) => {
    const lineId = item.variantId ? `${item.productId}:${item.variantId}` : item.productId;
    const cap = item.stockQuantity > 0 ? item.stockQuantity : 99;
    const prev = memoryCart;
    const existing = prev.find((entry) => entry.lineId === lineId);
    const nextQuantity = Math.min((existing?.quantity ?? 0) + quantity, cap);
    const next = existing
      ? prev.map((entry) =>
          entry.lineId === lineId
            ? { ...entry, ...item, lineId, quantity: nextQuantity }
            : entry,
        )
      : [...prev, { ...item, lineId, quantity: Math.min(quantity, cap) }];
    writeStorage(next);
  }, []);

  const removeItem = useCallback((lineId: string) => {
    writeStorage(memoryCart.filter((entry) => entry.lineId !== lineId));
  }, []);

  const setQuantity = useCallback((lineId: string, quantity: number) => {
    writeStorage(
      memoryCart
        .map((entry) => {
          if (entry.lineId !== lineId) return entry;
          const cap = entry.stockQuantity > 0 ? entry.stockQuantity : 99;
          return { ...entry, quantity: Math.min(quantity, cap) };
        })
        .filter((entry) => entry.quantity > 0),
    );
  }, []);

  const clear = useCallback(() => writeStorage([]), []);

  const value = useMemo<CartContextValue>(() => {
    const itemCount = items.reduce((acc, i) => acc + i.quantity, 0);
    const subtotalBani = items.reduce((acc, i) => acc + i.priceBani * i.quantity, 0);
    return {
      items,
      itemCount,
      subtotalBani,
      addItem,
      removeItem,
      setQuantity,
      clear,
      hydrated: typeof window !== "undefined",
    };
  }, [items, addItem, removeItem, setQuantity, clear]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
