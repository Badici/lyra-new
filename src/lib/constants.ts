export const USER_ROLES = ["CUSTOMER", "ADMIN"] as const;
export type UserRole = (typeof USER_ROLES)[number];

export const ORDER_STATUSES = [
  "NEW",
  "CONFIRMED",
  "WAITING_STOCK",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  NEW: "Nouă",
  CONFIRMED: "Confirmată",
  WAITING_STOCK: "Așteaptă stoc",
  PROCESSING: "În procesare",
  SHIPPED: "Expediată",
  DELIVERED: "Livrată",
  CANCELLED: "Anulată",
};

export const PAYMENT_METHODS = ["CASH_ON_DELIVERY"] as const;
export type PaymentMethod = (typeof PAYMENT_METHODS)[number];

export const ARTICLE_STATUSES = ["DRAFT", "PUBLISHED", "ARCHIVED"] as const;
export type ArticleStatus = (typeof ARTICLE_STATUSES)[number];

export const CONTENT_STATUSES = ["DRAFT", "PUBLISHED", "ARCHIVED"] as const;
export type ContentStatus = (typeof CONTENT_STATUSES)[number];

export const STOCK_STATUSES = ["IN_STOCK", "LOW_STOCK", "MADE_TO_ORDER"] as const;
export type StockStatus = (typeof STOCK_STATUSES)[number];

export const LOW_STOCK_THRESHOLD = 5;

export const OUT_OF_STOCK_MESSAGE_RO =
  "Produs disponibil la comandă. Un membru al echipei Lyra vă va contacta pentru a discuta termenul de livrare.";

export const REQUIRES_DELIVERY_CONFIRMATION_LABEL_RO =
  "Necesită confirmarea termenului de livrare";

export const SITE_NAME = "LyraBaits";
export const SITE_TAGLINE = "Mai mult decât echipament de pescuit";
export const PRODUCTION_SITE_URL = "https://lyrabaits.ro";

export const NAV_LINKS = [
  { href: "/produse", label: "Produse" },
  { href: "/articole", label: "Articole" },
  { href: "/emisiuni", label: "Emisiuni" },
  { href: "/povestea-noastra", label: "Povestea noastră" },
  { href: "/contact", label: "Contact" },
] as const;

export const ADMIN_NAV = [
  { href: "/admin", label: "Dashboard", exact: true },
  { href: "/admin/comenzi", label: "Comenzi" },
  { href: "/admin/produse", label: "Produse" },
  { href: "/admin/categorii", label: "Categorii" },
  { href: "/admin/stoc", label: "Stoc" },
  { href: "/admin/articole", label: "Articole" },
  { href: "/admin/emisiuni", label: "Emisiuni" },
  { href: "/admin/clienti", label: "Clienți" },
  { href: "/admin/setari", label: "Setări" },
] as const;
