import Orders from "@/components/orders/orders";
import styles from "./dashboard.module.css";
import AuthGuard from "@/components/auth-guard/auth-guard";
import { getTenantId } from "@/lib/tenantDetails";
import { getOrdersByTenantId } from "@/lib/orders";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { redirect } from "next/navigation";

export default async function AdminDashboard() {
  const today = new Date();
  const options = { day: "2-digit", month: "long", year: "numeric" };
  const formattedDate = today.toLocaleDateString("it-IT", options);

  const tenantId = getTenantId();
  const cookieStore = cookies();
  const cookieKey = `auth-token-${tenantId}`;
  const token = cookieStore.get(cookieKey)?.value;

  if (!token || !jwt.verify(token, process.env.JWT_SECRET)) {
    redirect("/login");
  }

  const orders = await getOrdersByTenantId(tenantId);

  return (
    <AuthGuard>
      <section className={styles.adminDashboard}>
        <div className={styles.adminDashboardHeading}>
          <h1>Ordini</h1>
          <p>{formattedDate}</p>
        </div>
        <div className="container">
          <Orders orders={orders} />
        </div>
      </section>
    </AuthGuard>
  );
}
