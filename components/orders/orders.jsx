"use client";

import OrdersList from "../orders-list/orders-list";
import styles from "./orders.module.css";

import { useState } from "react";

export default function Orders({ orders }) {
  const [status, setStatus] = useState("waiting");

  return (
    <div className={styles.ordersSection}>
      <nav className={styles.ordersNav}>
        <button
          className={status === "waiting" ? styles.active : ""}
          onClick={() => setStatus("waiting")}
        >
          In Attesa
        </button>
        <button
          className={status === "completed" ? styles.active : ""}
          onClick={() => setStatus("completed")}
        >
          Completati
        </button>
      </nav>
      <OrdersList orders={orders} status={status} />
    </div>
  );
}
