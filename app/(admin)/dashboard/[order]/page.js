import OrderDetails from "@/components/order-details/order-details";
import styles from "../dashboard.module.css";
import { getOrderByIdWithDetails } from "@/lib/orders";
import { getTenantId } from "@/lib/tenantDetails";
import { notFound } from "next/navigation";
import AuthGuard from "@/components/auth-guard/auth-guard";

export default async function OrderPage({ params }) {
    const { order: orderId } = await params;
    const tenantId = getTenantId();

    const orderDetails = await getOrderByIdWithDetails(tenantId, orderId);

    if (!orderDetails) {
      notFound();
    }

    return (
        <AuthGuard>
          <main className={styles.adminDashboard}>
              <div className={styles.adminDashboardHeading}>
                  <h1>Ordine n.{orderId}</h1>
              </div>
              <OrderDetails orderDetails={orderDetails} />
          </main>
        </AuthGuard>
    );
}