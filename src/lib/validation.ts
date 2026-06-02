import { z } from "zod";

export const orderItemSchema = z.object({
  productSlug: z.string().min(1),
  name: z.string().min(1),
  priceValueRon: z.number().nonnegative(),
  quantity: z.number().int().positive(),
  configSummary: z.string().optional(),
});

export const checkoutSchema = z.object({
  fullName: z.string().min(2),
  phone: z.string().min(8),
  email: z.email(),
  county: z.string().min(2),
  city: z.string().min(2),
  street: z.string().min(5),
  postalCode: z.string().min(4),
  easyboxId: z.string().optional(),
  easyboxName: z.string().optional(),
  deliveryMethod: z.enum(["COURIER", "EASYBOX", "PICKUP"]),
  deliveryCostRon: z.number().nonnegative(),
  notes: z.string().max(1000).optional(),
  idempotencyKey: z.string().optional(),
  items: z.array(orderItemSchema).min(1),
});

export const adminProductSchema = z.object({
  slug: z.string().min(2),
  name: z.string().min(2),
  shortDescription: z.string().min(2),
  description: z.string().min(2),
  specs: z.array(z.string()).default([]),
  images: z.array(z.string()).default([]),
  basePriceRon: z.number().nonnegative(),
  priceLabel: z.string().min(1),
  isConfigurable: z.boolean().default(false),
  pricingConfigJson: z.unknown().optional(),
  variantSelectorLabel: z.string().optional(),
  variantValues: z.array(z.string()).default([]),
  variantPlaceholder: z.string().optional(),
  customOrderNote: z.string().optional(),
  displayOrder: z.number().int().default(100),
  categoryId: z.string().optional(),
  status: z.enum(["ACTIVE", "DRAFT", "ARCHIVED"]).default("ACTIVE"),
});
