import AdminForm from "@/components/admin-form/admin-form";
import styles from "./login.module.css";
import { getTenantId } from "@/lib/tenantDetails";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default function AdminPage() {
  const tenantId = await getTenantId();
  const cookieStore = cookies();
  const cookieKey = `auth-token-${tenantId}`;
  const authToken = cookieStore.get(cookieKey)?.value;

  let isAuthenticated = false;

  if (authToken) {
    try {
      jwt.verify(authToken, process.env.JWT_SECRET);
      isAuthenticated = true;
    } catch (error) {
      // Token invalido, non fare nulla
    }
  }

  if (isAuthenticated) {
    redirect("/dashboard");
  }

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
