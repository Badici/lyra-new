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
  productId: string;
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
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeItem: (productId: string) => void;
  setQuantity: (productId: string, quantity: number) => void;
  clear: () => void;
  hydrated: boolean;
};

const STORAGE_KEY = "lyra.cart.v1";

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
    return Array.isArray(parsed) ? parsed : [];
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
  return [];
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const items = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  useEffect(() => {
    memoryCart = readStorage();
    emit();
  }, []);

  const addItem = useCallback((item: Omit<CartItem, "quantity">, quantity = 1) => {
    const prev = memoryCart;
    const existing = prev.find((p) => p.productId === item.productId);
    const next = existing
      ? prev.map((p) =>
          p.productId === item.productId
            ? { ...p, ...item, quantity: p.quantity + quantity }
            : p,
        )
      : [...prev, { ...item, quantity }];
    writeStorage(next);
  }, []);

  const removeItem = useCallback((productId: string) => {
    writeStorage(memoryCart.filter((p) => p.productId !== productId));
  }, []);

  const setQuantity = useCallback((productId: string, quantity: number) => {
    writeStorage(
      memoryCart
        .map((p) => (p.productId === productId ? { ...p, quantity } : p))
        .filter((p) => p.quantity > 0),
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
