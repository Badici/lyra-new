import { stockMessageRo } from "@/lib/stock";
import { resolveStockStatus } from "@/lib/stock";
import { cn } from "@/lib/utils";

export function StockNotice({
  stockQuantity,
  compact = false,
}: {
  stockQuantity: number;
  compact?: boolean;
}) {
  const status = resolveStockStatus(stockQuantity);
  const label = compact
    ? status === "IN_STOCK"
      ? "În stoc"
      : status === "LOW_STOCK"
        ? "Stoc aproape epuizat"
        : "La comandă"
    : stockMessageRo(stockQuantity);
  return (
    <p
      role="status"
      className={cn(
        "rounded-xl border leading-relaxed",
        compact ? "mt-2 px-2 py-1 text-xs" : "px-4 py-3 text-sm",
        status === "LOW_STOCK" && "border-sand bg-sand/15 font-medium text-foreground",
        status === "IN_STOCK" && "border-moss/40 bg-moss/10 text-foreground",
        status === "MADE_TO_ORDER" && "border-border bg-fog/40 text-muted",
      )}
    >
      {label}
    </p>
  );
}
