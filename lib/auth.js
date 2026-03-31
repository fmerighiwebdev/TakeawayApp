import { cookies } from "next/headers";
import { getTenantId } from "@/lib/tenantDetails";

export async function getAdminAuthToken() {
  const tenantId = await getTenantId();
  const cookieStore = await cookies();
  const tokenKey = `auth-token-${tenantId}`;
  return cookieStore.get(tokenKey)?.value ?? null;
}