import OrderDetails from "@/components/order-details/order-details";
import styles from "../../checkout.module.css";
import Image from "next/image";

import { getOrderByPublicIdWithDetails } from "@/lib/orders";
import { getTenantId } from "@/lib/tenantDetails";
import ClearCartOnMount from "@/components/clear-cart/clear-cart";
import { getIcon } from "@/lib/icons";

export const metadata = {
  title: "Ordine completato",
  description: "Grazie per il tuo ordine! Ecco i dettagli.",
  robots: {
    index: false,
    follow: true,
  },
}


export default async function SuccessPage({ params }) {
  const { order: orderPublicId } = await params;

  const tenantId = await getTenantId();
  const orderDetails = await getOrderByPublicIdWithDetails(
    tenantId,
    orderPublicId
  );

  const successIcon = getIcon("successIcon");

  return (
    <main>
      <ClearCartOnMount />
      <section className={styles.checkoutPage}>
        <div className="container">
          <div className={styles.successPageHeading}>
            <h1>Grazie per il tuo ordine!</h1>
            <Image
              className={styles.checkIcon}
              src={successIcon}
              alt="Ordine completato"
              width={64}
              height={64}
            />
          </div>
        </div>
        <OrderDetails orderDetails={orderDetails} publicDetails />
      </section>
    </main>
  );
}
