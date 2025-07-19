import { NextResponse } from "next/server";
import supabaseServer from "./lib/supabaseServer";

// Middleware per la gestione dei tenant basata sul dominio
// Questo middleware intercetta le richieste e determina il tenant in base al dominio
export async function middleware(request) {
  const { pathname } = request.nextUrl;
  const host = request.headers.get("host") || "";

  console.log("Middleware tenant check for host:", host);

  // Escludo le richieste per CRON-JOB clear-orders bypassando il middleware
  if (pathname.startsWith("/api/cron/clear-orders")) {
    return NextResponse.next();
  }

  // Controlla se il dominio è localhost
  // Se sì, usa un tenant predefinito o quello specificato nell'ambiente
  if (host.startsWith("localhost")) {
    return NextResponse.next({
      headers: {
        "x-tenant-id": process.env.LOCAL_TENANT_ID || "default-tenant-id",
      },
    });
  }

  // Altrimenti, cerca il tenant nel database in base al dominio
  const { data, error } = await supabaseServer
    .from("tenants")
    .select("id")
    .eq("domain", host)
    .single();

  if (error || !data) {
    return NextResponse.rewrite(new URL("/not-found", request.url));
  }

  // Se il tenant è trovato, aggiungi l'ID del tenant agli headers della risposta
  // Questo permette di utilizzare l'ID del tenant in altre parti dell'applicazione
  return NextResponse.next({
    headers: {
      "x-tenant-id": data.id,
    },
  });
}

// Configurazione del matcher per applicare il middleware a tutte le rotte tranne quelle statiche
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
