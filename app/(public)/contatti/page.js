import Image from "next/image";
import styles from "./contacts.module.css";

import clockOrangeIcon from "@/assets/clock-orange.svg";
import phoneOrangeIcon from "@/assets/phone-orange.svg";
import locationOrangeIcon from "@/assets/location-orange.svg";
import emailOrangeIcon from "@/assets/email-orange.svg";
import Script from "next/script";
import DOMPurify from "isomorphic-dompurify";
import { getTenantDetails, getTenantId } from "@/lib/tenantDetails";

export const metadata = {
  title: "Contatti - All'Amicizia Takeaway",
  description: "Per qualsiasi informazione, non esitare a contattarci!",
  openGraph: {
    title: "Contatti - All'Amicizia Takeaway",
    description: "Per qualsiasi informazione, non esitare a contattarci!",
    url: `${process.env.BASE_URL}/contatti`,
    images: [
      {
        url: "/allamicizia.webp",
        width: 1200,
        height: 630,
        alt: "Contatti All'Amicizia",
      },
    ],
    locale: "it_IT",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Contatti - All'Amicizia Takeaway",
    description: "Per qualsiasi informazione, non esitare a contattarci!",
    images: ["/allamicizia.webp"],
  },
  alternates: {
    canonical: `${process.env.BASE_URL}/contatti`,
  },
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: `${process.env.BASE_URL}`,
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "Contatti",
      item: `${process.env.BASE_URL}/contatti`,
    },
  ],
};

export default async function ContactsPage() {
  const tenantId = await getTenantId();
  const tenantData = await getTenantDetails(tenantId);

  return (
    <main className={styles.contactsPage}>
      <Script
        id="breadcrumb-json-ld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <div className="container">
        <div className={styles.contactsPageHeading}>
          <h1>Contatti</h1>
          <p>Per qualsiasi informazione, non esitare a contattarci!</p>
        </div>
        <div className={styles.contactsInfo}>
          <div className={styles.contactsInfoCol}>
            <ul>
              <li className={styles.contactItem}>
                <Image
                  src={clockOrangeIcon}
                  alt="Orari di apertura"
                  width={50}
                  height={50}
                />
                <div>
                  <p>12:00-14:30 18:30-23:00</p>
                  <p>Lunedì sera chiuso</p>
                </div>
              </li>
              <li className={styles.contactItem}>
                <Image
                  src={phoneOrangeIcon}
                  alt="Telefono"
                  width={50}
                  height={50}
                />
                <p>{tenantData.phone}</p>
              </li>
              <li className={styles.contactItem}>
                <Image
                  src={locationOrangeIcon}
                  alt="Indirizzo"
                  width={50}
                  height={50}
                />
                <div>
                  <p
                    dangerouslySetInnerHTML={{
                      __html: DOMPurify.sanitize(tenantData.address),
                    }}
                  ></p>
                </div>
              </li>
              <li className={styles.contactItem}>
                <Image
                  src={emailOrangeIcon}
                  alt="Email"
                  width={50}
                  height={50}
                />
                <p>{tenantData.email}</p>
              </li>
            </ul>
          </div>
          <div className={styles.contactsInfoCol}>
            <Image
              src="/product-images/test.webp"
              alt="Ristorante Pizzeria All'Amicizia"
              width={500}
              height={500}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
