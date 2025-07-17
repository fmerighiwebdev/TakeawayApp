import Image from "next/image";
import styles from "./contacts.module.css";

import DOMPurify from "isomorphic-dompurify";
import { getTenantDetails, getTenantId } from "@/lib/tenantDetails";
import { getIcon } from "@/lib/icons";

export const metadata = {
  title: "Contatti",
  description: "Per qualsiasi informazione, non esitare a contattarci!",
  alternates: {
    canonical: "/contatti",
  },
};

function BreadcrumbJsonLd({ tenantDetails }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            {
              "@type": "ListItem",
              position: 1,
              name: "Home",
              item: `https://${tenantDetails.domain}`,
            },
            {
              "@type": "ListItem",
              position: 2,
              name: "Contatti",
              item: `https://${tenantDetails.domain}/contatti`,
            },
          ],
        }),
      }}
    />
  );
}

function ContactPageJsonLd({ tenantDetails }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ContactPage",
          name: "Contatti",
          mainEntity: {
            "@type": "Organization",
            name: tenantDetails.name,
            url: `https://${tenantDetails.domain}`,
            contactPoint: {
              "@type": "ContactPoint",
              telephone: `+39${tenantDetails.phone}`,
              contactType: "Customer Service",
              areaServed: "IT",
              availableLanguage: "Italian",
            },
          },
        }),
      }}
    />
  );
}

export default async function ContactsPage() {
  const tenantId = await getTenantId();
  const tenantDetails = await getTenantDetails(tenantId);

  const clockIcon = getIcon("clockIcon");
  const phoneIcon = getIcon("phoneIcon");
  const locationIcon = getIcon("locationIcon");
  const emailIcon = getIcon("emailIcon");

  return (
    <>
      <BreadcrumbJsonLd tenantDetails={tenantDetails} />
      <ContactPageJsonLd tenantDetails={tenantDetails} />
      <main className={styles.contactsPage}>
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
                    src={clockIcon}
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
                    src={phoneIcon}
                    alt="Telefono"
                    width={50}
                    height={50}
                  />
                  <p>{tenantDetails.phone}</p>
                </li>
                <li className={styles.contactItem}>
                  <Image
                    src={locationIcon}
                    alt="Indirizzo"
                    width={50}
                    height={50}
                  />
                  <div>
                    <p
                      dangerouslySetInnerHTML={{
                        __html: DOMPurify.sanitize(tenantDetails.address),
                      }}
                    ></p>
                  </div>
                </li>
                <li className={styles.contactItem}>
                  <Image src={emailIcon} alt="Email" width={50} height={50} />
                  <p>{tenantDetails.email}</p>
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
    </>
  );
}
