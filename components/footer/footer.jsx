import Image from "next/image";
import styles from "./footer.module.css";
import DOMPurify from "isomorphic-dompurify";

import Link from "next/link";

export default async function Footer({
  tenantData,
  tenantLogo,
  tenantCategories,
}) {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className={styles.footer}
      aria-label="Informazioni di contatto e link legali"
    >
      <div className={`container ${styles.footerContainer}`}>
        <div className={styles.footerCol}>
          <Image
            src={tenantLogo}
            className={styles.footerLogo}
            alt={`${tenantData.name} | Takeaway | Logo`}
            width={40}
            height={40}
          />
          <p>
            <strong>{tenantData.name}</strong>
          </p>
          <p>
            {tenantData.address} <br /> {tenantData.city} ({tenantData.region}),{" "}
            {tenantData.postal_code}
          </p>
          <p>P.IVA: {tenantData.tax}</p>
        </div>
        <div className={styles.footerCol}>
          <h4>Categorie</h4>
          <ul className={styles.footerLinks}>
            {tenantCategories.map((category) => (
              <li key={category.id}>
                <Link href={`/${category.slug}`}>{category.name}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div className={styles.footerCol}>
          <h4>Link Utili</h4>
          {tenantData.website_url && (
            <a
              href={tenantData.website_url}
              className={styles.footerLinkWebsite}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Visita il nostro sito web"
            >
              Visita il nostro sito
            </a>
          )}
          <ul className={styles.footerLinks}>
            <li>
              <Link href="/contatti">Contatti</Link>
            </li>
            <li>
              <Link href="/privacy">Privacy Policy</Link>
            </li>
            <li>
              <Link href="/cookies">Cookie Policy</Link>
            </li>
            <li>
              <Link href="/termini-e-condizioni">Termini e Condizioni</Link>
            </li>
          </ul>
        </div>
        {tenantData.socials && Object.keys(tenantData.socials).length > 0 && (
          <div className={styles.footerCol}>
            <h4>Seguici su</h4>
            <div className={styles.footerSocials}>
              {tenantData.socials.instagram && (
                <a
                  href={tenantData.socials.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Seguici su Instagram"
                >
                  <InstagramIcon />
                </a>
              )}
              {tenantData.socials.facebook && (
                <a
                  href={tenantData.socials.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Seguici su Facebook"
                >
                  <FacebookIcon />
                </a>
              )}
              {tenantData.socials.tiktok && (
                <a
                  href={tenantData.socials.tiktok}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Seguici su TikTok"
                >
                  <TikTokIcon />
                </a>
              )}
            </div>
          </div>
        )}
      </div>
      <div className="separator-horizontal"></div>
      <div className={`container ${styles.footerBottom}`}>
        <p>
          Made by{" "}
          <a
            href="https://fmerighi.it"
            target="_blank"
            rel="noopener noreferrer"
          >
            FM
          </a>
        </p>
        <p className={styles.footerCopy}>
          &copy; {currentYear} - {tenantData.name} - Tutti i diritti riservati
        </p>
      </div>
    </footer>
  );
}

function InstagramIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="rgb(83, 83, 83)"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="lucide lucide-instagram-icon lucide-instagram"
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="rgb(83, 83, 83)"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="lucide lucide-facebook-icon lucide-facebook"
    >
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

function TikTokIcon() {
  return (
    <svg
      fill="none"
      width="24"
      height="24"
      viewBox="0 0 32 32"
      version="1.1"
      stroke="rgb(83, 83, 83)"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M16.656 1.029c1.637-0.025 3.262-0.012 4.886-0.025 0.054 2.031 0.878 3.859 2.189 5.213l-0.002-0.002c1.411 1.271 3.247 2.095 5.271 2.235l0.028 0.002v5.036c-1.912-0.048-3.71-0.489-5.331-1.247l0.082 0.034c-0.784-0.377-1.447-0.764-2.077-1.196l0.052 0.034c-0.012 3.649 0.012 7.298-0.025 10.934-0.103 1.853-0.719 3.543-1.707 4.954l0.020-0.031c-1.652 2.366-4.328 3.919-7.371 4.011l-0.014 0c-0.123 0.006-0.268 0.009-0.414 0.009-1.73 0-3.347-0.482-4.725-1.319l0.040 0.023c-2.508-1.509-4.238-4.091-4.558-7.094l-0.004-0.041c-0.025-0.625-0.037-1.25-0.012-1.862 0.49-4.779 4.494-8.476 9.361-8.476 0.547 0 1.083 0.047 1.604 0.136l-0.056-0.008c0.025 1.849-0.050 3.699-0.050 5.548-0.423-0.153-0.911-0.242-1.42-0.242-1.868 0-3.457 1.194-4.045 2.861l-0.009 0.030c-0.133 0.427-0.21 0.918-0.21 1.426 0 0.206 0.013 0.41 0.037 0.61l-0.002-0.024c0.332 2.046 2.086 3.59 4.201 3.59 0.061 0 0.121-0.001 0.181-0.004l-0.009 0c1.463-0.044 2.733-0.831 3.451-1.994l0.010-0.018c0.267-0.372 0.45-0.822 0.511-1.311l0.001-0.014c0.125-2.237 0.075-4.461 0.087-6.698 0.012-5.036-0.012-10.060 0.025-15.083z"></path>
    </svg>
  );
}
