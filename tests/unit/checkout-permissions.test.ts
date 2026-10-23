import { describe, expect, it } from "vitest";
import { hasRole, isAdminRole } from "@/server/auth/roles";
import { checkoutSchema } from "@/lib/validators";

describe("permissions", () => {
  it("recognizes admin role", () => {
    expect(isAdminRole("ADMIN")).toBe(true);
    expect(isAdminRole("CUSTOMER")).toBe(false);
    expect(isAdminRole(undefined)).toBe(false);
    expect(hasRole("ADMIN", "ADMIN")).toBe(true);
    expect(hasRole("CUSTOMER", "ADMIN")).toBe(false);
  });
});

describe("checkout validation", () => {
  it("requires terms and at least one item", () => {
    const result = checkoutSchema.safeParse({
      customerName: "Ion",
      customerEmail: "ion@example.com",
      customerPhone: "0700000000",
      shippingCounty: "Cluj",
      shippingCity: "Cluj-Napoca",
      shippingStreetLine: "Str. Test 1",
      termsAccepted: false,
      items: [],
    });
    expect(result.success).toBe(false);
  });

  it("accepts valid ramburs checkout payload shape", () => {
    const result = checkoutSchema.safeParse({
      customerName: "Ion Pop",
      customerEmail: "ion@example.com",
      customerPhone: "0700000000",
      shippingCounty: "Cluj",
      shippingCity: "Cluj-Napoca",
      shippingStreetLine: "Str. Test 1",
      termsAccepted: true,
      items: [{ productId: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11", quantity: 2 }],
    });
    expect(result.success).toBe(true);
  });
});
