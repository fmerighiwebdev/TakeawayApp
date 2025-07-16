import Link from "next/link";
import styles from "./page.module.css";

import phoneIcon from "@/assets/phone.svg";

import Image from "next/image";
import Script from "next/script";
import DOMPurify from "isomorphic-dompurify";
import {
  getTenantCategories,
  getTenantDetails,
  getTenantId,
  getTenantTheme,
} from "@/lib/tenantDetails";

export const metadata = {
  title: "Ristorante Pizzeria All'Amicizia - Takeaway",
  description:
    "Ordina online i tuoi piatti preferiti dal Ristorante Pizzeria All'Amicizia. Cucina italiana e indiana, pizze, bevande e molto altro.",
  openGraph: {
    title: "Ristorante Pizzeria All'Amicizia - Takeaway",
    description:
      "Ordina online i tuoi piatti preferiti dal Ristorante Pizzeria All'Amicizia",
    images: [
      {
        url: "/allamicizia.webp",
        width: 1200,
        height: 630,
        alt: "Ristorante Pizzeria All'Amicizia",
      },
    ],
    locale: "it_IT",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ristorante Pizzeria All'Amicizia - Takeaway",
    description:
      "Ordina online i tuoi piatti preferiti dal Ristorante Pizzeria All'Amicizia",
    images: ["/allamicizia.webp"],
  },
  alternates: {
    canonical: process.env.BASE_URL,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Restaurant",
  name: "Ristorante Pizzeria All'Amicizia",
  image: "/allamicizia.webp",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Piazza Santa Maria Assunta 2",
    addressLocality: "Villa Lagarina",
    postalCode: "38060",
    addressRegion: "TN",
    addressCountry: "IT",
  },
  url: `${process.env.BASE_URL}`,
  telephone: "+390464411420",
  servesCuisine: ["Italian", "Indian"],
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      opens: "12:00",
      closes: "14:30",
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      opens: "18:30",
      closes: "23:00",
    },
  ],
};

export default async function Home() {
  const tenantId = await getTenantId();
  const tenantData = await getTenantDetails(tenantId);
  const tenantTheme = await getTenantTheme(tenantId);
  const tenantCategories = await getTenantCategories(tenantId);

  return (
    <main className={styles.hero}>
      <Script
        id="json-ld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <section className={styles.heroHeading}>
        <div className={`container ${styles.heroHeadingContainer}`}>
          <Image
            src={tenantTheme.logoUrl}
            alt={`Takeaway - ${tenantData.name} - Logo`}
            width={100}
            height={100}
            priority
          />
          <div>
            <h1>{tenantData.name}</h1>
            <p
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(tenantData.address),
              }}
            />
            <a
              href={`tel:+39${tenantData.phone}`}
              aria-label={`Chiama il ristorante al numero ${tenantData.phone}`}
            >
              <Image src={phoneIcon} alt="" aria-hidden="true" />
              <span>{tenantData.phone}</span>
            </a>
          </div>
        </div>
      </section>
      <section className={`${styles.heroCategories}`}>
        <div className="container">
          <div className={styles.categoriesContainer}>
            {tenantCategories.map((category) => (
              <div key={category.id} className={styles.heroCategory}>
                <Link href={`/${category.slug}`}>
                  <Image
                    src={category.image_url}
                    alt={`${category.name} - Immagine di categoria`}
                    width={400}
                    height={300}
                  />
                  <div className={styles.categoryOverlay}>
                    <h2>{category.name}</h2>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
