import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { listOrdersForAdmin } from "@/lib/order-service";

export async function GET() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const orders = await listOrdersForAdmin();
  return NextResponse.json(orders);
}
