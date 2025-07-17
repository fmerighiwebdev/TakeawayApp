"use client";

import styles from "./order-details.module.css";
import { useState } from "react";
import Image from "next/image";
import ConfirmationModal from "../confirmation-modal/confirmation-modal";
import PostponementModal from "../postponement-modal/postponement-modal";
import { getIcon } from "@/lib/icons";

export default function OrderDetails({ orderDetails, publicDetails, orderId }) {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showPostponement, setShowPostponement] = useState(false);

  const userIcon = getIcon("userIcon");
  const clockIcon = getIcon("clockIcon");
  const detailsIcon = getIcon("detailsIcon");

  const formattedTotalPrice = new Intl.NumberFormat("it-IT", {
    style: "currency",
    currency: "EUR",
  }).format(orderDetails?.total_price);

  return (
    <div className={styles.orderDetails}>
      {showConfirmation && (
        <ConfirmationModal
          setShowConfirmation={setShowConfirmation}
          orderId={orderId}
        />
      )}
      {showPostponement && (
        <PostponementModal
          setShowPostponement={setShowPostponement}
          orderId={orderId}
        />
      )}
      <div className="container">
        <div className={styles.orderDetailsCard}>
          <div className={styles.orderDetails}>
            <div className={styles.orderDetailsHeading}>
              <Image src={detailsIcon} alt="Dettagli ordine" width={48} height={48} />
              <h2>Dettagli ordine</h2>
            </div>
            <div className={styles.orderDetailsWrapper}>
              <div className={styles.customerDetails}>
                <Image src={userIcon} alt="Nome cliente" width={32} height={32} />
                <div>
                  <p className={styles.customerName}>
                    {orderDetails.customer_name}
                  </p>
                  <p>{orderDetails.customer_phone}</p>
                  <p>{orderDetails.customer_email}</p>
                </div>
              </div>
              <div className={styles.orderTime}>
                <Image src={clockIcon} alt="Orario di ritiro" width={32} height={32} />
                <p>{orderDetails.pickup_time}</p>
              </div>
              {!publicDetails && orderDetails.status === "In Attesa" && (
                <>
                  <button
                    onClick={() => setShowConfirmation(true)}
                    className={styles.markAsCompleted}
                  >
                    Segna come completato
                  </button>
                  <button
                    onClick={() => setShowPostponement(true)}
                    className={styles.lateOrder}
                  >
                    Aggiorna orario di ritiro
                  </button>
                </>
              )}
            </div>
          </div>
          <div className={styles.productsDetails}>
            <ul className={styles.productsList}>
              {orderDetails.items && orderDetails.items.length > 0 ? (
                orderDetails.items.map((item) => {
                  const key = `${item.id}-${item.dough?.name || "no-dough"}-${
                    item.extras.join(",") || "no-extras"
                  }-${item.removals.join(",") || "no-removals"}-${
                    item.cooking?.label || "no-cooking"
                  }-${item.spice?.label || "no-spice"}`;

                  const itemExtrasTotal = item.extras.reduce(
                    (acc, extra) => acc + parseFloat(extra.price),
                    0
                  );

                  const itemPrice =
                    item.product.price * item.quantity +
                    (item.dough?.price || 0) * item.quantity +
                    itemExtrasTotal * item.quantity;

                  const formattedItemPrice = new Intl.NumberFormat("it-IT", {
                    style: "currency",
                    currency: "EUR",
                  }).format(itemPrice);

                  const formattedDoughPrice = new Intl.NumberFormat("it-IT", {
                    style: "currency",
                    currency: "EUR",
                  }).format(item.dough?.price || 0);

                  return (
                    <li key={key} className={styles.productItem}>
                      <div className={styles.productItemInfo}>
                        <div className={styles.productItemInfoHeading}>
                          <h3>{item.product.name}</h3>
                          <p>
                            {item.quantity}x {formattedItemPrice}
                          </p>
                        </div>
                        {item.product.description && (
                          <p className={styles.productItemDescription}>
                            {item.product.description}
                          </p>
                        )}
                        {(item.dough ||
                          item.extras.length > 0 ||
                          item.removals.length > 0 ||
                          item.cooking ||
                          item.spice) && (
                          <div className={styles.productItemVariations}>
                            <p>VARIAZIONI</p>
                            {item.dough && (
                              <p className={styles.itemDough}>
                                {item.dough?.name} ({formattedDoughPrice})
                              </p>
                            )}
                            {item.extras.length > 0 &&
                              item.extras.map((extra, index) => (
                                <p key={index} className={styles.itemExtra}>
                                  + {extra.name} (
                                  {new Intl.NumberFormat("it-IT", {
                                    style: "currency",
                                    currency: "EUR",
                                  }).format(extra.price)}
                                  )
                                </p>
                              ))}
                            {item.removals.length > 0 &&
                              item.removals.map((removal, index) => (
                                <p key={index} className={styles.itemRemoval}>
                                  - {removal.name}
                                </p>
                              ))}
                            {item.cooking && (
                              <p className={styles.itemCooking}>
                                Cottura &quot;{item.cooking.label}&quot;
                              </p>
                            )}
                            {item.spice && (
                              <p className={styles.itemSpice}>
                                {item.spice.label}
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    </li>
                  );
                })
              ) : (
                <p>Nessun prodotto</p>
              )}
            </ul>
            <div className={styles.totalPrice}>
              <p>
                Totale <br /> <span>{formattedTotalPrice}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
