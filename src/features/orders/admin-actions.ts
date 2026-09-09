"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/db/client";
import { orderStatusHistory, orders } from "@/db/schema";
import { ORDER_STATUSES } from "@/lib/constants";
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
