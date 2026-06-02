import { OrderSource, PaymentMethod } from "@prisma/client";
import { prisma } from "@/lib/db";
import { sendOrderEmails } from "@/lib/email";
import { computeRecipeCost, resolveUnitPriceRon } from "@/lib/pricing";
import { checkoutSchema } from "@/lib/validation";

function getOrderNumber() {
  const date = new Date();
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  const random = Math.floor(Math.random() * 9000 + 1000);
  return `LY-${y}${m}${d}-${random}`;
}

export async function createOrder(payload: unknown, userId?: string) {
  const parsed = checkoutSchema.parse(payload);

  if (parsed.idempotencyKey) {
    const existing = await prisma.order.findUnique({
      where: { idempotencyKey: parsed.idempotencyKey },
    });
    if (existing) {
      return existing;
    }
  }

  const productRows = await prisma.product.findMany({
    where: {
      slug: {
        in: parsed.items.map((entry) => entry.productSlug),
      },
    },
  });

  const productBySlug = new Map(productRows.map((row) => [row.slug, row]));

  const computedItems = await Promise.all(
    parsed.items.map(async (item) => {
      const dbProduct = productBySlug.get(item.productSlug);
      const resolvedPrice = dbProduct
        ? await resolveUnitPriceRon(dbProduct.id, dbProduct.basePriceRon)
        : item.priceValueRon;
      const recipeCost = dbProduct ? await computeRecipeCost(dbProduct.id) : 0;
      const lineTotal = resolvedPrice * item.quantity;
      const lineRecipeCost = recipeCost * item.quantity;
      return {
        dbProduct,
        item,
        resolvedPrice,
        recipeCost,
        lineTotal,
        lineRecipeCost,
      };
    })
  );

  const subtotalRon = computedItems.reduce((sum, entry) => sum + entry.lineTotal, 0);
  const recipeCostRon = computedItems.reduce(
    (sum, entry) => sum + entry.lineRecipeCost,
    0
  );
  const totalRon = subtotalRon + parsed.deliveryCostRon;
  const profitRon = totalRon - parsed.deliveryCostRon - recipeCostRon;

  const order = await prisma.$transaction(async (tx) => {
    const address = await tx.address.create({
      data: {
        userId,
        fullName: parsed.fullName,
        phone: parsed.phone,
        email: parsed.email,
        county: parsed.county,
        city: parsed.city,
        street: parsed.street,
        postalCode: parsed.postalCode,
        easyboxId: parsed.easyboxId,
        easyboxName: parsed.easyboxName,
      },
    });

    const createdOrder = await tx.order.create({
      data: {
        number: getOrderNumber(),
        source: userId ? OrderSource.ACCOUNT : OrderSource.GUEST,
        paymentMethod: PaymentMethod.COD,
        deliveryMethod: parsed.deliveryMethod,
        userId,
        addressId: address.id,
        notes: parsed.notes,
        subtotalRon,
        deliveryCostRon: parsed.deliveryCostRon,
        totalRon,
        recipeCostRon,
        profitRon,
        idempotencyKey: parsed.idempotencyKey,
        items: {
          create: computedItems.map((entry) => ({
            productId: entry.dbProduct?.id,
            productNameSnapshot: entry.item.name,
            productSlugSnapshot: entry.item.productSlug,
            quantity: entry.item.quantity,
            unitPriceRon: entry.resolvedPrice,
            lineTotalRon: entry.lineTotal,
            recipeCostSnapshot: entry.recipeCost,
            configJson: entry.item.configSummary
              ? { configSummary: entry.item.configSummary }
              : undefined,
          })),
        },
      },
      include: {
        items: true,
        address: true,
      },
    });

    await tx.deliveryCost.create({
      data: {
        orderId: createdOrder.id,
        carrier: "Sameday",
        method: parsed.deliveryMethod,
        costRon: parsed.deliveryCostRon,
      },
    });

    return createdOrder;
  });

  await sendOrderEmails({
    orderId: order.id,
    orderNumber: order.number,
    customerEmail: order.address?.email ?? parsed.email,
    customerName: order.address?.fullName ?? parsed.fullName,
    totalRon: order.totalRon,
    lines: order.items.map(
      (item) =>
        `${item.productNameSnapshot} x${item.quantity} - ${item.lineTotalRon.toFixed(2)} RON`
    ),
  });

  return order;
}

export async function listOrdersForUser(userId: string) {
  return prisma.order.findMany({
    where: { userId },
    include: { items: true, address: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function listOrdersForAdmin() {
  return prisma.order.findMany({
    include: {
      items: true,
      user: true,
      address: true,
    },
    orderBy: { createdAt: "desc" },
  });
}
