import OrderDetails from "@/components/order-details/order-details";
import styles from "../dashboard.module.css";

export default async function OrderPage({ params }) {
    const { order: orderId } = await params;

    return (
        <main className={styles.adminDashboard}>
            <div className={styles.adminDashboardHeading}>
                <h1>Ordine n.{orderId}</h1>
            </div>
            <OrderDetails orderId={orderId} />
        </main>
    );
}