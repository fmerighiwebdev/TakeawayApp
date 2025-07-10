import Maintenance from "@/components/maintenance/maintenance";
import "./globals.css";

export const metadata = {
  title: "All'Amicizia Takeaway",
  description:
    "Ordina i tuoi piatti preferiti da portare via grazie alla nostra nuova app!",
  /* manifest: "/site.webmanifest", */
  icons: {
    icon: [
      { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico" },
    ],
    apple: "/apple-touch-icon.png",
  },
  appleWebApp: {
    title: "All'Amicizia Takeaway",
  },
};

export default function RootLayout({ children }) {
  const isMaintenance = process.env.NEXT_PUBLIC_MAINTENANCE_MODE === "true";

  return (
    <html lang="it">
      <body>{isMaintenance ? <Maintenance /> : children}</body>
    </html>
  );
}
