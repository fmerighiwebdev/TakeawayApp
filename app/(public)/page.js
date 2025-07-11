import Link from "next/link";
import styles from "./page.module.css";

import chandiLogo from "@/assets/chandi-logo.svg";
import phoneIcon from "@/assets/phone.svg";

import Image from "next/image";
import Script from "next/script";
import { headers } from "next/headers";
import supabase from "@/lib/supabaseClient";

export const metadata = {
  title: "Ristorante Pizzeria All'Amicizia - Takeaway",
  description: "Ordina online i tuoi piatti preferiti dal Ristorante Pizzeria All'Amicizia. Cucina italiana e indiana, pizze, bevande e molto altro.",
  openGraph: {
    title: "Ristorante Pizzeria All'Amicizia - Takeaway",
    description: "Ordina online i tuoi piatti preferiti dal Ristorante Pizzeria All'Amicizia",
    images: [
      {
        url: '/allamicizia.webp',
        width: 1200,
        height: 630,
        alt: "Ristorante Pizzeria All'Amicizia"
      }
    ],
    locale: 'it_IT',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Ristorante Pizzeria All'Amicizia - Takeaway",
    description: "Ordina online i tuoi piatti preferiti dal Ristorante Pizzeria All'Amicizia",
    images: ['/allamicizia.webp'],
  },
  alternates: {
    canonical: process.env.BASE_URL
  }
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Restaurant",
  "name": "Ristorante Pizzeria All'Amicizia",
  "image": "/allamicizia.webp",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Piazza Santa Maria Assunta 2",
    "addressLocality": "Villa Lagarina",
    "postalCode": "38060",
    "addressRegion": "TN",
    "addressCountry": "IT"
  },
  "url": `${process.env.BASE_URL}`,
  "telephone": "+390464411420",
  "servesCuisine": ["Italian", "Indian"],
  "openingHoursSpecification": [
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      "opens": "12:00",
      "closes": "14:30"
    },
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      "opens": "18:30",
      "closes": "23:00"
    }
  ]
};

export default async function Home() {
  const tenantId = (await headers()).get("x-tenant-id");

  const { data: tenant, error: tenantError } = await supabase
    .from("tenants")
    .select("name, address, phone, theme")
    .eq("id", tenantId)
    .single();

  if (tenantError || !tenant) {
    console.error("Error fetching tenant data:", tenantError);
  }

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
            src={tenant.theme.logoUrl}
            alt={`Takeaway - ${tenant.name} - Logo`}
            width={100}
            height={100}
            priority
          />
          <div>
            <h1>{tenant.name}</h1>
            <p>{tenant.address}</p>
            <a
              href={`tel:+39${tenant.phone}`}
              aria-label={`Chiama il ristorante al numero ${tenant.phone}`}
            >
              <Image src={phoneIcon} alt="" aria-hidden="true" />
              <span>{tenant.phone}</span>
            </a>
          </div>
        </div>
      </section>
      <section className={`${styles.heroCategories}`}>
        <div className="container">
          <div className={styles.categoriesContainer}>
            <div className={styles.heroCategory}>
              <Link href="/pizzeria">
                <Image
                  src="/category-images/pizzeria.jpg"
                  alt="Pizzeria - Pizze variegate"
                  width={400}
                  height={300}
                />
                <div className={styles.categoryOverlay}>
                  <h2>Pizzeria</h2>
                </div>
              </Link>
            </div>
            <div className={styles.heroCategory}>
              <Link href="/cucina-indiana">
                <Image
                  src="/category-images/cucina-indiana.webp"
                  alt="Cucina Indiana - Piatti speziati e autentici"
                  width={400}
                  height={300}
                />
                <div className={styles.categoryOverlay}>
                  <h2>Cucina Indiana</h2>
                </div>
              </Link>
            </div>
            <div className={styles.heroCategory}>
              <Link href="/cucina-italiana">
                <Image
                  src="/category-images/cucina-italiana.webp"
                  alt="Cucina Italiana - Tradizione e gusto"
                  width={400}
                  height={300}
                />
                <div className={styles.categoryOverlay}>
                  <h2>Cucina Italiana</h2>
                </div>
              </Link>
            </div>
            <div className={styles.heroCategory}>
              <Link href="/bevande">
                <Image
                  src="/category-images/bevande.webp"
                  alt="Bevande - Bibite e bevande alcoliche"
                  width={400}
                  height={300}
                />
                <div className={styles.categoryOverlay}>
                  <h2>Bevande</h2>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}