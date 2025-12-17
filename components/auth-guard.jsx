import { getTenantId } from "@/lib/tenantDetails";
import { redirect } from "next/navigation";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export default async function AuthGuard({ children }) {
  const tenantId = await getTenantId();
  const cookieStore = await cookies();
  const tokenKey = `auth-token-${tenantId}`;
  const authToken = cookieStore.get(tokenKey)?.value;

  if (!authToken) {
    redirect("/login");
  }

  try {
    jwt.verify(authToken, process.env.JWT_SECRET);
  } catch (error) {
    redirect("/login");
  }

  return <>{children}</>;
}
