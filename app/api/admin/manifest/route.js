import { getTenantAssets, getTenantId, getTenantMetadata, getTenantTheme } from "@/lib/tenantDetails";
import { NextResponse } from "next/server";

export async function GET() {
  const tenantId = await getTenantId();
  const tenantAssets = await getTenantAssets(tenantId);
  const tenantMetadata = await getTenantMetadata(tenantId);
  const tenantTheme = await getTenantTheme(tenantId);

  const manifest = {
    id: "/admin/",
    name: `${tenantMetadata.title} Admin`,
    short_name: `${tenantMetadata.title} Admin`,
    start_url: "/admin/dashboard?source=pwa",
    scope: "/admin/",
    display: "standalone",
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
    theme_color: tenantTheme.primaryColor || "#000000",
    background_color: "#ffffff",
  };

  return NextResponse.json(manifest, {
    headers: {
      "Content-Type": "application/manifest+json",
    },
  });
}
