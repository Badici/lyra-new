import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { z } from "zod";

const overrideSchema = z.object({
  productId: z.string().min(1),
  overrideRon: z.number().nonnegative(),
  reason: z.string().optional(),
  active: z.boolean().default(true),
  activeFrom: z.coerce.date().optional(),
  activeTo: z.coerce.date().nullable().optional(),
});

async function canAdmin() {
  const session = await auth();
  return Boolean(session?.user && session.user.role === "ADMIN");
}

export async function GET() {
  if (!(await canAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const overrides = await prisma.productPricingOverride.findMany({
    include: { product: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(overrides);
}

export async function POST(request: Request) {
  if (!(await canAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  try {
    const payload = overrideSchema.parse(await request.json());
    const override = await prisma.productPricingOverride.create({
      data: {
        ...payload,
        activeFrom: payload.activeFrom ?? new Date(),
      },
    });
    return NextResponse.json(override, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Invalid override payload" },
      { status: 400 }
    );
  }
}
