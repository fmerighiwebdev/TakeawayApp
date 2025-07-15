import AdminForm from "@/components/admin-form/admin-form";
import styles from "./admin.module.css";
import { getTenantId } from "@/lib/tenantDetails";

export default function AdminPage() {

  const tenantId = getTenantId();

  return (
    <main className={styles.adminPage}>
      <h1>Gestione Ordini</h1>
      <div className="container">
        <section className={styles.formWrapper}>
          <AdminForm tenantId={tenantId} />
        </section>
      </div>
    </main>
  );
}
