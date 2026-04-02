"use client";

import { getOrderPricingSummary } from "@/lib/orders/orderPresentation";

export default function OrderTotalSummary({ orderDetails }) {
  const {
    hasDiscount,
    formattedDiscountAmount,
    formattedDiscountedPrice,
    formattedTotalPrice,
  } = getOrderPricingSummary(orderDetails);

  return (
    <div className="flex justify-end">
      <div className="text-right">
        <p className="text-xl font-medium uppercase text-(--muted-text) md:text-2xl">
          Totale
        </p>

        {!hasDiscount ? (
          <p className="text-3xl font-semibold text-primary md:text-4xl">
            {formattedTotalPrice}
          </p>
        ) : (
          <div className="flex flex-col items-end gap-1">
            <p className="text-lg text-(--muted-light-text) line-through md:text-xl">
              {formattedTotalPrice}
            </p>

            <p className="text-sm text-green-600 md:text-base">
              Sconto{" "}
              <strong>
                {orderDetails.discount_code} (-{orderDetails.percent_off}%)
              </strong>{" "}
              {formattedDiscountAmount ? (
                <span className="text-(--muted-light-text)">
                  = -{formattedDiscountAmount}
                </span>
              ) : null}
            </p>

            <p className="text-3xl font-semibold text-primary md:text-4xl">
              {formattedDiscountedPrice}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
