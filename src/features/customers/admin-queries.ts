import { desc, eq } from "drizzle-orm";
import { db } from "@/db/client";
import { addresses, orders, users } from "@/db/schema";

const customerColumns = {
  id: true,
  name: true,
  email: true,
  emailVerified: true,
  image: true,
  role: true,
  phone: true,
  banned: true,
  createdAt: true,
  updatedAt: true,
} as const;

export async function getAdminCustomers() {
  return db.query.users.findMany({
    where: eq(users.role, "CUSTOMER"),
    columns: customerColumns,
    orderBy: [desc(users.createdAt)],
  });
}

export async function getAdminCustomerById(id: string) {
  const customer = await db.query.users.findFirst({
    where: eq(users.id, id),
    columns: customerColumns,
  });

  if (!customer || customer.role !== "CUSTOMER") {
    return null;
  }

  const customerOrders = await db.query.orders.findMany({
    where: eq(orders.userId, id),
    orderBy: [desc(orders.createdAt)],
    limit: 20,
  });

  const customerAddresses = await db.query.addresses.findMany({
    where: eq(addresses.userId, id),
    orderBy: [desc(addresses.isDefault), desc(addresses.updatedAt)],
  });

  return {
    customer,
    orders: customerOrders,
    addresses: customerAddresses,
  };
}
