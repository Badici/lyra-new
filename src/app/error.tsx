"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { LinkButton } from "@/components/ui/link-button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6 py-24 text-center">
      <h1 className="mb-3 font-display text-5xl tracking-wide">Ceva nu a mers bine</h1>
      <p className="mb-8 max-w-md text-muted">
        A apărut o eroare neașteptată. Poți încerca din nou sau reveni la pagina principală.
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        <Button type="button" variant="accent" onClick={reset}>
          Încearcă din nou
        </Button>
        <LinkButton href="/" variant="secondary">
          Acasă
        </LinkButton>
      </div>
    </div>
  );
}
