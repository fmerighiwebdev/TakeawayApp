import Maintenance from "@/components/layout/maintenance";
import "./globals.css";

import {
  getTenantContext,
  getTenantId,
} from "@/lib/tenant/tenantDetails";

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
import { Toaster } from "@/components/ui/sonner";
import CookieBanner from "@/components/layout/cookie-banner";
import { TooltipProvider } from "@/components/ui/tooltip";

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
};

export async function generateMetadata() {
  const tenantId = await getTenantId();
  const { tenantDetails, assets: tenantAssets, metadata: tenantMetadata } =
    await getTenantContext(tenantId);

  return {
    title: {
      default: `${tenantMetadata.title} | Takeaway`,
      template: `%s | ${tenantMetadata.title} | Takeaway`,
    },
    description: tenantMetadata.description,
    metadataBase: new URL(`https://${tenantDetails.domain}`),
    icons: {
      icon: [
        { url: tenantAssets.favicon96 },
        { url: tenantAssets.faviconIco },
        { url: tenantAssets.faviconSvg },
      ],
      apple: tenantAssets.appleTouchIconUrl,
      shortcut: tenantAssets.shortcutIconUrl,
    },
    appleWebApp: {
      title: `${tenantMetadata.title} | Takeaway`,
      statusBarStyle: "default",
      capable: true,
    },
    openGraph: {
      title: `${tenantMetadata.title} | Takeaway`,
      description: tenantMetadata.description,
      url: `https://${tenantDetails.domain}`,
      type: "website",
      locale: "it_IT",
      images: [
        {
          url: tenantAssets.ogImage,
          width: 1200,
          height: 630,
          alt: `${tenantMetadata.title} | Takeaway`,
        },
      ],
      siteName: tenantMetadata.title,
    },
    twitter: {
      card: "summary_large_image",
      title: `${tenantMetadata.title} | Takeaway`,
      description: tenantMetadata.description,
      images: [tenantAssets.ogImage],
    },
  };
}

export async function generateViewport() {
  const tenantId = await getTenantId();
  const { theme: tenantTheme } = await getTenantContext(tenantId);

  return {
    width: "device-width",
    initialScale: 1,
    themeColor: tenantTheme.primaryColor || "#000000",
  };
}

function WebsiteJsonLd({ tenantDetails, tenantAssets }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: tenantDetails.name,
          url: `https://${tenantDetails.domain}`,
          description: tenantDetails.description,
          image: tenantAssets.ogImage,
        }),
      }}
    />
  );
}

function WebApplicationJsonLd({ tenantDetails, tenantAssets }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebApplication",
          name: tenantDetails.name,
          url: `https://${tenantDetails.domain}`,
          description: tenantDetails.description,
          image: tenantAssets.ogImage,
          applicationCategory: "FoodOrdering",
          operatingSystem: "All",
          browserRequirements: "JavaScript richiesto",
        }),
      }}
    />
  );
}

function RestaurantJsonLd({ tenantDetails, tenantAssets }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Restaurant",
          name: tenantDetails.name,
          image: tenantAssets.ogImage,
          address: {
            "@type": "PostalAddress",
            streetAddress: tenantDetails.address,
            addressLocality: tenantDetails.city,
            postalCode: tenantDetails.postal_code,
            addressRegion: tenantDetails.region,
            addressCountry: "IT",
          },
          url: `https://${tenantDetails.domain}`,
          telephone: tenantDetails.phone,
          email: tenantDetails.email,
          servesCuisine: tenantDetails.cuisine || ["Italian"],
        }),
      }}
    />
  );
}

export default async function RootLayout({ children }) {
  const tenantId = await getTenantId();
  const tenantContext = await getTenantContext(tenantId);
  const tenantTheme = tenantContext.theme;
  const tenantAssets = tenantContext.assets;
  const tenantDetails = tenantContext.tenantDetails;
  const isCompleted = tenantContext.isCompleted;
  const isActive = tenantDetails.active && isCompleted;

  const fontKey = tenantTheme.fontKey || "clean";
  const selectedFonts = fontThemes[fontKey] || fontThemes["clean"];
  const fontColorPrimary = tenantTheme.fontColorPrimary || "dark";
  const fontColorSecondary = tenantTheme.fontColorSecondary || "dark";

  const primaryContent = fontColorPrimary === "dark" ? "#0F172A" : "#F8FAFC";
  const secondaryContent = fontColorSecondary === "dark" ? "#0F172A" : "#F8FAFC";

  return (
    <html
      lang="it"
      className={`${selectedFonts.heading.variable} ${selectedFonts.body.variable}`}
    >
      <body
        style={{
          "--color-primary": tenantTheme.primaryColor || "#000000",
          "--color-primary-content": primaryContent,
          "--color-secondary": tenantTheme.secondaryColor || "#ffffff",
          "--color-secondary-content": secondaryContent,
        }}
      >
        <WebsiteJsonLd
          tenantDetails={tenantDetails}
          tenantAssets={tenantAssets}
        />
        <WebApplicationJsonLd
          tenantDetails={tenantDetails}
          tenantAssets={tenantAssets}
        />
        <RestaurantJsonLd
          tenantDetails={tenantDetails}
          tenantAssets={tenantAssets}
        />
        {!isActive ? <Maintenance /> : children}
        <Toaster position="top-center" richColors expand={true} theme="light" />
      </body>
    </html>
  );
}
