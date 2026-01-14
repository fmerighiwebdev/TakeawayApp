import OrderDetails from "@/components/order-details";

import { getOrderByPublicIdWithDetails } from "@/lib/orders";
import { getTenantId } from "@/lib/tenantDetails";
import ClearCartOnMount from "@/components/clear-cart";
import FloatingBack from "@/components/ui/floating-back";
import { notFound } from "next/navigation";

export const metadata = {
  title: "Ordine completato",
  description: "Grazie per il tuo ordine! Ecco i dettagli.",
  robots: {
    index: false,
    follow: true,
  },
};

function isOlderThan24h(createdAt) {
  const created = new Date(createdAt).getTime();
  const now = Date.now();
  const diffMs = now - created;
  return diffMs > 24 * 60 * 60 * 1000;
}

export default async function SuccessPage({ params }) {
  const { order: orderPublicId } = await params;

  const tenantId = await getTenantId();
  const orderDetails = await getOrderByPublicIdWithDetails(
    tenantId,
    orderPublicId
  );

  if (!orderDetails) {
    notFound();
  }

  if (!orderDetails.created_at || isOlderThan24h(orderDetails.created_at)) {
    notFound();
  }

  return (
    <main className="py-24">
      <ClearCartOnMount />
      <section>
        <div className="container flex flex-col gap-15 items-center">
          <div className="flex flex-col gap-2 items-center">
            <h1 className="text-4xl md:text-5xl text-center rounded-sm text-primary font-medium uppercase">
              Grazie per il tuo ordine!
            </h1>
            <p className="text-(--muted-text) text-center text-md md:text-lg">
              Riceverai una conferma via email con i dettagli del tuo ordine.
            </p>
          </div>
          <OrderDetails orderDetails={orderDetails} publicDetails />
        </div>
      </section>
      <FloatingBack href="/" />
    </main>
  );
}
