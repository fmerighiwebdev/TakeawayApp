import { getTenantContext, getTenantId } from "@/lib/tenantDetails";
import { NextResponse } from "next/server";

export async function GET() {
  const tenantId = await getTenantId();
  const { assets: tenantAssets, metadata: tenantMetadata, theme: tenantTheme } =
    await getTenantContext(tenantId);

  const manifest = {
    id: "/admin/",
    name: `${tenantMetadata.title} | Gestione ordini`,
    short_name: `${tenantMetadata.title}`,
    description: `${tenantMetadata.title} - Gestisci i tuoi ordini in modo semplice e veloce!`,
    start_url: "/admin/dashboard?source=pwa",
    scope: "/admin/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: tenantTheme.primaryColor || "#000000",
    prefer_related_applications: false,
    icons: [
      {
        src: tenantAssets.webAppManifest192,
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: tenantAssets.webAppManifest512,
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
    ],
  };

  return NextResponse.json(manifest, {
    headers: {
      "Content-Type": "application/manifest+json",
      "Cache-Control": "no-store, max-age=0",
    },
  });
}
