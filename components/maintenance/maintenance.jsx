import Image from "next/image";
import styles from "./maintenance.module.css";

import chandiLogo from "@/assets/chandi-logo.svg";

export default function Maintenance() {
  return (
    <main>
      <div className="container">
        <section className={styles.maintenance}>
          <Image src={chandiLogo} alt="Chandi Logo" />
          <h1>Manutenzione in corso</h1>
          <p>Il sito è in manutenzione, torneremo online il prima possibile.</p>
        </section>
      </div>
    </main>
  );
}
