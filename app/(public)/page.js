import Link from "next/link";
import styles from "./page.module.css";

import Image from "next/image";

import {
  getTenantAssets,
  getTenantCategories,
  getTenantDetails,
  getTenantId,
} from "@/lib/tenantDetails";
import { getIcon } from "@/lib/icons";

export const metadata = {
  alternates: {
    canonical: "/",
  },
};

export default async function Home() {
  const tenantId = await getTenantId();
  const tenantData = await getTenantDetails(tenantId);
  const tenantAssets = await getTenantAssets(tenantId);
  const tenantCategories = await getTenantCategories(tenantId);

  const phoneIconUrl = getIcon("phoneIcon");

  return (
    <main className={styles.hero}>
      <section className={styles.heroHeading}>
        <div className={`container ${styles.heroHeadingContainer}`}>
          <Image
            src={tenantAssets.logoUrl}
            alt={`Takeaway - ${tenantData.name} - Logo`}
            width={100}
            height={100}
            priority
          />
          <div>
            <h1>{tenantData.name}</h1>
            <p>{tenantData.address} <br /> {tenantData.city} ({tenantData.region})</p>
            <a
              href={`tel:+39${tenantData.phone}`}
              aria-label={`Chiama il ristorante al numero ${tenantData.phone}`}
            >
              <Image src={phoneIconUrl} alt="" aria-hidden="true" width={32} height={32} />
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
