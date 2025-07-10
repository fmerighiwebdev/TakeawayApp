"use client";

import styles from "./order-details.module.css";

import { useState, useEffect, useCallback } from "react";

import axios from "axios";

import { motion, AnimatePresence } from "motion/react";

import Loader from "../loader/loader";
import Image from "next/image";

import detailsIcon from "@/assets/details.svg";
import clockIcon from "@/assets/clock.svg";
import userIcon from "@/assets/user.svg";
import shapeUp from "@/assets/shape-up.svg";
import shapeDown from "@/assets/shape-down.svg";
import { notFound } from "next/navigation";
import ConfirmationModal from "../confirmation-modal/confirmation-modal";
import PostponementModal from "../postponement-modal/postponement-modal";

export default function OrderDetails({ orderId, publicDetails }) {
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showPostponement, setShowPostponement] = useState(false);

  const fetchOrderAdmin = useCallback(async () => {
    setLoading(true);
    setOrderDetails(null);

    const authToken = localStorage.getItem("auth-token");

    if (!authToken) {
      return;
    }

    try {
      const response = await axios.get(`/api/admin/orders/${orderId}`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      setOrderDetails(response.data.orderDetails);
    } catch (error) {
      console.error(error);
      if (error.response.status === 401) {
        localStorage.removeItem("auth-token");
        router.push("/admin/login");
      } else if (error.response.status === 404) {
        notFound();
      }
    }

    setLoading(false);
  }, [orderId]);

  const fetchOrderPublic = useCallback(async () => {
    setLoading(true);
    setOrderDetails(null);

    try {
      const response = await axios.get(`/api/orders/${orderId}`);
      setOrderDetails(response.data.orderDetails);
    } catch (error) {
      console.error(error);
      if (error.response.status === 404) {
        notFound();
      }
    }

    setLoading(false);
  }, [orderId]);

  useEffect(() => {
    if (publicDetails) {
      fetchOrderPublic();
    } else {
      fetchOrderAdmin();
    }
  }, [orderId, publicDetails]);

  const formattedTotalPrice = new Intl.NumberFormat("it-IT", {
    style: "currency",
    currency: "EUR",
  }).format(orderDetails?.total_price);

  return (
    <div className={styles.orderDetails}>
      <AnimatePresence>
        {success && !publicDetails && (
          <motion.div
            initial={{ opacity: 0, scale: 0.75, x: "-50%" }}
            animate={{ opacity: 1, scale: 1, x: "-50%" }}
            exit={{ opacity: 0, scale: 0.75, x: "-50%" }}
            transition={{ duration: 0.3 }}
            className="successBanner"
          >
            <p>Ordine completato con successo!</p>
          </motion.div>
        )}
      </AnimatePresence>
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
          setSuccess={setSuccess}
        />
      )}
      <div className="container">
        {loading ? (
          <Loader />
        ) : (
          <div className={styles.orderDetailsCard}>
            <Image src={shapeDown} alt="Forma" className={styles.shapeDown} />
            <div className={styles.orderDetails}>
              <div className={styles.orderDetailsHeading}>
                <Image src={detailsIcon} alt="Dettagli ordine" />
                <h2>Dettagli ordine</h2>
              </div>
              <div className={styles.orderDetailsWrapper}>
                <div className={styles.customerDetails}>
                  <Image src={userIcon} alt="Nome cliente" />
                  <div>
                    <p className={styles.customerName}>
                      {orderDetails.customer_name}
                    </p>
                    <p>{orderDetails.customer_phone}</p>
                    <p>{orderDetails.customer_email}</p>
                  </div>
                </div>
                <div className={styles.orderTime}>
                  <Image src={clockIcon} alt="Orario di ritiro" />
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
                  orderDetails.items.map((product) => {
                    const key = `${product.id}-${
                      product.dough?.name || "no-dough"
                    }-${product.extras.join(",") || "no-extras"}-${
                      product.removals.join(",") || "no-removals"
                    }-${product.cooking?.label || "no-cooking"}-${
                      product.spice?.label || "no-spice"
                    }`;

                    const itemExtrasTotal = product.extras.reduce(
                      (acc, extra) => acc + parseFloat(extra.price),
                      0
                    );

                    const itemPrice =
                      product.price * product.quantity +
                      (product.dough?.price || 0) * product.quantity +
                      itemExtrasTotal * product.quantity;

                    const formattedItemPrice = new Intl.NumberFormat("it-IT", {
                      style: "currency",
                      currency: "EUR",
                    }).format(itemPrice);

                    const formattedDoughPrice = new Intl.NumberFormat("it-IT", {
                      style: "currency",
                      currency: "EUR",
                    }).format(product.dough?.price || 0);

                    return (
                      <li key={key} className={styles.productItem}>
                        <div className={styles.productItemInfo}>
                          <div className={styles.productItemInfoHeading}>
                            <h3>{product.name}</h3>
                            <p>
                              {product.quantity}x {formattedItemPrice}
                            </p>
                          </div>
                          {product.description && (
                            <p className={styles.productItemDescription}>
                              {product.description}
                            </p>
                          )}
                          {(product.dough ||
                            product.extras.length > 0 ||
                            product.removals.length > 0 ||
                            product.cooking ||
                            product.spice) && (
                            <div className={styles.productItemVariations}>
                              <p>VARIAZIONI</p>
                              {product.dough && (
                                <p className={styles.itemDough}>
                                  {product.dough?.name} ({formattedDoughPrice})
                                </p>
                              )}
                              {product.extras.length > 0 &&
                                product.extras.map((extra, index) => (
                                  <p key={index} className={styles.itemExtra}>
                                    + {extra.name} (
                                    {new Intl.NumberFormat("it-IT", {
                                      style: "currency",
                                      currency: "EUR",
                                    }).format(extra.price)}
                                    )
                                  </p>
                                ))}
                              {product.removals.length > 0 &&
                                product.removals.map((removal, index) => (
                                  <p key={index} className={styles.itemRemoval}>
                                    - {removal.name}
                                  </p>
                                ))}
                              {product.cooking && (
                                <p className={styles.itemCooking}>
                                  Cottura &quot;{product.cooking.label}&quot;
                                </p>
                              )}
                              {product.spice && (
                                <p className={styles.itemSpice}>
                                  {product.spice.label}
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
            <Image src={shapeUp} alt="Forma" className={styles.shapeUp} />
          </div>
        )}
      </div>
    </div>
  );
}
