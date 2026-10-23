import { and, desc, eq, ilike, or } from "drizzle-orm";
import { db } from "@/db/client";
import { orderItems, orderStatusHistory, orders } from "@/db/schema";
import type { OrderStatus } from "@/lib/constants";

export async function getAdminOrders(filters?: {
  status?: OrderStatus;
  q?: string;
  limit?: number;
}) {
  const limit = filters?.limit ?? 50;
  const conditions = [];

  if (filters?.status) {
    conditions.push(eq(orders.status, filters.status));
  }

  if (filters?.q?.trim()) {
    const term = `%${filters.q.trim()}%`;
    conditions.push(
      or(
        ilike(orders.orderNumber, term),
        ilike(orders.customerName, term),
        ilike(orders.customerEmail, term),
        ilike(orders.customerPhone, term),
      ),
    );
  }

  return db.query.orders.findMany({
    where: conditions.length > 0 ? and(...conditions) : undefined,
    orderBy: [desc(orders.createdAt)],
    limit,
    with: {
      items: true,
    },
  });
}

export async function getAdminOrderById(id: string) {
  return db.query.orders.findFirst({
    where: eq(orders.id, id),
    with: {
      items: true,
      statusHistory: {
        orderBy: [desc(orderStatusHistory.createdAt)],
      },
    },
  });
}

export async function getOrderItemsSummary(orderId: string) {
  return db.query.orderItems.findMany({
    where: eq(orderItems.orderId, orderId),
  });
}
