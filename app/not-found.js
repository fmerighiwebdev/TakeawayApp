import Link from "next/link";
import styles from "./not-found.module.css";

export default function NotFound() {
  return (
    <main className={styles.notFoundPage}>
      <section aria-label="Pagina non trovata">
          <h1>404</h1>
          <p>La pagina che stai cercando non esiste.</p>
      </section>
      <Link href="/">Torna alla home</Link>
    </main>
  );
}