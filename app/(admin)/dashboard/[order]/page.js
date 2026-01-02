import OrderDetails from "@/components/order-details";
import { getOrderByIdWithDetails } from "@/lib/orders";
import { getTenantId } from "@/lib/tenantDetails";
import { notFound } from "next/navigation";
import AuthGuard from "@/components/auth-guard";
import FloatingBack from "@/components/ui/floating-back";

export default async function OrderPage({ params }) {
  const { order: orderId } = await params;
  const tenantId = await getTenantId();

  const orderDetails = await getOrderByIdWithDetails(tenantId, orderId);

  if (!orderDetails) {
    notFound();
  }

  const today = new Date();
  const options = { day: "2-digit", month: "long", year: "numeric" };
  const formattedDate = today.toLocaleDateString("it-IT", options);

  return (
    <AuthGuard>
      <main className="py-24 min-h-dvh">
        <div className="container">
          <section className="w-full max-w-3xl mx-auto flex flex-col gap-15">
            <div className="flex flex-col gap-2">
              <h1 className="text-5xl text-primary font-medium">Ordine n.{orderId}</h1>
              <p className="text-2xl text-(--muted-light-text)">
                {formattedDate}
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
