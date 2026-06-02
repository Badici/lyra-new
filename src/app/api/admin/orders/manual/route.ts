import { NextResponse } from "next/server";
import { OrderSource, PaymentMethod } from "@prisma/client";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { checkoutSchema } from "@/lib/validation";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const payload = checkoutSchema.parse(await request.json());
    const subtotalRon = payload.items.reduce(
      (sum, item) => sum + item.priceValueRon * item.quantity,
      0
    );
    const totalRon = subtotalRon + payload.deliveryCostRon;

    const order = await prisma.$transaction(async (tx) => {
      const address = await tx.address.create({
        data: {
          fullName: payload.fullName,
          phone: payload.phone,
          email: payload.email,
          county: payload.county,
          city: payload.city,
          street: payload.street,
          postalCode: payload.postalCode,
          easyboxId: payload.easyboxId,
          easyboxName: payload.easyboxName,
        },
      });

      return tx.order.create({
        data: {
          number: `LY-MAN-${Date.now()}`,
          source: OrderSource.MANUAL,
          paymentMethod: PaymentMethod.COD,
          deliveryMethod: payload.deliveryMethod,
          addressId: address.id,
          subtotalRon,
          deliveryCostRon: payload.deliveryCostRon,
          totalRon,
          items: {
            create: payload.items.map((item) => ({
              productNameSnapshot: item.name,
              productSlugSnapshot: item.productSlug,
              unitPriceRon: item.priceValueRon,
              quantity: item.quantity,
              lineTotalRon: item.priceValueRon * item.quantity,
              configJson: item.configSummary
                ? { configSummary: item.configSummary }
                : undefined,
            })),
          },
        },
        include: { items: true, address: true },
      });
    });

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Invalid payload" },
      { status: 400 }
    );
  }
}
