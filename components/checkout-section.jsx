"use client";

import CheckoutForm from "./checkout-form";
import CheckoutItems from "./checkout-items";

import { useState } from "react";

export default function CheckoutSection({
  pickupTimes,
  tenantFeatures,
  tenantDiscounts,
}) {
  const [appliedDiscount, setAppliedDiscount] = useState(null);

  return (
    <section className="flex items-start gap-10 lg:gap-4 flex-col lg:flex-row relative">
      <div className="flex-1 lg:sticky top-24 w-full">
        <CheckoutForm
          pickupTimes={pickupTimes}
          tenantFeatures={tenantFeatures}
          tenantDiscounts={tenantDiscounts}
          appliedDiscount={appliedDiscount}
          setAppliedDiscount={setAppliedDiscount}
        />
      </div>
      <div className="flex-1">
        <CheckoutItems
          appliedDiscount={appliedDiscount}
        />
      </div>
    </section>
  );
}
