"use client";

import styles from "./checkout-items.module.css";

import { useCartStore } from "@/store/cart";
import Loader from "../loader/loader";
import Link from "next/link";

export default function CheckoutItems() {
  const { cart, hydrated, getTotalPrice } = useCartStore();

  const total = getTotalPrice();

  const formattedTotal = new Intl.NumberFormat("it-IT", {
    style: "currency",
    currency: "EUR",
  }).format(total);

  if (!hydrated) {
    return <Loader />;
  }

  return (
    <section className={styles.checkoutItems}>
      <div className={styles.checkoutWrapper}>
        <h3 className={styles.cartTotal}>Totale: {formattedTotal}</h3>
        <ul>
          {cart.map((item) => {
            console.log(item);

            const key = `${item.id}-${item.selectedDough?.name || "no-dough"}-${
              item.selectedExtras.map((extra) => extra.name).join(",") ||
              "no-extras"
            }-${
              item.selectedRemovals.map((removal) => removal.name).join(",") ||
              "no-removals"
            }-${item.selectedCookingOption?.label || "no-cooking-option"}-${
              item.selectedSpiceLevel?.label || "no-spice-level"
            }`;

            const itemExtrasTotal = item.selectedExtras.reduce(
              (acc, extra) => acc + extra.price,
              0
            );

            const itemPrice =
              item.price * item.quantity +
              (item.selectedDough?.price || 0) * item.quantity +
              itemExtrasTotal * item.quantity;

            const formattedItemPrice = new Intl.NumberFormat("it-IT", {
              style: "currency",
              currency: "EUR",
            }).format(itemPrice);

            const formattedDoughPrice = new Intl.NumberFormat("it-IT", {
              style: "currency",
              currency: "EUR",
            }).format(item.selectedDough?.price || 0);

            return (
              <li key={key} className={styles.checkoutItem}>
                <div className={styles.checkoutItemInfo}>
                  <div className={styles.checkoutItemInfoHeading}>
                    <h3>{item.name}</h3>
                    <p>
                      {item.quantity}x {formattedItemPrice}
                    </p>
                  </div>
                  {item.description && (
                    <p className={styles.itemDescription}>{item.description}</p>
                  )}
                  {(item.selectedDough ||
                    item.selectedExtras.length > 0 ||
                    item.selectedRemovals.length > 0 ||
                    item.selectedCookingOption ||
                    item.selectedSpiceLevel) && (
                    <div className={styles.checkoutItemVariations}>
                      <p>VARIAZIONI</p>
                      {item.selectedDough && (
                        <p className={styles.itemDough}>
                          {item.selectedDough?.name} ({formattedDoughPrice})
                        </p>
                      )}
                      {item.selectedExtras.length > 0 &&
                        item.selectedExtras.map((extra, index) => (
                          <p key={index} className={styles.itemExtra}>
                            + {extra.name} (
                            {new Intl.NumberFormat("it-IT", {
                              style: "currency",
                              currency: "EUR",
                            }).format(extra.price)}
                            )
                          </p>
                        ))}
                      {item.selectedRemovals.length > 0 &&
                        item.selectedRemovals.map((removal, index) => (
                          <p key={index} className={styles.itemRemoval}>
                            - {removal.name}
                          </p>
                        ))}
                      {item.selectedCookingOption && (
                        <p className={styles.itemCookingOption}>
                          Cottura &quot;{item.selectedCookingOption.label}&quot;
                        </p>
                      )}
                      {item.selectedSpiceLevel && (
                        <p className={styles.itemSpiceLevel}>
                          {item.selectedSpiceLevel.label}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </li>
            );
          })}
          <Link href="/carrello">Modifica il tuo ordine</Link>
        </ul>
      </div>
    </section>
  );
}
