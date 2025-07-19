import CartItems from "@/components/cart-items/cart-items";
import styles from "./cart.module.css";
import { cookies, headers } from "next/headers";
import Link from "next/link";

export const metadata = {
  title: "Carrello",
  description: "Gestisci il tuo carrello e procedi all'acquisto",
  robots: {
    index: false,
    follow: true,
  },
  alternates: {
    canonical: "/carrello",
  },
};

export default async function CartPage() {
  const headersList = await headers();
  let hostname = headersList.get("host") || "localhost";

  if (hostname === "localhost:3000") {
    hostname = "localhost";
  }

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
