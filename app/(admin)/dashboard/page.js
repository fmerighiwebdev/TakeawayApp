import Orders from "@/components/orders";
import styles from "./dashboard.module.css";
import AuthGuard from "@/components/auth-guard";
import { getTenantId } from "@/lib/tenantDetails";
import { getOrdersByTenantId } from "@/lib/orders";

export default async function AdminDashboard() {
  const today = new Date();
  const options = { day: "2-digit", month: "long", year: "numeric" };
  const formattedDate = today.toLocaleDateString("it-IT", options);

  const tenantId = await getTenantId();

  const initialOrders = await getOrdersByTenantId(tenantId);

  return (
    <AuthGuard>
      <main className="py-24 min-h-dvh">
        <div className="container">
          <section className="w-full max-w-3xl mx-auto">
            <div className="flex flex-col gap-2">
              <h1 className="text-5xl text-primary font-medium">Ordini</h1>
              <p className="text-2xl text-(--muted-light-text)">
                {formattedDate}
              </p>
              <div className="separator-horizontal"></div>
            </div>
            <Orders initialOrders={initialOrders} tenantId={tenantId} />
          </section>
        </div>
      </main>
    </AuthGuard>
  );
}
