import { subDays } from "date-fns";
import { prisma } from "@/lib/db";

export async function getDashboardStats(days = 30) {
  const from = subDays(new Date(), days);

  const orders = await prisma.order.findMany({
    where: {
      createdAt: { gte: from },
      status: { not: "ANULATA" },
    },
    select: {
      subtotalRon: true,
      deliveryCostRon: true,
      totalRon: true,
      recipeCostRon: true,
      profitRon: true,
      createdAt: true,
    },
    orderBy: { createdAt: "asc" },
  });

  const salesRon = orders.reduce((sum, order) => sum + order.subtotalRon, 0);
  const deliveryRon = orders.reduce((sum, order) => sum + order.deliveryCostRon, 0);
  const totalRon = orders.reduce((sum, order) => sum + order.totalRon, 0);
  const cogsRon = orders.reduce((sum, order) => sum + order.recipeCostRon, 0);
  const profitRon = orders.reduce((sum, order) => sum + order.profitRon, 0);

  return {
    days,
    orderCount: orders.length,
    salesRon,
    deliveryRon,
    totalRon,
    cogsRon,
    profitRon,
    series: orders.map((order) => ({
      date: order.createdAt.toISOString().slice(0, 10),
      totalRon: order.totalRon,
      profitRon: order.profitRon,
    })),
  };
}
