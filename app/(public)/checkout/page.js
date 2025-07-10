import CheckoutForm from "@/components/checkout-form/checkout-form";
import styles from "./checkout.module.css";
import CheckoutItems from "@/components/checkout-items/checkout-items";

export const metadata = {
  title: "Checkout - All'Amicizia Takeaway",
  description: "Completa il tuo ordine",
  robots: {
    index: false,
    follow: true
  }
};

export default function CheckoutPage() {
  return (
    <main className={styles.checkoutPage}>
      <h1>Conferma il tuo ordine</h1>
      <div className="container">
        <section className={styles.checkoutSection}>
          <div>
            <CheckoutForm />
          </div>
          <div>
            <CheckoutItems />
          </div>
        </section>
      </div>
    </main>
  );
}