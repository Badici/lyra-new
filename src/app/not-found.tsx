import Link from "next/link";
import { LinkButton } from "@/components/ui/link-button";

export default function NotFound() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6 py-24 text-center">
      <p className="font-hand mb-2 text-3xl text-accent">404</p>
      <h1 className="mb-3 font-display text-5xl tracking-wide">Pagina nu există</h1>
      <p className="mb-8 max-w-md text-muted">
        Link-ul poate fi vechi sau pagina nu a fost publicată încă.
      </p>
      <LinkButton href="/">Înapoi acasă</LinkButton>
      <Link href="/contact" className="mt-4 text-sm text-muted underline-offset-4 hover:underline">
        Contact
      </Link>
    </div>
  );
}
