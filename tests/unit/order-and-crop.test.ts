import { describe, expect, it } from "vitest";
import { cropSourceRect } from "@/lib/image-presets";
import { buildOrderNotification } from "@/server/email/order-message";

describe("cropSourceRect", () => {
  it("centers a wide image inside a square frame", () => {
    const rect = cropSourceRect({
      naturalWidth: 2000,
      naturalHeight: 1000,
      frameWidth: 400,
      frameHeight: 400,
      zoom: 1,
      panX: 0,
      panY: 0,
    });
    expect(rect.sw).toBeCloseTo(1000);
    expect(rect.sh).toBeCloseTo(1000);
    expect(rect.sx).toBeCloseTo(500);
    expect(rect.sy).toBeCloseTo(0);
  });
});

describe("buildOrderNotification", () => {
  it("includes the customer and the products", () => {
    const mail = buildOrderNotification({
      orderNumber: "LYRA-2026-000001",
      customerName: "Ana",
      customerEmail: "ana@example.com",
      customerPhone: "0700000000",
      address: "Strada 1",
      items: [{ name: "Boilie", quantity: 2, totalLabel: "40,00 RON" }],
      totalLabel: "40,00 RON",
      notes: "",
      requiresDeliveryConfirmation: false,
    });
    expect(mail.subject).toContain("LYRA-2026-000001");
    expect(mail.message).toContain("ana@example.com");
    expect(mail.message).toContain("Boilie × 2");
  });
});
