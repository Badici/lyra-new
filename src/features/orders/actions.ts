"use server";

import { createOrder } from "@/features/orders/create-order";
import { getSession } from "@/server/auth/session";

export async function submitOrderAction(raw: unknown) {
  const session = await getSession();
  const userId = session?.user?.id ?? null;
  return createOrder(raw, userId);
}
