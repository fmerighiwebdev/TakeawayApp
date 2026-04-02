"use client";

import Link from "next/link";

import CartItemSummary from "@/components/cart/cart-item-summary";
import {
  buildCartItemKey,
  calculateDiscountAmount,
  calculateDiscountedTotal,
} from "@/lib/cart";
import { formatCurrency } from "@/lib/currency";
import { useCartStore } from "@/store/cart";
import { Card, CardContent } from "./ui/card";
import { Spinner } from "./ui/spinner";

export default function CheckoutItems({ appliedDiscount }) {
  const { cart, hydrated, getTotalPrice } = useCartStore();

  const total = getTotalPrice();
  const percentOff = appliedDiscount ? appliedDiscount.percent_off : 0;
  const discountAmount = calculateDiscountAmount(total, percentOff);
  const discountedTotal = calculateDiscountedTotal(total, percentOff);

  const formattedTotal = formatCurrency(total);
  const formattedDiscountAmount = formatCurrency(discountAmount);
  const formattedDiscountedTotal = formatCurrency(discountedTotal);

  return (
    <div className="w-full">
      {!hydrated ? (
        <div className="flex justify-center w-full h-dvh">
          <Spinner className="size-12 text-primary" />
        </div>
      ) : (
        <div className="flex flex-col items-start gap-4 w-full">
          <div className="w-full">
            <Card className="w-full">
              <CardContent>
                {cart.map((item) => {
                  const key = buildCartItemKey(item);

                  return (
                    <div
                      key={key}
                      className="flex flex-col gap-4 relative cart-item"
                    >
                      <CartItemSummary item={item} />
                    </div>
                  );
                })}
                <div className="flex justify-center">
                  <button className="btn btn-link">
                    <Link href="/carrello">Modifica ordine</Link>
                  </button>
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="flex flex-col gap-6">
            <div className="flex flex-col">
              <h2 className="text-4xl text-(--muted-text)">Totale ordine</h2>

              {!appliedDiscount ? (
                <p className="text-3xl font-semibold text-primary">
                  {formattedTotal}
                </p>
              ) : (
                <div className="flex flex-col">
                  <p className="text-sm text-(--muted-light-text)">
                    Subtotale:{" "}
                    <span className="line-through">{formattedTotal}</span>
                  </p>

                  <p className="text-sm text-green-700">
                    Sconto ({percentOff}%): -{formattedDiscountAmount}
                  </p>

                  <p className="text-3xl font-semibold text-primary">
                    {formattedDiscountedTotal}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
