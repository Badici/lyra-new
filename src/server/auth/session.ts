import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/server/auth";
import type { UserRole } from "@/lib/constants";
import { isAdminRole } from "@/server/auth/roles";

export async function getSession() {
  return auth.api.getSession({
    headers: await headers(),
  });
}

export async function requireSession() {
  const session = await getSession();
  if (!session) {
    redirect("/cont?mode=login");
  }
  return session;
}

export async function requireRole(role: UserRole) {
  const session = await requireSession();
  const userRole = (session.user as { role?: string }).role ?? "CUSTOMER";
  if (userRole !== role && !(role === "CUSTOMER" && userRole === "ADMIN")) {
    if (role === "ADMIN") {
      redirect("/");
    }
    redirect("/cont");
  }
  return session;
}

export async function requireAdmin() {
  return requireRole("ADMIN");
}

export { isAdminRole };
