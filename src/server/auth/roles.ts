export function isAdminRole(role: string | null | undefined): boolean {
  return role === "ADMIN";
}

export function hasRole(
  userRole: string | null | undefined,
  required: "CUSTOMER" | "ADMIN",
): boolean {
  if (required === "CUSTOMER") {
    return userRole === "CUSTOMER" || userRole === "ADMIN";
  }
  return userRole === "ADMIN";
}
