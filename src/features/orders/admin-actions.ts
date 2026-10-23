"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { db } from "@/db/client";
import { orderStatusHistory, orders } from "@/db/schema";
import { ORDER_STATUSES } from "@/lib/constants";
import { createOrder } from "@/features/orders/create-order";
import { requireAdmin } from "@/server/auth/session";

const updateStatusSchema = z.object({
  orderId: z.string().uuid(),
  status: z.enum(ORDER_STATUSES),
  note: z.string().trim().optional(),
});

export async function updateOrderStatus(formData: FormData): Promise<void> {
  const session = await requireAdmin();
  const parsed = updateStatusSchema.safeParse({
    orderId: formData.get("orderId"),
    status: formData.get("status"),
    note: formData.get("note") || undefined,
  });

  if (!parsed.success) return;

  const { orderId, status, note } = parsed.data;
  const existing = await db.query.orders.findFirst({ where: eq(orders.id, orderId) });
  if (!existing || existing.status === status) return;

  await db.update(orders).set({ status }).where(eq(orders.id, orderId));

  await db.insert(orderStatusHistory).values({
    orderId,
    fromStatus: existing.status,
    toStatus: status,
    note: note ?? null,
    actorUserId: session.user.id,
  });

  revalidatePath("/admin/comenzi");
  revalidatePath(`/admin/comenzi/${orderId}`);
  revalidatePath("/admin");
}

export type AdminCreateOrderState = {
  error?: string;
  fieldErrors?: Record<string, string[]>;
};

export async function createAdminOrderAction(
  _prev: AdminCreateOrderState,
  formData: FormData,
): Promise<AdminCreateOrderState> {
  await requireAdmin();

  const productIds = formData.getAll("productId").map(String);
  const quantities = formData.getAll("quantity").map(String);
  const items: { productId: string; quantity: number }[] = [];

  for (let i = 0; i < productIds.length; i += 1) {
    const productId = productIds[i]?.trim();
    const quantity = Number(quantities[i] ?? 0);
    if (!productId) continue;
    if (!Number.isFinite(quantity) || quantity < 1) {
      return { error: "Cantitatea trebuie să fie cel puțin 1 pentru fiecare produs." };
    }
    items.push({ productId, quantity: Math.floor(quantity) });
  }

  const result = await createOrder(
    {
      customerName: formData.get("customerName"),
      customerEmail: formData.get("customerEmail"),
      customerPhone: formData.get("customerPhone"),
      shippingCounty: formData.get("shippingCounty"),
      shippingCity: formData.get("shippingCity"),
      shippingPostalCode: formData.get("shippingPostalCode") || undefined,
      shippingStreetLine: formData.get("shippingStreetLine"),
      shippingDetails: formData.get("shippingDetails") || undefined,
      notes: formData.get("notes") || undefined,
      termsAccepted: true,
      items,
    },
    null,
    { createdByAdmin: true },
  );

  if (!result.ok) {
    return { error: result.error, fieldErrors: result.fieldErrors };
  }

  revalidatePath("/admin/comenzi");
  revalidatePath("/admin");
  redirect(`/admin/comenzi/${result.orderId}`);
}
