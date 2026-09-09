import { eq, inArray, sql } from "drizzle-orm";
import { db } from "@/db/client";
import {
  orderItems,
  orderSequences,
  orderStatusHistory,
  orders,
  products,
} from "@/db/schema";
import { checkoutSchema, type CheckoutInput } from "@/lib/validators";
import { multiplyBani, sumBani, formatRon } from "@/lib/money";
import { canPurchaseProduct, requiresDeliveryConfirmation } from "@/lib/stock";
import { emailService } from "@/server/email";
import { whatsappService } from "@/server/whatsapp";
import { getSiteSettings } from "@/features/settings/queries";

async function resolveOrderPrefix(): Promise<string> {
  try {
    const settings = await getSiteSettings();
    const prefix = settings.orders.prefix?.trim();
    if (prefix) return prefix;
  } catch {
    // fall through to env
  }
  return process.env.ORDER_NUMBER_PREFIX ?? "LYRA";
}

async function nextOrderNumber(year: number): Promise<string> {
  const prefix = await resolveOrderPrefix();
  const existing = await db.query.orderSequences.findFirst({
    where: eq(orderSequences.year, year),
  });

  if (!existing) {
    await db.insert(orderSequences).values({ year, lastValue: 1 });
    return `${prefix}-${year}-${String(1).padStart(6, "0")}`;
  }

  const updated = await db
    .update(orderSequences)
    .set({ lastValue: sql`${orderSequences.lastValue} + 1` })
    .where(eq(orderSequences.year, year))
    .returning();

  const value = updated[0]?.lastValue ?? existing.lastValue + 1;
  return `${prefix}-${year}-${String(value).padStart(6, "0")}`;
}

export type CreateOrderResult =
  | {
      ok: true;
      orderId: string;
      orderNumber: string;
      whatsappUrl: string;
      requiresDeliveryConfirmation: boolean;
    }
  | { ok: false; error: string; fieldErrors?: Record<string, string[]> };

export async function createOrder(
  raw: unknown,
  userId?: string | null,
  options?: { createdByAdmin?: boolean },
): Promise<CreateOrderResult> {
  const parsed = checkoutSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      ok: false,
      error: "Verifică datele din formular.",
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  const input: CheckoutInput = parsed.data;
  const productIds = input.items.map((i) => i.productId);

  const dbProducts = await db.query.products.findMany({
    where: inArray(products.id, productIds),
  });
  const byId = new Map(dbProducts.map((p) => [p.id, p]));

  const lineItems: {
    productId: string;
    productName: string;
    productSlug: string;
    sku: string;
    unitPriceBani: number;
    quantity: number;
    lineTotalBani: number;
    stockAtOrder: number;
    requiresDeliveryConfirmation: boolean;
  }[] = [];

  for (const item of input.items) {
    const product = byId.get(item.productId);
    if (!product || !canPurchaseProduct(product.isActive)) {
      return { ok: false, error: "Un produs din coș nu mai este disponibil." };
    }
    const unitPriceBani = product.priceBani;
    const lineTotalBani = multiplyBani(unitPriceBani, item.quantity);
    const needsConfirm = requiresDeliveryConfirmation(product.stockQuantity);
    lineItems.push({
      productId: product.id,
      productName: product.name,
      productSlug: product.slug,
      sku: product.sku,
      unitPriceBani,
      quantity: item.quantity,
      lineTotalBani,
      stockAtOrder: product.stockQuantity,
      requiresDeliveryConfirmation: needsConfirm,
    });
  }

  const subtotalBani = sumBani(lineItems.map((l) => l.lineTotalBani));
  const totalBani = subtotalBani;
  const orderNeedsConfirm = lineItems.some((l) => l.requiresDeliveryConfirmation);
  const year = new Date().getUTCFullYear();
  const orderNumber = await nextOrderNumber(year);

  const [order] = await db
    .insert(orders)
    .values({
      orderNumber,
      userId: userId ?? null,
      status: "NEW",
      paymentMethod: "CASH_ON_DELIVERY",
      customerName: input.customerName,
      customerEmail: input.customerEmail,
      customerPhone: input.customerPhone,
      shippingCounty: input.shippingCounty,
      shippingCity: input.shippingCity,
      shippingPostalCode: input.shippingPostalCode || null,
      shippingStreetLine: input.shippingStreetLine,
      shippingDetails: input.shippingDetails || null,
      notes: input.notes || null,
      subtotalBani,
      totalBani,
      requiresDeliveryConfirmation: orderNeedsConfirm,
      termsAcceptedAt: new Date(),
    })
    .returning();

  if (!order) {
    return { ok: false, error: "Nu am putut crea comanda. Încearcă din nou." };
  }

  await db.insert(orderItems).values(
    lineItems.map((l) => ({
      orderId: order.id,
      ...l,
    })),
  );

  await db.insert(orderStatusHistory).values({
    orderId: order.id,
    fromStatus: null,
    toStatus: "NEW",
    note: options?.createdByAdmin ? "Comandă creată din admin" : "Comandă creată",
  });

  // Decrement stock where available (never block order; zero stays zero)
  for (const line of lineItems) {
    if (line.stockAtOrder > 0) {
      const product = byId.get(line.productId);
      if (!product) continue;
      const nextQty = Math.max(0, product.stockQuantity - line.quantity);
      await db
        .update(products)
        .set({
          stockQuantity: nextQty,
          stockStatus:
            nextQty <= 0 ? "MADE_TO_ORDER" : nextQty <= 5 ? "LOW_STOCK" : "IN_STOCK",
        })
        .where(eq(products.id, product.id));
    }
  }

  const totalLabel = formatRon(totalBani);
  const itemsSummary = lineItems
    .map((l) => `${l.productName} x${l.quantity}`)
    .join(", ");

  await emailService.sendNewOrderNotification({
    orderNumber,
    customerName: input.customerName,
    totalLabel,
    requiresDeliveryConfirmation: orderNeedsConfirm,
  });

  await emailService.sendOrderConfirmation({
    to: input.customerEmail,
    orderNumber,
    customerName: input.customerName,
    totalLabel,
  });

  const message = whatsappService.buildOrderMessage({
    orderNumber,
    customerName: input.customerName,
    totalLabel,
    itemsSummary,
    requiresDeliveryConfirmation: orderNeedsConfirm,
  });
  const whatsappPhone = await whatsappService.resolvePhoneDigits();

  return {
    ok: true,
    orderId: order.id,
    orderNumber,
    whatsappUrl: whatsappService.buildDeepLink(message, whatsappPhone),
    requiresDeliveryConfirmation: orderNeedsConfirm,
  };
}
