import {
  ORDER_STATUS_LABELS,
  type OrderStatus,
  type ArticleStatus,
  type ContentStatus,
  type StockStatus,
} from "@/lib/constants";
import { cn } from "@/lib/utils";

const orderColors: Record<OrderStatus, string> = {
  NEW: "bg-sand/20 text-sand",
  CONFIRMED: "bg-accent/20 text-accent",
  WAITING_STOCK: "bg-olive/25 text-sand",
  PROCESSING: "bg-moss/30 text-cream",
  SHIPPED: "bg-forest/80 text-cream border border-moss/40",
  DELIVERED: "bg-moss/40 text-cream",
  CANCELLED: "bg-red-900/30 text-red-200",
};

const articleLabels: Record<ArticleStatus, string> = {
  DRAFT: "Draft",
  PUBLISHED: "Publicat",
  ARCHIVED: "Arhivat",
};

const contentLabels: Record<ContentStatus, string> = {
  DRAFT: "Draft",
  PUBLISHED: "Publicat",
  ARCHIVED: "Arhivat",
};

const stockLabels: Record<StockStatus, string> = {
  IN_STOCK: "În stoc",
  LOW_STOCK: "Stoc redus",
  MADE_TO_ORDER: "La comandă",
};

type BadgeProps = { className?: string };

export function OrderStatusBadge({ status, className }: { status: OrderStatus } & BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex rounded-lg px-2.5 py-1 text-xs font-medium",
        orderColors[status],
        className,
      )}
    >
      {ORDER_STATUS_LABELS[status]}
    </span>
  );
}

export function ArticleStatusBadge({ status, className }: { status: ArticleStatus } & BadgeProps) {
  const colors: Record<ArticleStatus, string> = {
    DRAFT: "bg-olive/25 text-sand",
    PUBLISHED: "bg-accent/20 text-accent",
    ARCHIVED: "bg-muted/20 text-muted",
  };
  return (
    <span className={cn("inline-flex rounded-lg px-2.5 py-1 text-xs font-medium", colors[status], className)}>
      {articleLabels[status]}
    </span>
  );
}

export function ContentStatusBadge({ status, className }: { status: ContentStatus } & BadgeProps) {
  const colors: Record<ContentStatus, string> = {
    DRAFT: "bg-olive/25 text-sand",
    PUBLISHED: "bg-accent/20 text-accent",
    ARCHIVED: "bg-muted/20 text-muted",
  };
  return (
    <span className={cn("inline-flex rounded-lg px-2.5 py-1 text-xs font-medium", colors[status], className)}>
      {contentLabels[status]}
    </span>
  );
}

export function StockStatusBadge({ status, className }: { status: StockStatus } & BadgeProps) {
  const colors: Record<StockStatus, string> = {
    IN_STOCK: "bg-moss/30 text-cream",
    LOW_STOCK: "bg-sand/20 text-sand",
    MADE_TO_ORDER: "bg-olive/25 text-sand",
  };
  return (
    <span className={cn("inline-flex rounded-lg px-2.5 py-1 text-xs font-medium", colors[status], className)}>
      {stockLabels[status]}
    </span>
  );
}
