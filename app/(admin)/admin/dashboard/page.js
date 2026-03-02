import Orders from "@/components/orders";
import AuthGuard from "@/components/auth-guard";
import { getTenantFeatures, getTenantId } from "@/lib/tenantDetails";
import { getTodayOrdersByTenantId } from "@/lib/orders";
import Link from "next/link";
import TodayDate from "@/components/today-date";

export default async function AdminDashboard() {
  const tenantId = await getTenantId();

  const initialOrders = await getTodayOrdersByTenantId(tenantId);
  const tenantFeatures = await getTenantFeatures(tenantId);

  return (
    <AuthGuard>
      <main className="py-24 min-h-dvh">
        <div className="container">
          <section className="w-full max-w-3xl mx-auto">
            <div className="flex flex-col gap-4">
              <div className="flex items-end justify-between">
                <div className="flex flex-col gap-2">
                  <h1 className="text-5xl text-primary font-medium">Ordini</h1>
                  <TodayDate />
                </div>
                {tenantFeatures.pastOrders && (
                  <button className="btn btn-primary btn-sm md:btn-md">
                    <Link href="/dashboard/riepilogo-ordini">
                      Riepilogo ordini
                    </Link>
                  </button>
                )}
              </div>
              <div className="separator-horizontal"></div>
            </div>
            <Orders initialOrders={initialOrders} tenantId={tenantId} />
          </section>
        </div>
      </main>
    </AuthGuard>
  );
}
