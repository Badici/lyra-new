"use client";

import { useFormStatus } from "react-dom";
import { cn } from "@/lib/utils";

type SubmitButtonProps = {
  label: string;
  pendingLabel?: string;
  variant?: "primary" | "accent" | "danger";
  className?: string;
  disabled?: boolean;
};

export function SubmitButton({
  label,
  pendingLabel = "Se salvează…",
  variant = "primary",
  className,
  disabled = false,
}: SubmitButtonProps) {
  const { pending } = useFormStatus();
  const locked = pending || disabled;

  const variants = {
    primary: "bg-forest text-cream hover:bg-moss border border-moss/30",
    accent: "bg-accent text-cream hover:bg-accent-soft border border-transparent",
    danger: "bg-red-900/60 text-red-100 hover:bg-red-900 border border-red-800/40",
  };

  return (
    <button
      type="submit"
      disabled={locked}
      aria-busy={pending}
      className={cn(
        "inline-flex h-11 items-center justify-center rounded-xl px-5 text-sm font-medium transition duration-300 ease-out hover:scale-[1.03] hover:shadow-md active:scale-[0.97] active:brightness-90 disabled:pointer-events-none disabled:opacity-60",
        variants[variant],
        className,
      )}
    >
      {pending ? pendingLabel : label}
    </button>
  );
}
