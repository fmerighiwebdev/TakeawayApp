import { getTenantContext, getTenantId } from "@/lib/tenantDetails";
import { NextResponse } from "next/server";

export async function GET() {
  const tenantId = await getTenantId();
  const { assets: tenantAssets, metadata: tenantMetadata, theme: tenantTheme } =
    await getTenantContext(tenantId);

  const manifest = {
    id: "/",
    name: `${tenantMetadata.title} | Takeaway`,
    short_name: `${tenantMetadata.title}`,
    description: `${tenantMetadata.title} - Ordina online dal tuo ristorante preferito!`,
    start_url: "/?source=pwa",
    scope: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: tenantTheme.primaryColor || "#000000",
    prefer_related_applications: false,
    icons: [
      {
        src: tenantAssets.webAppManifest192,
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: tenantAssets.webAppManifest512,
        sizes: "512x512",
        type: "image/png",
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
