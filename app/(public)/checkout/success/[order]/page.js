import OrderDetails from "@/components/order-details/order-details";
import styles from "../../checkout.module.css";
import Image from "next/image";

import checkIcon from "@/assets/check.svg";
import { getOrderByPublicIdWithDetails } from "@/lib/orders";
import { getTenantId } from "@/lib/tenantDetails";

export default async function SuccessPage({ params }) {
  const { order: orderPublicId } = await params;

  const tenantId = getTenantId();
  const orderDetails = await getOrderByPublicIdWithDetails(tenantId, orderPublicId);

  return (
    <section className={styles.checkoutPage}>
      <div className="container">
        <div className={styles.successPageHeading}>
          <h1>Grazie per il tuo ordine!</h1>
          <Image
            className={styles.checkIcon}
            src={checkIcon}
            alt="Ordine completato"
          />
        </div>
      </div>
      <OrderDetails orderDetails={orderDetails} publicDetails />
    </section>
  );
}
