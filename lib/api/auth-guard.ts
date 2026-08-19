// lib/api/auth-guard.ts

import { Role } from "@prisma/client";
import { getServerSession } from "../get-session";
import { ApiException } from "./api-exception";

export async function requireAuth() {
  const session = await getServerSession();

  if (!session) {
    throw new ApiException(401, "Unauthorized");
  }

  return session;
}

export async function requireRole(allowedRoles: Role[]) {
  const session = await requireAuth();

  const role = session.user.role as Role;

  if (!allowedRoles.includes(role)) {
    throw new ApiException(403, "Forbidden");
  }

  return session;
}


// export async function requireAdmin() {
//   return requireRole([Role.ADMIN]);
// }

// export async function requireCustomer() {
//   return requireRole([Role.CUSTOMER]);
// }

// export async function requireCraftsman() {
//   return requireRole([Role.CRAFTSMAN]);
// }

// Then you can use it like this:

// await requireRole([Role.ADMIN]);

// or

// await requireRole([Role.ADMIN, Role.CRAFTSMAN]);

// or

// await requireRole([Role.CUSTOMER]);