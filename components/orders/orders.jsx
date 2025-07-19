"use client";

import supabaseClient from "@/lib/supabaseClient";
import OrdersList from "../orders-list/orders-list";
import styles from "./orders.module.css";

import { useEffect, useState } from "react";
import { getOrdersByTenantIdLive } from "@/lib/ordersLive";
import Image from "next/image";

export default function Orders({ initialOrders, tenantId }) {
  const [status, setStatus] = useState("waiting");
  const [orders, setOrders] = useState(initialOrders);
  const [newOrdersCount, setNewOrdersCount] = useState(0);

  useEffect(() => {
    const existingOrdersIds = new Set(initialOrders.map((order) => order.id));

    const channel = supabaseClient
      .channel(`orders:${tenantId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "orders", filter: `tenant_id=eq.${tenantId}` },
        (payload) => {
          const newOrder = payload.new;
          if (!existingOrdersIds.has(newOrder.id)) {
            setNewOrdersCount((count) => count + 1);
          }
        }
      )
      .subscribe();

    return () => {
      supabaseClient.removeChannel(channel);
    };
  }, [initialOrders, tenantId]);

  async function handleRefresh() {
    const freshOrders = await getOrdersByTenantIdLive(tenantId);
    setOrders(freshOrders);
    setNewOrdersCount(0);
  }

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
      {newOrdersCount > 0 && (
        <div className={styles.newOrdersNotification} onClick={handleRefresh}>
          <Image src="/icons/refresh.svg" alt="Nuovi ordini in arrivo" width={24} height={24} />
          <span>{newOrdersCount} {newOrdersCount > 1 ? "nuovi ordini" : "nuovo ordine"}</span>
        </div>
      )}
      <OrdersList orders={orders} status={status} />
    </div>
  );
}
