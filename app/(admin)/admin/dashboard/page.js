import Orders from "@/components/orders";
import AuthGuard from "@/components/auth-guard";
import { getTenantFeatures, getTenantId } from "@/lib/tenantDetails";
import { getTodayOrdersByTenantId } from "@/lib/orders";
import Link from "next/link";
import TodayDate from "@/components/today-date";
import { DashboardMenu } from "@/components/dashboard-menu";

export default async function AdminDashboard() {
  const tenantId = await getTenantId();

  const initialOrders = await getTodayOrdersByTenantId(tenantId);
  const tenantFeatures = await getTenantFeatures(tenantId);

  let menuItems = [
    { name: "Riepilogo ordini", href: "/admin/dashboard/riepilogo-ordini" },
    { name: "Statistiche", href: "/admin/dashboard/statistiche" },
  ];

  if (!tenantFeatures.pastOrders) {
    menuItems = menuItems.filter(
      (item) => item.href !== "/admin/dashboard/riepilogo-ordini",
    );
  }

  if (!tenantFeatures.topProducts) {
    menuItems = menuItems.filter(
      (item) => item.href !== "/admin/dashboard/statistiche",
    );
  }

  return (
    <AuthGuard>
      <main className="pt-20 pb-24 lg:pt-16 min-h-dvh">
        <div className="container">
          <section className="w-full max-w-3xl mx-auto">
            <div className="flex flex-col gap-4">
              <div className="flex items-end justify-between">
                <div className="flex flex-col gap-2">
                  <h1 className="text-5xl text-primary font-medium">Ordini</h1>
                  <TodayDate />
                </div>
                {menuItems.length > 0 && (
                  <div className="flex items-center gap-2">
                    <DashboardMenu menuItems={menuItems} />
                  </div>
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
