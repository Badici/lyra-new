import { describe, expect, it } from "vitest";
import { z } from "zod";
import { decimalInput, validationError } from "@/server/forms/result";

describe("validationError", () => {
  it("explains a missing category and a short sku", () => {
    const parsed = z
      .object({
        sku: z.string().min(2),
        categoryId: z.string().uuid(),
      })
      .safeParse({ sku: "a", categoryId: "" });

    expect(parsed.success).toBe(false);
    if (parsed.success) return;
    expect(validationError(parsed.error)).toBe("SKU-ul este prea scurt sau lipsește.");
  });
});

describe("decimalInput", () => {
  it("accepts a romanian decimal comma", () => {
    expect(decimalInput("49,90")).toBe("49.90");
    expect(decimalInput("")).toBeUndefined();
  });
});
