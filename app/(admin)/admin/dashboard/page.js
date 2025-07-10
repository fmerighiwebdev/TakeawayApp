import Orders from "@/components/orders/orders";
import styles from "./dashboard.module.css";
import AuthGuard from "@/components/auth-guard/auth-guard";

export default function AdminDashboard() {
    const today = new Date();
    const options = { day: '2-digit', month: 'long', year: 'numeric' };
    const formattedDate = today.toLocaleDateString('it-IT', options);

    return (
      <AuthGuard>
        <section className={styles.adminDashboard}>
          <div className={styles.adminDashboardHeading}>
            <h1>Ordini</h1>
            <p>{formattedDate}</p>
          </div>
          <div className="container">
            <Orders />
          </div>
        </section>
      </AuthGuard>
    );
}