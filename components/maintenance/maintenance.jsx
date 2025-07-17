import Image from "next/image";
import styles from "./maintenance.module.css";

export default function Maintenance() {
  return (
    <main>
      <div className="container">
        <section className={styles.maintenance}>
          <h1>Manutenzione in corso</h1>
          <p>Il sito è in manutenzione, torneremo online il prima possibile.</p>
        </section>
      </div>
    </main>
  );
}
