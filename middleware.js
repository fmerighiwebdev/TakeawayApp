import { NextResponse } from "next/server";
import axios from "axios";

// Middleware per risolvere il tenant in base al dominio
export async function middleware(request) {
  const host = request.headers.get("host") || "";

  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/api/resolve-tenant?domain=${host}`
    );

    if (response.status === 404) {
      return NextResponse.rewrite(new URL("/not-found", request.url));
    }

    const tenantData = response.data;

    const nextResponse = NextResponse.next();
    nextResponse.headers.set("x-tenant-id", tenantData.id);
    return nextResponse;
  } catch (error) {
    console.error("Error resolving tenant:", error);
    return NextResponse.rewrite(new URL("/not-found", request.url));
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
