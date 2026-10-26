"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";

const BusyContext = createContext<{ begin: () => void; end: () => void } | null>(null);

export function AdminSpinnerOverlay() {
  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center bg-black/50"
      role="status"
      aria-live="polite"
    >
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-cream/30 border-t-cream" />
      <span className="sr-only">Se încarcă</span>
    </div>
  );
}

export function AdminBusyProvider({ children }: { children: React.ReactNode }) {
  const [count, setCount] = useState(0);
  const begin = useCallback(() => setCount((value) => value + 1), []);
  const end = useCallback(() => setCount((value) => Math.max(0, value - 1)), []);
  const value = useMemo(() => ({ begin, end }), [begin, end]);

  return (
    <BusyContext.Provider value={value}>
      {children}
      {count > 0 ? <AdminSpinnerOverlay /> : null}
    </BusyContext.Provider>
  );
}

export function useAdminBusy() {
  return useContext(BusyContext) ?? { begin: () => undefined, end: () => undefined };
}
