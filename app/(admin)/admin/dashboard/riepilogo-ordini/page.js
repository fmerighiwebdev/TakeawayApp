import AuthGuard from "@/components/auth-guard";
import ExportOrdersCsv from "@/components/export-orders-csv";
import Order from "@/components/order";
import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import FloatingBack from "@/components/ui/floating-back";
import { getPastOrdersByTenantId } from "@/lib/orders";
import { getTenantFeatures, getTenantId } from "@/lib/tenantDetails";
import { CheckCheck, Clock, HandPlatter } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

function getWeekOfMonth(date) {
  const day = date.getDate(); // 1..31
  return Math.floor((day - 1) / 7) + 1; // 1..5
}

function formatRangeForWeek(year, monthIndex, week) {
  const startDay = (week - 1) * 7 + 1;
  const endDay = Math.min(
    week * 7,
    new Date(year, monthIndex + 1, 0).getDate()
  );

  const start = new Date(year, monthIndex, startDay);
  const end = new Date(year, monthIndex, endDay);

  const fmt = (d) =>
    d.toLocaleDateString("it-IT", { day: "2-digit", month: "short" });

  return `${fmt(start)} – ${fmt(end)}`;
}

function groupOrdersByWeekOfMonth(orders) {
  const grouped = new Map();

  for (const order of orders) {
    const d = new Date(order.created_at);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
      2,
      "0"
    )}-W${getWeekOfMonth(d)}`;

    if (!grouped.has(key)) grouped.set(key, []);
    grouped.get(key).push(order);
  }

  const result = Array.from(grouped.entries())
    .sort((a, b) => b[0].localeCompare(a[0]))
    .map(([key, items]) => {
      items.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      const d = new Date(items[0].created_at);
      const week = getWeekOfMonth(d);
      return {
        key,
        title: `Settimana ${week} (${formatRangeForWeek(
          d.getFullYear(),
          d.getMonth(),
          week
        )})`,
        orders: items,
      };
    });

  return result;
}

export default async function RiepilogoOrdiniPage() {
  const tenantId = await getTenantId();
  const tenantFeatures = await getTenantFeatures(tenantId);

  if (!tenantFeatures.pastOrders) {
    notFound();
  }

  const pastOrders = await getPastOrdersByTenantId(tenantId);

  const grouped = groupOrdersByWeekOfMonth(pastOrders);

  return (
    <AuthGuard>
      <main className="pt-20 pb-24 lg:pt-16 min-h-dvh">
        <div className="container">
          <section className="w-full max-w-3xl mx-auto">
            <div className="flex flex-col gap-4">
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                      <Link href="/admin/dashboard" className="text-md md:text-lg">
                        Dashboard
                      </Link>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <span className="text-md md:text-lg text-primary font-semibold">
                      Riepilogo ordini
                    </span>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
              <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4">
                <div className="flex flex-col gap-4">
                  <h1 className="text-5xl text-primary font-medium">
                    Riepilogo ordini
                  </h1>
                  <p className="text-lg md:text-xl text-(--muted-light-text)">
                    Elenco di tutti gli ordini del mese attuale
                  </p>
                </div>
                <ExportOrdersCsv />
              </div>
              <div className="separator-horizontal"></div>

              <div className="flex flex-col gap-8">
                {grouped.map((group) => (
                  <div key={group.key} className="flex flex-col gap-3">
                    <h2 className="text-2xl md:text-3xl text-(--muted-text)">
                      {group.title}
                    </h2>
                    <div className="flex flex-col gap-3">
                      {group.orders.map((o) => (
                        <Order
                          key={o.id}
                          order={o}
                          numberOfItems={o.order_items.length}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </main>
      <FloatingBack href="/admin/dashboard" />
    </AuthGuard>
  );
}
