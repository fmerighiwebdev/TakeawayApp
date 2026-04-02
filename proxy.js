import { NextResponse } from "next/server";

import {
  isLocalDevelopmentHost,
  normalizeTenantHost,
  resolveTenantIdByHost,
} from "./lib/tenant/tenantHostResolver";

function continueWithTenant(request, tenantId) {
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-tenant-id", tenantId);

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export async function proxy(request) {
  const { pathname } = request.nextUrl;
  const normalizedHost = normalizeTenantHost(
    request.headers.get("x-forwarded-host") || request.headers.get("host"),
  );

  if (pathname.startsWith("/api/cron/clear-orders")) {
    return NextResponse.next();
  }

  if (isLocalDevelopmentHost(normalizedHost)) {
    return continueWithTenant(
      request,
      process.env.LOCAL_TENANT_ID || "default-tenant-id",
    );
  }

  let tenantId = null;

  try {
    tenantId = await resolveTenantIdByHost(normalizedHost);
  } catch (error) {
    console.error("Tenant resolution failed:", error);
    return NextResponse.rewrite(new URL("/not-found", request.url));
  }

  if (!tenantId) {
    return NextResponse.rewrite(new URL("/not-found", request.url));
  }

  return continueWithTenant(request, tenantId);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
