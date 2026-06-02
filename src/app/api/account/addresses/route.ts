import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { z } from "zod";

const addressSchema = z.object({
  label: z.string().optional(),
  fullName: z.string().min(2),
  phone: z.string().min(8),
  email: z.email(),
  county: z.string().min(2),
  city: z.string().min(2),
  street: z.string().min(5),
  postalCode: z.string().min(4),
  easyboxId: z.string().optional(),
  easyboxName: z.string().optional(),
  isDefault: z.boolean().default(false),
});

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const addresses = await prisma.address.findMany({
    where: { userId: session.user.id },
    orderBy: [{ isDefault: "desc" }, { updatedAt: "desc" }],
  });
  return NextResponse.json(addresses);
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const payload = addressSchema.parse(await request.json());

    if (payload.isDefault) {
      await prisma.address.updateMany({
        where: { userId: session.user.id },
        data: { isDefault: false },
      });
    }

    const address = await prisma.address.create({
      data: {
        ...payload,
        userId: session.user.id,
      },
    });
    return NextResponse.json(address, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Invalid address payload" },
      { status: 400 }
    );
  }
}

export async function PATCH(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as { id?: string; isDefault?: boolean };
  if (!body.id) {
    return NextResponse.json({ error: "Address id is required" }, { status: 400 });
  }

  const address = await prisma.address.findFirst({
    where: { id: body.id, userId: session.user.id },
  });
  if (!address) {
    return NextResponse.json({ error: "Address not found" }, { status: 404 });
  }

  if (body.isDefault) {
    await prisma.address.updateMany({
      where: { userId: session.user.id },
      data: { isDefault: false },
    });
  }

  const updated = await prisma.address.update({
    where: { id: body.id },
    data: {
      isDefault: Boolean(body.isDefault),
    },
  });

  return NextResponse.json(updated);
}
