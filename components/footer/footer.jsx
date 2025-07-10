import Image from "next/image";
import styles from "./footer.module.css";

import chandiLogo from "@/assets/chandi-logo.svg";
import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className={styles.footer}
      aria-label="Informazioni di contatto e link legali"
    >
      <div className={`container ${styles.footerContainer}`}>
        <Image
          src={chandiLogo}
          alt="Asporto - Ristorante Pizzeria All'Amicizia - Chandi Logo"
          width={100}
          height={100}
        />
        <div className={styles.footerText}>
          <p>ALL&apos;AMICIZIA SNC</p>
          <p>DI SINGH SARABJIT & C.</p>
          <p>
            <strong>P.IVA: 01757660228</strong>
          </p>
          <p>Piazza S. Maria Assunta, 2 - Villa Lagarina (TN)</p>
        </div>
        <div className={styles.footerLinks}>
          <a
            href="https://www.singhrestaurant.it"
            target="_blank"
            rel="noopener noreferrer"
            title="Visita il sito web di Ristorante Pizzeria All'Amicizia"
          >
            Sito web
          </a>
          <Link href="/contatti">Contatti</Link>
          <Link href="/privacy">Privacy Cookie Policy</Link>
        </div>
        <p className={styles.footerCopy}>
          &copy; {currentYear} - ALL&apos;AMICIZIA
        </p>
      </div>
    </footer>
  );
}
