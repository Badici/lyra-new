import { describe, expect, it } from "vitest";
import {
  canPurchaseProduct,
  requiresDeliveryConfirmation,
  resolveStockStatus,
  stockMessageRo,
} from "@/lib/stock";
import { OUT_OF_STOCK_MESSAGE_RO } from "@/lib/constants";

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

  it("does not require confirmation when stock is positive", () => {
    expect(requiresDeliveryConfirmation(1)).toBe(false);
    expect(stockMessageRo(10)).toBeNull();
    expect(resolveStockStatus(3)).toBe("LOW_STOCK");
    expect(resolveStockStatus(20)).toBe("IN_STOCK");
  });
});
