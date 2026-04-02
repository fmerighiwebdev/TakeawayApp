"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import CheckoutForm from "./checkout-form";
import CheckoutItems from "./checkout-items";

import { useCartStore } from "@/store/cart";

export default function CheckoutSection({
  pickupTimes,
  tenantFeatures,
}) {
  const router = useRouter();
  const { cart, hydrated } = useCartStore();
  const [appliedDiscount, setAppliedDiscount] = useState(null);

  useEffect(() => {
    if (hydrated && cart.length === 0) {
      router.replace("/carrello");
    }
  }, [cart.length, hydrated, router]);

  return (
    <section className="flex items-start gap-10 lg:gap-4 flex-col lg:flex-row relative">
      <div className="flex-1 lg:sticky top-24 w-full">
        <CheckoutForm
          pickupTimes={pickupTimes}
          tenantFeatures={tenantFeatures}
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
