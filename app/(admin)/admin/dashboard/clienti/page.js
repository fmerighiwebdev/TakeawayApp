import AuthGuard from "@/components/auth-guard";
import CustomersTable from "@/components/customers-table";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { getCustomers } from "@/lib/customers";
import { getTenantId } from "@/lib/tenantDetails";
import Link from "next/link";

export default async function ClientiPage() {
  const tenantId = await getTenantId();
  const customers = await getCustomers(tenantId);

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
              <CustomersTable customers={customers} />
            </div>
          </section>
        </div>
      </main>
    </AuthGuard>
  );
}
