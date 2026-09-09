import { and, count, eq, gte, ne, sql, sum } from "drizzle-orm";
import { db } from "@/db/client";
import {
  articles,
  categories,
  episodes,
  orders,
  products,
  shows,
  siteSettings,
  users,
} from "@/db/schema";
import { ORDER_STATUSES } from "@/lib/constants";
import { formatRon } from "@/lib/money";

function startOfTodayUtc(): Date {
  const now = new Date();
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
}

export async function detectDevSeedData(): Promise<{ isDevSeed: boolean; reason?: string }> {
  const identity = await db.query.siteSettings.findFirst({
    where: eq(siteSettings.key, "site_identity"),
  });
  const value = identity?.value as { isDevelopmentSeed?: boolean } | undefined;
  if (value?.isDevelopmentSeed) {
    return { isDevSeed: true, reason: "Setările site indică date de dezvoltare (seed)." };
  }

  const [devProduct] = await db
    .select({ id: products.id })
    .from(products)
    .where(sql`${products.name} LIKE '[DEV]%'`)
    .limit(1);

  if (devProduct) {
    return { isDevSeed: true, reason: "Catalogul conține produse marcate [DEV]." };
  }

  return { isDevSeed: false };
}

export async function getAdminDashboardStats() {
  const todayStart = startOfTodayUtc();

  const [orderTotals] = await db
    .select({
      total: count(),
      revenueBani: sum(orders.totalBani),
    })
    .from(orders)
    .where(ne(orders.status, "CANCELLED"));

  const [todayOrders] = await db
    .select({
      total: count(),
      revenueBani: sum(orders.totalBani),
    })
    .from(orders)
    .where(and(gte(orders.createdAt, todayStart), ne(orders.status, "CANCELLED")));

  const statusCounts = await Promise.all(
    ORDER_STATUSES.map(async (status) => {
      const [row] = await db
        .select({ total: count() })
        .from(orders)
        .where(eq(orders.status, status));
      return { status, count: row?.total ?? 0 };
    }),
  );

  const orderCount = orderTotals?.total ?? 0;
  const revenueBani = Number(orderTotals?.revenueBani ?? 0);
  const aovBani = orderCount > 0 ? Math.round(revenueBani / orderCount) : 0;

  const [productStats] = await db
    .select({
      total: count(),
      active: sql<number>`count(*) filter (where ${products.isActive} = true)`,
      lowStock: sql<number>`count(*) filter (where ${products.stockStatus} = 'LOW_STOCK')`,
      madeToOrder: sql<number>`count(*) filter (where ${products.stockStatus} = 'MADE_TO_ORDER')`,
    })
    .from(products);

  const [categoryCount] = await db.select({ total: count() }).from(categories);
  const [customerCount] = await db
    .select({ total: count() })
    .from(users)
    .where(eq(users.role, "CUSTOMER"));

  const [articleStats] = await db
    .select({
      total: count(),
      published: sql<number>`count(*) filter (where ${articles.status} = 'PUBLISHED')`,
      draft: sql<number>`count(*) filter (where ${articles.status} = 'DRAFT')`,
    })
    .from(articles);

  const [showCount] = await db.select({ total: count() }).from(shows);
  const [episodeCount] = await db.select({ total: count() }).from(episodes);

  const devSeed = await detectDevSeedData();

  return {
    orders: {
      total: orderCount,
      today: todayOrders?.total ?? 0,
      revenueLabel: formatRon(revenueBani),
      todayRevenueLabel: formatRon(Number(todayOrders?.revenueBani ?? 0)),
      aovLabel: formatRon(aovBani),
      byStatus: statusCounts,
    },
    products: {
      total: productStats?.total ?? 0,
      active: Number(productStats?.active ?? 0),
      lowStock: Number(productStats?.lowStock ?? 0),
      madeToOrder: Number(productStats?.madeToOrder ?? 0),
    },
    categories: categoryCount?.total ?? 0,
    customers: customerCount?.total ?? 0,
    content: {
      articlesTotal: articleStats?.total ?? 0,
      articlesPublished: Number(articleStats?.published ?? 0),
      articlesDraft: Number(articleStats?.draft ?? 0),
      shows: showCount?.total ?? 0,
      episodes: episodeCount?.total ?? 0,
    },
    devSeed,
  };
}
