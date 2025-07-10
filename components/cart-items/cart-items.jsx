"use client";

import Link from "next/link";
import styles from "./cart-items.module.css";
import Image from "next/image";

import { useCartStore } from "@/store/cart";
import Loader from "../loader/loader";

import removeIcon from "@/assets/delete-icon.svg";
import plusIcon from "@/assets/plus.svg";
import minusIcon from "@/assets/minus.svg";

export default function CartItems() {
  const { cart, removeFromCart, updateQuantity, hydrated, getTotalPrice } =
    useCartStore();

  const total = getTotalPrice();

  const formattedTotal = new Intl.NumberFormat("it-IT", {
    style: "currency",
    currency: "EUR",
  }).format(total);

  if (!hydrated) {
    return <Loader />;
  }

  if (cart.length === 0) {
    return (
      <section className={styles.cartItems}>
        <h1>Il carrello è vuoto</h1>
        <Link href="/" className={styles.backToShopNoItems}>
          Torna allo shop
        </Link>
      </section>
    );
  }

  console.log("Cart Items:", cart);

  return (
    <section className={styles.cartItems}>
      <h1>Il tuo ordine</h1>
      <div className={styles.cartWrapper}>
        <h3 className={styles.cartTotal}>Totale: {formattedTotal}</h3>
        <ul>
          {cart.map((item) => {
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
              <li key={key} className={styles.cartItem}>
                <div className={styles.cartItemInfo}>
                  <div className={styles.cartItemInfoHeading}>
                    <div>
                      <h3>{item.name}</h3>
                      <p>+{formattedItemPrice}</p>
                    </div>
                    <div
                      onClick={() =>
                        removeFromCart(
                          item.id,
                          item.selectedDough,
                          item.selectedExtras,
                          item.selectedRemovals,
                          item.selectedCookingOption,
                          item.selectedSpiceLevel
                        )
                      }
                      className={styles.removeItem}
                    >
                      <Image src={removeIcon} alt="Rimuovi elemento" />
                    </div>
                  </div>
                  {item.description && (
                    <p className={styles.itemDescription}>{item.description}</p>
                  )}
                  {(item.selectedDough ||
                    item.selectedExtras.length > 0 ||
                    item.selectedRemovals.length > 0 ||
                    item.selectedCookingOption ||
                    item.selectedSpiceLevel) && (
                    <div className={styles.cartItemVariations}>
                      <p>PERSONALIZZAZIONI</p>
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
                <div className={styles.cartItemActions}>
                  <div className={styles.cartItemControls}>
                    <button
                      onClick={() =>
                        updateQuantity(
                          item.id,
                          item.quantity - 1,
                          item.selectedDough,
                          item.selectedExtras,
                          item.selectedRemovals,
                          item.selectedCookingOption,
                          item.selectedSpiceLevel
                        )
                      }
                      className={styles.updateQuantity}
                    >
                      <Image
                        src={minusIcon}
                        alt="Diminuisci quantità"
                        width={14}
                        height={14}
                      />
                    </button>
                    <span>x{item.quantity}</span>
                    <button
                      onClick={() =>
                        updateQuantity(
                          item.id,
                          item.quantity + 1,
                          item.selectedDough,
                          item.selectedExtras,
                          item.selectedRemovals,
                          item.selectedCookingOption,
                          item.selectedSpiceLevel
                        )
                      }
                      className={styles.updateQuantity}
                    >
                      <Image
                        src={plusIcon}
                        alt="Aumenta quantità"
                        width={14}
                        height={14}
                      />
                    </button>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
      <div className={styles.cartCta}>
        <Link href="/checkout" className={styles.checkout}>
          Procedi con l&apos;ordine
        </Link>
        <Link href="/" className={styles.backToShop}>
          Torna allo shop
        </Link>
      </div>
    </section>
  );
}
