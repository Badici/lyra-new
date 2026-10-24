import { describe, expect, it } from "vitest";
import {
  canPurchaseProduct,
  requiresDeliveryConfirmation,
  resolveStockStatus,
  stockMessageRo,
} from "@/lib/stock";
import { IN_STOCK_MESSAGE_RO, LOW_STOCK_MESSAGE_RO, OUT_OF_STOCK_MESSAGE_RO } from "@/lib/constants";

describe("stock rules", () => {
  it("allows purchase when active regardless of stock", () => {
    expect(canPurchaseProduct(true)).toBe(true);
    expect(canPurchaseProduct(false)).toBe(false);
  });

  it("marks zero stock as made-to-order requiring delivery confirmation", () => {
    expect(resolveStockStatus(0)).toBe("MADE_TO_ORDER");
    expect(requiresDeliveryConfirmation(0)).toBe(true);
    expect(stockMessageRo(0)).toBe(OUT_OF_STOCK_MESSAGE_RO);
  });

  it("lets a positive stock be bought directly and warns below 20", () => {
    expect(requiresDeliveryConfirmation(1)).toBe(false);
    expect(stockMessageRo(10)).toBe(LOW_STOCK_MESSAGE_RO);
    expect(stockMessageRo(19)).toBe(LOW_STOCK_MESSAGE_RO);
    expect(stockMessageRo(20)).toBe(IN_STOCK_MESSAGE_RO);
    expect(resolveStockStatus(3)).toBe("LOW_STOCK");
    expect(resolveStockStatus(19)).toBe("LOW_STOCK");
    expect(resolveStockStatus(20)).toBe("IN_STOCK");
  });
});
