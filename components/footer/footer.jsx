import Image from "next/image";
import styles from "./footer.module.css";
import DOMPurify from "isomorphic-dompurify";

import Link from "next/link";

export default function Footer({ tenantData, tenantLogo }) {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className={styles.footer}
      aria-label="Informazioni di contatto e link legali"
    >
      <div className={`container ${styles.footerContainer}`}>
        <Image
          src={tenantLogo}
          alt={`Asporto ${tenantData.name} Logo`}
          width={40}
          height={40}
        />
        <div className={styles.footerText}>
          <p
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(tenantData.legal_name),
            }}
          />
          <p>
            <strong>P.IVA: {tenantData.tax}</strong>
          </p>
          <p>
            {tenantData.address} <br /> {tenantData.city} ({tenantData.region})
          </p>
        </div>
        <div className={styles.footerLinks}>
          {tenantData.website_url && (
            <a
              href={tenantData.website_url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Visita il sito web di ${tenantData.name}`}
            >
              Sito web
            </a>
          )}
          <Link href="/contatti">Contatti</Link>
          <Link href="/privacy">Privacy Cookie Policy</Link>
        </div>
        <p className={styles.footerCopy}>
          &copy; {currentYear} - {tenantData.name} - Tutti i diritti riservati
        </p>
      </div>
    </footer>
  );
}
