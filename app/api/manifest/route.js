import { getTenantAssets, getTenantId, getTenantMetadata, getTenantTheme } from "@/lib/tenantDetails";
import { NextResponse } from "next/server";

export async function GET() {
  const tenantId = await getTenantId();
  const tenantAssets = await getTenantAssets(tenantId);
  const tenantMetadata = await getTenantMetadata(tenantId);
  const tenantTheme = await getTenantTheme(tenantId);

  const manifest = {
    name: `${tenantMetadata.title} Takeaway`,
    short_name: `${tenantMetadata.title}`,
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: tenantTheme.primaryColor || "#000000",
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

  return NextResponse.json(manifest);
}