import Maintenance from "@/components/maintenance";
import "./globals.css";

import {
  getTenantAssets,
  getTenantCompletion,
  getTenantDetails,
  getTenantId,
  getTenantMetadata,
  getTenantTheme,
} from "@/lib/tenantDetails";

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
  const tenantAssets = await getTenantAssets(tenantId);
  const tenantMetadata = await getTenantMetadata(tenantId);
  const tenantDetails = await getTenantDetails(tenantId);

  return {
    title: {
      default: `${tenantMetadata.title} | Takeaway`,
      template: `%s | ${tenantMetadata.title} | Takeaway`,
    },
    description: tenantMetadata.description,
    metadataBase: new URL(`https://${tenantDetails.domain}`),
    icons: {
      icon: [
        { url: tenantAssets.favicon96 || "/favicon-96x96.png" },
        { url: tenantAssets.faviconIco || "/favicon.ico" },
        { url: tenantAssets.faviconSvg || "/favicon.svg" },
      ],
      apple: tenantAssets.appleTouchIconUrl || "/apple-touch-icon.png",
      shortcut: tenantAssets.shortcutIconUrl || "/shortcut-icon.png",
    },
    appleWebApp: {
      title: `${tenantMetadata.title}`,
      statusBarStyle: "default",
      capable: true,
      navigationBarColor: tenantAssets.primaryColor || "#000000",
    },
    openGraph: {
      title: `${tenantMetadata.title} | Takeaway`,
      description: tenantMetadata.description,
      url: `https://${tenantDetails.domain}`,
      type: "website",
      locale: "it_IT",
      images: [
        {
          url: tenantAssets.ogImage || "/default-og.webp",
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

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

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
          image: tenantAssets.ogImage || "/default-og.webp",
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
          image: tenantAssets.ogImage || "/default-og.webp",
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
          image: tenantAssets.ogImage || "/default-og.webp",
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
  const tenantTheme = await getTenantTheme(tenantId);
  const tenantAssets = await getTenantAssets(tenantId);
  const tenantDetails = await getTenantDetails(tenantId);

  const isCompleted = await getTenantCompletion(tenantId);
  const isActive = tenantDetails.active && isCompleted;

  const fontKey = tenantTheme.fontKey || "clean";
  const selectedFonts = fontThemes[fontKey] || fontThemes["clean"];

  const primaryColorDark = `color-mix(in srgb, ${tenantTheme.primaryColor} 80%, black 20%)`;
  const secondaryColorDark = `color-mix(in srgb, ${tenantTheme.secondaryColor} 80%, black 20%)`;

  return (
    <html
      lang="it"
      className={`${selectedFonts.heading.variable} ${selectedFonts.body.variable}`}
    >
      <body
        style={{
          "--color-primary": tenantTheme.primaryColor || "#000000",
          "--color-primary-content": "#ffffffe0",
          "--color-secondary": tenantTheme.secondaryColor || "#ffffff",
          "--color-secondary-content": "#000000e0",
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
