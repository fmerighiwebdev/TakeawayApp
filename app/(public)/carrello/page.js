import CartItems from "@/components/cart-items/cart-items";
import styles from "./cart.module.css";
import { cookies } from "next/headers";
import Link from "next/link";

export const metadata = {
  title: "Carrello - All'Amicizia Takeaway",
  description: "Il tuo carrello",
  robots: {
    index: false,
    follow: true,
  },
};

export default async function CartPage() {
  const hostname =
    typeof window !== "undefined" ? window.location.hostname : "localhost";
  const cookieStore = await cookies();
  const cartCount = Number(cookieStore.get(`cart-count-${hostname}`)?.value) || 0;

  if (cartCount === 0) {
    return (
      <main className={styles.cartPage}>
        <div className="container">
          <section className={styles.cartItems}>
            <h1>Il carrello è vuoto</h1>
            <Link href="/" className={styles.backToShopNoItems}>
              Torna allo shop
            </Link>
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.cartPage}>
      <div className="container">
        <CartItems />
      </div>
    </main>
  );
}
