import Link from "next/link";
import { ChevronLeft } from "lucide-react";

type PageHeaderProps = {
  title: string;
  description?: string;
  backHref?: string;
  actions?: React.ReactNode;
};

export function PageHeader({ title, description, backHref, actions }: PageHeaderProps) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div>
        {backHref && (
          <Link
            href={backHref}
            className="mb-2 inline-flex items-center gap-1 text-sm text-muted hover:text-accent"
          >
            <ChevronLeft className="h-4 w-4" />
            Înapoi
          </Link>
        )}
        <h1 className="font-display text-3xl tracking-wide text-cream md:text-4xl">{title}</h1>
        {description && <p className="mt-1 max-w-2xl text-sm text-muted">{description}</p>}
      </div>
      {actions && <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}
