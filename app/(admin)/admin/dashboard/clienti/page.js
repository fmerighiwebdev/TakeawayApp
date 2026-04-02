import AdminPagination from "@/components/admin-pagination";
import AuthGuard from "@/components/auth-guard";
import CustomersTable from "@/components/customers-table";
import { Button } from "@/components/ui/button";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { getCustomers } from "@/lib/customers";
import { normalizePage, normalizeSearchTerm } from "@/lib/listing";
import { getTenantId } from "@/lib/tenantDetails";
import Link from "next/link";

export default async function ClientiPage({ searchParams }) {
  const resolvedSearchParams = (await searchParams) ?? {};
  const page = normalizePage(resolvedSearchParams.page);
  const search = normalizeSearchTerm(resolvedSearchParams.q);
  const tenantId = await getTenantId();
  const { customers, totalCount, totalPages } = await getCustomers(tenantId, {
    page,
    pageSize: 25,
    search,
  });

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
                      <Link
                        href="/admin/dashboard"
                        className="text-md md:text-lg"
                      >
                        Dashboard
                      </Link>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <span className="text-md md:text-lg text-primary font-semibold">
                      Clienti
                    </span>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
              <div className="flex flex-col gap-4">
                <h1 className="text-5xl text-primary font-medium">Clienti</h1>
                <p className="text-lg md:text-xl text-(--muted-light-text)">
                  Elenco di tutti i clienti
                </p>
              </div>
              <div className="separator-horizontal"></div>
              <Card className="gap-4 py-4">
                <CardContent className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                  <form className="flex flex-1 flex-col gap-3 md:flex-row md:items-end">
                    <div className="w-full md:max-w-md">
                      <label
                        htmlFor="customers-search"
                        className="mb-2 block text-sm font-medium text-(--muted-text)"
                      >
                        Cerca cliente
                      </label>
                      <Input
                        id="customers-search"
                        name="q"
                        defaultValue={search}
                        placeholder="Nome, email o telefono"
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <Button type="submit">Filtra</Button>
                      {search ? (
                        <Button asChild variant="outline">
                          <Link href="/admin/dashboard/clienti">Reset</Link>
                        </Button>
                      ) : null}
                    </div>
                  </form>

                  <p className="text-sm text-muted-foreground">
                    {totalCount} {totalCount === 1 ? "cliente" : "clienti"}{" "}
                    trovati
                  </p>
                </CardContent>
              </Card>
              <CustomersTable customers={customers} />
              <AdminPagination
                pathname="/admin/dashboard/clienti"
                page={page}
                totalPages={totalPages}
                searchParams={resolvedSearchParams}
              />
            </div>
          </section>
        </div>
      </main>
    </AuthGuard>
  );
}
