import CheckoutForm from "@/components/checkout-form/checkout-form";
import styles from "./checkout.module.css";
import CheckoutItems from "@/components/checkout-items/checkout-items";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { getTenantId, getTenantPickupTimes } from "@/lib/tenantDetails";

export const metadata = {
  title: "Checkout - All'Amicizia Takeaway",
  description: "Completa il tuo ordine",
  robots: {
    index: false,
    follow: true,
  },
};

export default async function CheckoutPage() {
  const hostname =
    typeof window !== "undefined" ? window.location.hostname : "localhost";
  const cookieStore = await cookies();
  const cartCount =
    Number(cookieStore.get(`cart-count-${hostname}`)?.value) || 0;

  if (cartCount === 0) {
    redirect("/carrello");
  }

  const tenantId = await getTenantId();
  const pickupTimes = await getTenantPickupTimes(tenantId);

  return (
    <main className={styles.checkoutPage}>
      <h1>Conferma il tuo ordine</h1>
      <div className="container">
        <section className={styles.checkoutSection}>
          <div>
            <CheckoutForm pickupTimes={pickupTimes} />
          </div>
          <div>
            <CheckoutItems />
          </div>
        </section>
      </div>
    </main>
  );
}
