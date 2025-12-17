import OrderDetails from "@/components/order-details";
import styles from "../../checkout.module.css";
import Image from "next/image";

import { getOrderByPublicIdWithDetails } from "@/lib/orders";
import { getTenantId } from "@/lib/tenantDetails";
import ClearCartOnMount from "@/components/clear-cart";
import { getIcon } from "@/lib/icons";
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

  return (
    <main className="py-24">
      <ClearCartOnMount />
      <section>
        <div className="container flex flex-col gap-15 items-center">
          <div className="flex flex-col gap-2 items-center">
            <h1 className="text-5xl rounded-sm text-primary font-medium uppercase">
              Grazie per il tuo ordine!
            </h1>
            <p className="text-(--muted-text) text-center text-lg">
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
