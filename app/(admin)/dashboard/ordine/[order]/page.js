import OrderDetails from "@/components/order-details";
import { getOrderByIdWithDetails } from "@/lib/orders";
import { getTenantId } from "@/lib/tenantDetails";
import { notFound } from "next/navigation";
import AuthGuard from "@/components/auth-guard";
import FloatingBack from "@/components/ui/floating-back";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import Link from "next/link";

export default async function OrderPage({ params }) {
  const { order: orderId } = await params;
  const tenantId = await getTenantId();

  const orderDetails = await getOrderByIdWithDetails(tenantId, orderId);

  if (!orderDetails) {
    notFound();
  }

  const formattedCreatedAt = new Date(orderDetails.created_at).toLocaleDateString("it-IT", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <AuthGuard>
      <main className="py-24 min-h-dvh">
        <div className="container">
          <section className="w-full max-w-3xl mx-auto flex flex-col gap-15">
            <div className="flex flex-col gap-2">
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                      <Link href="/dashboard" className="text-md md:text-lg">
                        Dashboard
                      </Link>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                      <span className="text-md md:text-lg text-primary font-semibold">
                        Ordine n.{orderId}
                      </span>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
              <h1 className="text-5xl text-primary font-medium">Ordine n.{orderId}</h1>
              <p className="text-xl text-(--muted-light-text)">
                {formattedCreatedAt}
              </p>
            </div>
            <OrderDetails orderDetails={orderDetails} orderId={orderId} />
          </section>
        </div>
      </main>
      <FloatingBack href="/dashboard" />
    </AuthGuard>
  );
}
