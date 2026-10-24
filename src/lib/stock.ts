import {
  IN_STOCK_MESSAGE_RO,
  LOW_STOCK_MESSAGE_RO,
  LOW_STOCK_THRESHOLD,
  OUT_OF_STOCK_MESSAGE_RO,
  type StockStatus,
} from "@/lib/constants";

export function resolveStockStatus(stockQuantity: number): StockStatus {
  if (stockQuantity <= 0) return "MADE_TO_ORDER";
  if (stockQuantity < LOW_STOCK_THRESHOLD) return "LOW_STOCK";
  return "IN_STOCK";
}

export function requiresDeliveryConfirmation(stockQuantity: number): boolean {
  return stockQuantity <= 0;
}

export function stockMessageRo(stockQuantity: number): string {
  if (stockQuantity <= 0) return OUT_OF_STOCK_MESSAGE_RO;
  if (stockQuantity < LOW_STOCK_THRESHOLD) return LOW_STOCK_MESSAGE_RO;
  return IN_STOCK_MESSAGE_RO;
}

export function canPurchaseProduct(isActive: boolean): boolean {
  return isActive;
}
