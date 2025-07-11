import Maintenance from "@/components/maintenance/maintenance";
import "./globals.css";

import supabase from "@/lib/supabaseClient";
import { getTenantId, getTenantTheme } from "@/lib/tenantDetails";

import {
  Montserrat,
  Open_Sans,
  Playfair_Display,
  Lato,
  Poppins,
  Roboto,
  Abril_Fatface,
  Source_Sans_3,
  Quicksand,
  Nunito,
  Raleway,
  Noto_Sans,
  Merriweather,
  PT_Sans,
  Work_Sans,
  Assistant,
  Oswald,
  Mulish,
  Bitter,
  Karla,
} from "next/font/google";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--ffHeading",
  display: "swap",
});

const openSans = Open_Sans({
  subsets: ["latin"],
  variable: "--ffBody",
  display: "swap",
});

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  variable: "--ffHeading",
  display: "swap",
});

const lato = Lato({
  subsets: ["latin"],
  variable: "--ffBody",
  display: "swap",
  weight: ["100", "300", "400", "700", "900"],
});

const poppins = Poppins({
  subsets: ["latin"],
  variable: "--ffHeading",
  display: "swap",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

const roboto = Roboto({
  subsets: ["latin"],
  variable: "--ffBody",
  display: "swap",
});

const abrilFatface = Abril_Fatface({
  subsets: ["latin"],
  variable: "--ffHeading",
  display: "swap",
  weight: "400",
});

const sourceSans3 = Source_Sans_3({
  subsets: ["latin"],
  variable: "--ffBody",
  display: "swap",
});

const quicksand = Quicksand({
  subsets: ["latin"],
  variable: "--ffHeading",
  display: "swap",
});

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--ffBody",
  display: "swap",
});

const raleway = Raleway({
  subsets: ["latin"],
  variable: "--ffHeading",
  display: "swap",
});

const notoSans = Noto_Sans({
  subsets: ["latin"],
  variable: "--ffBody",
  display: "swap",
});

const merriweather = Merriweather({
  subsets: ["latin"],
  variable: "--ffHeading",
  display: "swap",
  weight: ["300", "400", "700", "900"],
});

const ptSans = PT_Sans({
  subsets: ["latin"],
  variable: "--ffBody",
  display: "swap",
  weight: ["400", "700"],
});

const workSans = Work_Sans({
  subsets: ["latin"],
  variable: "--ffHeading",
  display: "swap",
});

const assistant = Assistant({
  subsets: ["latin"],
  variable: "--ffBody",
  display: "swap",
});

const oswald = Oswald({
  subsets: ["latin"],
  variable: "--ffHeading",
  display: "swap",
});

const mulish = Mulish({
  subsets: ["latin"],
  variable: "--ffBody",
  display: "swap",
});

const bitter = Bitter({
  subsets: ["latin"],
  variable: "--ffHeading",
  display: "swap",
});

const karla = Karla({
  subsets: ["latin"],
  variable: "--ffBody",
  display: "swap",
});

const fontThemes = {
  clean: {
    heading: montserrat,
    body: openSans,
  },
  classic: {
    heading: playfairDisplay,
    body: lato,
  },
  modern: {
    heading: poppins,
    body: roboto,
  },
  elegant: {
    heading: abrilFatface,
    body: sourceSans3,
  },
  casual: {
    heading: quicksand,
    body: nunito,
  },
  minimal: {
    heading: raleway,
    body: notoSans,
  },
  rustic: {
    heading: merriweather,
    body: ptSans,
  },
  vintage: {
    heading: workSans,
    body: assistant,
  },
  bold: {
    heading: oswald,
    body: mulish,
  },
  playful: {
    heading: bitter,
    body: karla,
  },
}

export const metadata = {
  title: "All'Amicizia Takeaway",
  description:
    "Ordina i tuoi piatti preferiti da portare via grazie alla nostra nuova app!",
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

export default async function RootLayout({ children }) {
  const isMaintenance = process.env.NEXT_PUBLIC_MAINTENANCE_MODE === "true";

  const tenantId = getTenantId();
  const tenantTheme = await getTenantTheme(tenantId);

  const fontKey = tenantTheme.fontKey || "clean";
  const selectedFonts = fontThemes[fontKey] || fontThemes["clean"];

  return (
    <html lang="it" className={`${selectedFonts.heading.variable} ${selectedFonts.body.variable}`}>
      <body style={{ "--primaryColor": tenantTheme.primaryColor || "#000000", "--secondaryColor": tenantTheme.secondaryColor || "#ffffff" }}>
        {isMaintenance ? <Maintenance /> : children}
      </body>
    </html>
  );
}
