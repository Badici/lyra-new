"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/db/client";
import { inventoryMovements, products } from "@/db/schema";
import { resolveStockStatus } from "@/lib/stock";
import { requireAdmin } from "@/server/auth/session";

const adjustSchema = z.object({
  productId: z.string().uuid(),
  delta: z.coerce.number().int().refine((v) => v !== 0, "Ajustarea nu poate fi zero."),
});

export async function adjustStock(formData: FormData): Promise<void> {
  const session = await requireAdmin();
  const parsed = adjustSchema.safeParse({
    productId: formData.get("productId"),
    delta: formData.get("delta"),
  });

  if (!parsed.success) return;

  const { productId, delta } = parsed.data;
  const product = await db.query.products.findFirst({ where: eq(products.id, productId) });
  if (!product) return;

  const nextQty = Math.max(0, product.stockQuantity + delta);

  await db.insert(inventoryMovements).values({
    productId,
    delta,
    reason: delta > 0 ? "adăugare" : "scădere",
    note: null,
    actorUserId: session.user.id,
  });

  await db
    .update(products)
    .set({
      stockQuantity: nextQty,
      stockStatus: resolveStockStatus(nextQty),
    })
    .where(eq(products.id, productId));

  revalidatePath("/admin/stoc");
  revalidatePath("/admin/produse");
  revalidatePath(`/admin/produse/${productId}`);
  revalidatePath("/admin");
}
