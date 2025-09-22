import Image from "next/image";
import styles from "./maintenance.module.css";
import { getTenantAssets, getTenantId } from "@/lib/tenantDetails";

export default async function Maintenance() {

  const tenantId = await getTenantId();
  const tenantAssets = await getTenantAssets(tenantId);

  console.log(tenantAssets);

  return (
    <main>
      <div className="container">
        <section className={styles.maintenance}>
          <Image 
            src={tenantAssets.logoUrl}
            alt="Applicazione disattivata"
            width={400}
            height={400}
          />
          <h1>Applicazione non disponibile</h1>
          <p>L&apos;applicazione è temporaneamente non disponibile. <br /> Ci scusiamo per l&apos;inconveniente. <br /> Torneremo al più presto.</p>
        </section>
      </div>
    </main>
  );
}
