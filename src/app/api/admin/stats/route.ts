import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getDashboardStats } from "@/lib/stats";

export async function GET(request: Request) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const days = Number(searchParams.get("days") ?? "30");
  const stats = await getDashboardStats(Number.isFinite(days) ? days : 30);
  return NextResponse.json(stats);
}
