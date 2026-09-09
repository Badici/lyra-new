import { z } from "zod";

export const checkoutSchema = z.object({
  customerName: z.string().trim().min(2, "Numele este obligatoriu"),
  customerEmail: z.string().trim().email("Email invalid"),
  customerPhone: z.string().trim().min(8, "Telefon invalid"),
  shippingCounty: z.string().trim().min(2, "Județul este obligatoriu"),
  shippingCity: z.string().trim().min(2, "Localitatea este obligatorie"),
  shippingPostalCode: z.string().trim().optional(),
  shippingStreetLine: z.string().trim().min(5, "Adresa este obligatorie"),
  shippingDetails: z.string().trim().optional(),
  notes: z.string().trim().optional(),
  termsAccepted: z.boolean().refine((v) => v === true, {
    message: "Trebuie să accepți termenii și condițiile",
  }),
  items: z
    .array(
      z.object({
        productId: z.string().uuid(),
        quantity: z.number().int().positive().max(99),
      }),
    )
    .min(1, "Coșul este gol"),
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;

export const contactSchema = z.object({
  name: z.string().trim().min(2),
  email: z.string().trim().email(),
  phone: z.string().trim().optional(),
  subject: z.string().trim().optional(),
  message: z.string().trim().min(10).max(5000),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(10),
});

export const registerSchema = z.object({
  name: z.string().trim().min(2),
  email: z.string().email(),
  password: z.string().min(10),
  phone: z.string().trim().optional(),
});
