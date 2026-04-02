import AdminPagination from "@/components/admin/dashboard/admin-pagination";
import AuthGuard from "@/components/admin/auth/auth-guard";
import ExportOrdersCsv from "@/components/admin/orders/export-orders-csv";
import Order from "@/components/admin/orders/order";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import FloatingBack from "@/components/ui/floating-back";
import { normalizePage, normalizeSearchTerm } from "@/lib/shared/listing";
import { getPastOrdersByTenantId } from "@/lib/orders/orders";
import { getTenantFeatures, getTenantId } from "@/lib/tenant/tenantDetails";
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

function getCurrentMonthLabel() {
  return new Intl.DateTimeFormat("it-IT", {
    month: "long",
    year: "numeric",
    timeZone: "Europe/Rome",
  }).format(new Date());
}

export default async function RiepilogoOrdiniPage({ searchParams }) {
  const resolvedSearchParams = (await searchParams) ?? {};
  const page = normalizePage(resolvedSearchParams.page);
  const search = normalizeSearchTerm(resolvedSearchParams.q);
  const status =
    typeof resolvedSearchParams.status === "string" &&
    resolvedSearchParams.status.trim()
      ? resolvedSearchParams.status.trim()
      : "all";
  const tenantId = await getTenantId();
  const tenantFeatures = await getTenantFeatures(tenantId);

  if (!tenantFeatures.pastOrders) {
    notFound();
  }

  const { orders: pastOrders, totalCount, totalPages } =
    await getPastOrdersByTenantId(tenantId, {
      page,
      pageSize: 20,
      search,
      status,
    });

  const grouped = groupOrdersByWeekOfMonth(pastOrders);
  const monthLabel = getCurrentMonthLabel();

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
              <Card className="gap-4 py-4">
                <CardContent className="flex flex-col gap-4">
                  <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
                    <form className="flex flex-col gap-3 md:flex-row md:items-end">
                      <div className="w-full md:min-w-80">
                        <label
                          htmlFor="orders-search"
                          className="mb-2 block text-sm font-medium text-(--muted-text)"
                        >
                          Cerca ordine
                        </label>
                        <Input
                          id="orders-search"
                          name="q"
                          defaultValue={search}
                          placeholder="Nome cliente, email, telefono o ID"
                        />
                      </div>

                      <div className="flex flex-col gap-2">
                        <label
                          htmlFor="orders-status"
                          className="text-sm font-medium text-(--muted-text)"
                        >
                          Stato
                        </label>
                        <select
                          id="orders-status"
                          name="status"
                          defaultValue={status}
                          className="border-input dark:bg-input/30 h-9 rounded-md border bg-transparent px-3 text-sm shadow-xs outline-none focus-visible:border-primary focus-visible:ring-primary/30 focus-visible:ring-[3px]"
                        >
                          <option value="all">Tutti</option>
                          <option value="In Attesa">In Attesa</option>
                          <option value="Pronto">Pronto</option>
                          <option value="Completato">Completato</option>
                        </select>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button type="submit">Filtra</Button>
                        {(search || status !== "all") && (
                          <Button asChild variant="outline">
                            <Link href="/admin/dashboard/riepilogo-ordini">
                              Reset
                            </Link>
                          </Button>
                        )}
                      </div>
                    </form>

                    <p className="text-sm text-muted-foreground">
                      {totalCount} {totalCount === 1 ? "ordine" : "ordini"} in{" "}
                      <span className="capitalize">{monthLabel}</span>
                    </p>
                  </div>
                </CardContent>
              </Card>

              <div className="flex flex-col gap-8">
                {grouped.length > 0 ? (
                  grouped.map((group) => (
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
                  ))
                ) : (
                  <div className="rounded-2xl border bg-card p-6">
                    <p className="text-sm text-muted-foreground">
                      Nessun ordine trovato con i filtri attuali.
                    </p>
                  </div>
                )}
              </div>
              <AdminPagination
                pathname="/admin/dashboard/riepilogo-ordini"
                page={page}
                totalPages={totalPages}
                searchParams={resolvedSearchParams}
              />
            </div>
          </section>
        </div>
      </main>
      <FloatingBack href="/admin/dashboard" />
    </AuthGuard>
  );
}
