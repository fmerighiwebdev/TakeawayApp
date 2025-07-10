import AdminForm from "@/components/admin-form/admin-form";
import styles from "./admin.module.css";

export default function AdminPage() {
  return (
    <main className={styles.adminPage}>
      <h1>Gestione Ordini</h1>
      <div className="container">
        <section className={styles.formWrapper}>
          <AdminForm />
        </section>
      </div>
    </main>
  );
}
