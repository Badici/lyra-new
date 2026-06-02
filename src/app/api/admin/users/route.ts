import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { z } from "zod";

const userPatchSchema = z.object({
  role: z.enum(["ADMIN", "CUSTOMER"]).optional(),
  active: z.boolean().optional(),
  name: z.string().min(2).optional(),
  phone: z.string().optional(),
});

async function canAdmin() {
  const session = await auth();
  return Boolean(session?.user && session.user.role === "ADMIN");
}

export async function GET() {
  if (!(await canAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      active: true,
      phone: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(users);
}

export async function PATCH(request: Request) {
  if (!(await canAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const body = await request.json();
  const id = z.string().parse(body.id);
  const payload = userPatchSchema.parse(body.data ?? {});
  const user = await prisma.user.update({
    where: { id },
    data: payload,
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      active: true,
      phone: true,
      createdAt: true,
    },
  });
  return NextResponse.json(user);
}
