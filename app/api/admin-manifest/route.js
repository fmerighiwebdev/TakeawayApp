import { NextResponse } from 'next/server';

export async function GET() {
  const manifest = {
    name: "All'Amicizia Admin",
    short_name: "All'Amicizia Admin",
    start_url: "/admin/dashboard",
    scope: "/admin/",
    display: "standalone",
    icons: [
        {
        "src": "/web-app-manifest-192x192.png",
        "sizes": "192x192",
        "type": "image/png",
        "purpose": "any"
        },
        {
        "src": "/web-app-manifest-512x512.png",
        "sizes": "512x512",
        "type": "image/png",
        "purpose": "any"
        }
    ],
    theme_color: "#000000", // Colore tema specifico admin
    background_color: "#ffffff" // Colore sfondo splash screen admin
  };

  return NextResponse.json(manifest, {
    headers: {
      'Content-Type': 'application/manifest+json',
    },
  });
}