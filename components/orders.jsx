"use client";

import supabaseClient from "@/lib/supabaseClient";
import OrdersList from "./orders-list";

import { useEffect, useState } from "react";
import { getOrdersByTenantIdLive } from "@/lib/ordersLive";
import { RotateCw } from "lucide-react";

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
        {
          event: "INSERT",
          schema: "public",
          table: "orders",
          filter: `tenant_id=eq.${tenantId}`,
        },
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
    <div className="mt-3 flex flex-col gap-6">
      <nav className="flex items-center gap-3">
        <button
          className={
            status === "waiting"
              ? "btn btn-primary btn-lg"
              : "btn btn-link btn-lg no-underline hover:bg-gray-100"
          }
          onClick={() => setStatus("waiting")}
        >
          In Attesa
        </button>
        <button
          className={
            status === "completed"
              ? "btn btn-primary btn-lg"
              : "btn btn-link btn-lg no-underline hover:bg-gray-100"
          }
          onClick={() => setStatus("completed")}
        >
          Completati
        </button>
      </nav>
      {newOrdersCount > 0 && status === "waiting" && (
        <button
          className="btn btn-primary w-fit new-orders-notification"
          onClick={handleRefresh}
        >
          <RotateCw className="animate-spin" />
          <span>
            {newOrdersCount}{" "}
            {newOrdersCount > 1 ? "nuovi ordini" : "nuovo ordine"}
          </span>
        </button>
      )}
      <OrdersList orders={orders} status={status} />
    </div>
  );
}
