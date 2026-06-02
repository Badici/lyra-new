import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { z } from "zod";

const materialSchema = z.object({
  name: z.string().min(2),
  unit: z.string().min(1),
  unitCostRon: z.number().nonnegative(),
  supplier: z.string().optional(),
  active: z.boolean().default(true),
});

async function canAdmin() {
  const session = await auth();
  return Boolean(session?.user && session.user.role === "ADMIN");
}

export async function GET() {
  if (!(await canAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const materials = await prisma.rawMaterial.findMany({
    orderBy: { updatedAt: "desc" },
  });
  return NextResponse.json(materials);
}

export async function POST(request: Request) {
  if (!(await canAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  try {
    const payload = materialSchema.parse(await request.json());
    const material = await prisma.rawMaterial.create({ data: payload });
    return NextResponse.json(material, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Invalid material payload" },
      { status: 400 }
    );
  }
}
