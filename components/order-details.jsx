"use client";

import { useState } from "react";
import { Clock } from "lucide-react";

import OrderActionsPanel from "@/components/order-details/order-actions-panel";
import OrderItemsCard from "@/components/order-details/order-items-card";
import OrderNotesSection from "@/components/order-details/order-notes-section";
import OrderTotalSummary from "@/components/order-details/order-total-summary";

export default function OrderDetails({ orderDetails, publicDetails, orderId }) {
  const [pickupTime, setPickupTime] = useState(orderDetails.pickup_time);

  return (
    <div className="max-w-3xl w-full">
      <div className="flex flex-col gap-10">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <h2 className="text-3xl text-(--muted-text) md:text-4xl">Dettagli ordine</h2>
            <div className="separator-horizontal"></div>
          </div>

          <div className="flex flex-col items-start justify-between gap-2 md:flex-row">
            <div className="flex flex-col gap-5">
              <span className="w-fit rounded-sm bg-primary px-2 text-2xl text-white md:text-3xl">
                #{orderDetails.id}
              </span>

              <div className="flex flex-col">
                <p className="text-2xl text-(--muted-text) md:text-3xl">
                  {orderDetails.customer_name}
                </p>
                <a
                  href={`tel:${orderDetails.customer_phone}`}
                  className="text-md text-(--muted-light-text) md:text-lg"
                >
                  {orderDetails.customer_phone}
                </a>
                {orderDetails.customer_email && (
                  <a
                    href={`mailto:${orderDetails.customer_email}`}
                    className="text-md text-(--muted-light-text) md:text-lg"
                  >
                    {orderDetails.customer_email}
                  </a>
                )}
              </div>
            </div>

            <div className="flex flex-col items-end gap-4">
              <div className="flex items-center gap-2">
                <Clock className="h-8 w-8 text-primary" strokeWidth={1.5} />
                <p className="text-xl font-medium text-primary md:text-2xl">{pickupTime}</p>
              </div>

              <OrderActionsPanel
                orderId={orderId}
                publicDetails={publicDetails}
                status={orderDetails.status}
                onPickupTimeChange={setPickupTime}
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <h2 className="text-3xl text-(--muted-text) md:text-4xl">Prodotti</h2>
            <div className="separator-horizontal"></div>
          </div>
          <OrderItemsCard items={orderDetails.items} />
        </div>

        <OrderNotesSection notes={orderDetails.notes} />
        <OrderTotalSummary orderDetails={orderDetails} />
      </div>
    </div>
  );
}
