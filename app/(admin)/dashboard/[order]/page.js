import OrderDetails from "@/components/order-details/order-details";
import styles from "../dashboard.module.css";
import { getOrderByIdWithDetails } from "@/lib/orders";
import { getTenantId } from "@/lib/tenantDetails";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import jwt from "jsonwebtoken";
import { redirect } from "next/navigation";

export default async function OrderPage({ params }) {
    const { order: orderId } = await params;
    const tenantId = getTenantId();
    const cookieStore = cookies();
    const cookieKey = `auth-token-${tenantId}`;
    const token = cookieStore.get(cookieKey)?.value;

    if (!token || !jwt.verify(token, process.env.JWT_SECRET)) {
        redirect("/login");
    }

    const orderDetails = await getOrderByIdWithDetails(tenantId, orderId);

    if (!orderDetails) {
      notFound();
    }

    console.log("Order Details:", orderDetails);

    return (
        <main className={styles.adminDashboard}>
            <div className={styles.adminDashboardHeading}>
                <h1>Ordine n.{orderId}</h1>
            </div>
            <OrderDetails orderDetails={orderDetails} />
        </main>
    );
}