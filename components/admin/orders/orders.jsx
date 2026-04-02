"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { RotateCw } from "lucide-react";

import OrdersList from "./orders-list";
import { createSupabaseBrowserClient } from "@/lib/supabase/supabaseClient";
import { getOrdersByTenantIdLive } from "@/lib/orders/ordersLive";

export default function Orders({ initialOrders, tenantId, adminAuthToken }) {
  const [status, setStatus] = useState("waiting");
  const [orders, setOrders] = useState(initialOrders);
  const [newOrdersCount, setNewOrdersCount] = useState(0);

  const existingOrdersIdsRef = useRef(
    new Set(initialOrders.map((order) => order.id)),
  );

  const supabaseClient = useMemo(() => {
    return createSupabaseBrowserClient(adminAuthToken);
  }, [adminAuthToken]);

  useEffect(() => {
    existingOrdersIdsRef.current = new Set(
      initialOrders.map((order) => order.id),
    );
  }, [initialOrders]);

  useEffect(() => {
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

          if (!existingOrdersIdsRef.current.has(newOrder.id)) {
            existingOrdersIdsRef.current.add(newOrder.id);
            setNewOrdersCount((count) => count + 1);
          }
        },
      )
      .subscribe((status, err) => {
        if (err) {
          console.error("Realtime subscription error:", err);
        }
      });

    return () => {
      supabaseClient.removeChannel(channel);
    };
  }, [supabaseClient, tenantId]);

  async function handleRefresh() {
    const freshOrders = await getOrdersByTenantIdLive(tenantId, adminAuthToken);
    setOrders(freshOrders);
    existingOrdersIdsRef.current = new Set(
      freshOrders.map((order) => order.id),
    );
    setNewOrdersCount(0);
  }

  return (
    <div className="mt-3 flex flex-col gap-6">
      <nav className="flex items-center gap-3">
        <button
          className={
            status === "waiting"
              ? "btn btn-primary md:btn-lg"
              : "btn btn-link md:btn-lg no-underline hover:bg-gray-100"
          }
          onClick={() => setStatus("waiting")}
        >
          In Attesa
        </button>
        <button
          className={
            status === "completed"
              ? "btn btn-primary md:btn-lg"
              : "btn btn-link md:btn-lg no-underline hover:bg-gray-100"
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
