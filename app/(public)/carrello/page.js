import CartItems from "@/components/cart-items/cart-items";
import styles from "./cart.module.css";

export const metadata = {
  title: "Carrello - All'Amicizia Takeaway",
  description: "Il tuo carrello",
  robots: {
    index: false,
    follow: true
  }
};

export default function CartPage() {
  return (
    <main className={styles.cartPage}>
      <div className="container">
        <CartItems />
      </div>
    </main>
  );
}
