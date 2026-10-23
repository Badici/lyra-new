import {
  LOW_STOCK_THRESHOLD,
  OUT_OF_STOCK_MESSAGE_RO,
  type StockStatus,
} from "@/lib/constants";

export function resolveStockStatus(stockQuantity: number): StockStatus {
  if (stockQuantity <= 0) return "MADE_TO_ORDER";
  if (stockQuantity <= LOW_STOCK_THRESHOLD) return "LOW_STOCK";
  return "IN_STOCK";
}

export function requiresDeliveryConfirmation(stockQuantity: number): boolean {
  return stockQuantity <= 0;
}

export function stockMessageRo(stockQuantity: number): string | null {
  return requiresDeliveryConfirmation(stockQuantity) ? OUT_OF_STOCK_MESSAGE_RO : null;
}

export function canPurchaseProduct(isActive: boolean): boolean {
  return isActive;
}
