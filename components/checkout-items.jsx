"use client";

import Link from "next/link";

import { useCartStore } from "@/store/cart";
import { Spinner } from "./ui/spinner";
import { Card, CardContent } from "./ui/card";

const currencyFormatter = new Intl.NumberFormat("it-IT", {
  style: "currency",
  currency: "EUR",
});

function formatCurrency(value) {
  return currencyFormatter.format(value);
}

function buildCartItemKey(item) {
  const dough = item.selectedDough?.name || "no-dough";
  const extras =
    item.selectedExtras.map((extra) => extra.name).join(",") || "no-extras";
  const removals =
    item.selectedRemovals.map((removal) => removal.name).join(",") ||
    "no-removals";
  const cooking = item.selectedCookingOption?.label || "no-cooking-option";
  const spice = item.selectedSpiceLevel?.label || "no-spice-level";

  return `${item.id}-${dough}-${extras}-${removals}-${cooking}-${spice}`;
}

function getItemRowPrice(item) {
  const base = item.price;
  const doughPrice = item.selectedDough?.price || 0;
  const extrasTotal = item.selectedExtras.reduce(
    (acc, extra) => acc + extra.price,
    0,
  );

  const singleUnitPrice = base + doughPrice + extrasTotal;
  return singleUnitPrice * item.quantity;
}

export default function CheckoutItems({ appliedDiscount }) {
  const { cart, hydrated, getTotalPrice } = useCartStore();

  const total = getTotalPrice();
  const percentOff = appliedDiscount ? appliedDiscount.percent_off : 0;
  const discountAmount = percentOff > 0 ? (total * percentOff) / 100 : 0;
  const discountedTotal = Math.max(total - discountAmount, 0);

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
                  const itemPrice = getItemRowPrice(item);
                  const formattedItemPrice = formatCurrency(itemPrice);
                  const formattedDoughPrice = item.selectedDough
                    ? formatCurrency(item.selectedDough.price)
                    : null;

                  return (
                    <div
                      key={key}
                      className="flex flex-col gap-4 relative cart-item"
                    >
                      <div className="flex flex-col">
                        <h3 className="text-3xl md:text-4xl text-(--muted-text)">
                          {item.name}
                        </h3>
                        <p className="font-semibold text-xl md:text-2xl text-primary">
                          +{formattedItemPrice}
                        </p>
                        {item.selectedDough && (
                          <p className="text-(--muted-light-text) text-sm">
                            {item.selectedDough?.name} ({formattedDoughPrice})
                          </p>
                        )}
                        {item.selectedExtras.length > 0 &&
                          item.selectedExtras.map((extra, index) => (
                            <p
                              key={index}
                              className="text-(--muted-light-text) text-sm"
                            >
                              + {extra.name} (
                              {new Intl.NumberFormat("it-IT", {
                                style: "currency",
                                currency: "EUR",
                              }).format(extra.price)}
                              )
                            </p>
                          ))}
                        {item.selectedRemovals.length > 0 &&
                          item.selectedRemovals.map((removal, index) => (
                            <p
                              key={index}
                              className="text-(--muted-light-text) text-sm"
                            >
                              - {removal.name}
                            </p>
                          ))}
                        {item.selectedCookingOption && (
                          <p className="text-(--muted-light-text) text-sm">
                            Cottura &quot;{item.selectedCookingOption.label}
                            &quot;
                          </p>
                        )}
                        {item.selectedSpiceLevel && (
                          <p className="text-(--muted-light-text) text-sm">
                            {item.selectedSpiceLevel.label}
                          </p>
                        )}
                      </div>
                      {item.description && (
                        <p className="font-medium text-(--muted-light-text)">
                          <em>{item.description}</em>
                        </p>
                      )}
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
