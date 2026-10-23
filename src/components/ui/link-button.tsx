import Link from "next/link";
import { cn } from "@/lib/utils";

type Props = {
  href: string;
  children: React.ReactNode;
  className?: string;
  variant?: "primary" | "secondary" | "accent" | "ghost";
};

const styles = {
  primary: "bg-depth text-cream hover:bg-forest border border-transparent shadow-soft",
  secondary: "bg-transparent border border-current/30 hover:bg-cream/10",
  accent: "bg-accent text-cream hover:bg-accent-soft border border-transparent shadow-soft",
  ghost: "bg-transparent hover:bg-fog/40",
};

export function LinkButton({
  href,
  children,
  className,
  variant = "primary",
}: Props) {
  return (
    <Link
      href={href}
      className={cn(
        "group/btn inline-flex h-11 items-center justify-center gap-2 rounded-xl px-5 text-sm font-medium transition duration-500 ease-out hover:-translate-y-0.5 hover:shadow-soft active:translate-y-0",
        styles[variant],
        className,
      )}
    >
      <span>{children}</span>
      <span
        aria-hidden
        className="translate-x-0 opacity-70 transition duration-500 ease-out group-hover/btn:translate-x-1 group-hover/btn:opacity-100"
      >
        →
      </span>
    </Link>
  );
}
