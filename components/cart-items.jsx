"use client";

import Link from "next/link";

import { useCartStore } from "@/store/cart";
import { Spinner } from "./ui/spinner";
import { Card, CardContent } from "./ui/card";
import { Minus, Plus, Trash } from "lucide-react";
import { toast } from "sonner";
import { AnimatePresence, motion } from "motion/react";

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
    0
  );

  const singleUnitPrice = base + doughPrice + extrasTotal;
  return singleUnitPrice * item.quantity;
}

export default function CartItems() {
  const { cart, updateQuantity, hydrated, getTotalPrice, removeFromCart } =
    useCartStore();

  const total = getTotalPrice();

  const formattedTotal = new Intl.NumberFormat("it-IT", {
    style: "currency",
    currency: "EUR",
  }).format(total);

  if (hydrated && cart.length === 0) {
    return (
      <section className="w-screen h-dvh absolute top-0 left-0 flex items-center justify-center py-24">
        <div className="container flex flex-col items-center gap-12">
          <h1 className="text-5xl md:text-6xl font-medium text-(--muted-text) text-center">
            Il carrello è vuoto
          </h1>
          <button className="btn btn-primary">
            <Link href="/" className="text-lg">
              Torna allo shop
            </Link>
          </button>
        </div>
      </section>
    );
  }

  return (
    <section>
      {!hydrated ? (
        <div className="flex justify-center w-full h-dvh">
          <Spinner className="size-12 text-primary" />
        </div>
      ) : (
        <div className="flex items-start gap-8 md:gap-4 flex-col md:flex-row">
          <div className="flex-2">
            <Card className="w-full">
              <CardContent>
                <AnimatePresence mode="popLayout" initial={false}>
                  {cart.map((item) => {
                    const key = buildCartItemKey(item);
                    const itemPrice = getItemRowPrice(item);
                    const formattedItemPrice = formatCurrency(itemPrice);
                    const formattedDoughPrice = item.selectedDough
                      ? formatCurrency(item.selectedDough.price)
                      : null;

                    return (
                      <motion.div
                        key={key}
                        layout
                        initial={{ opacity: 1, y: 0 }} // niente animazione in entrata sulla prima render
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -48 }} // transizione in uscita
                        transition={{ duration: 0.25, ease: "easeOut" }}
                        className="flex flex-col gap-4 relative cart-item"
                      >
                        <div className="flex flex-col">
                          <div className="flex items-center gap-2 justify-between">
                            <h3 className="text-4xl text-(--muted-text)">
                              {item.name}
                            </h3>
                            <button
                              aria-label="Rimuovi articolo dal carrello"
                              onClick={() => {
                                toast.info("Articolo rimosso dal carrello");
                                removeFromCart(
                                  item.id,
                                  item.selectedDough,
                                  item.selectedExtras,
                                  item.selectedRemovals,
                                  item.selectedCookingOption,
                                  item.selectedSpiceLevel
                                );
                              }}
                            >
                              <Trash className="text-red-700 hover:text-red-900 transition duration-300 cursor-pointer" />
                            </button>
                          </div>
                          <p className="font-semibold text-2xl text-primary">
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

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() =>
                              updateQuantity(
                                item.id,
                                item.quantity - 1,
                                item.selectedDough,
                                item.selectedExtras,
                                item.selectedRemovals,
                                item.selectedCookingOption,
                                item.selectedSpiceLevel
                              )
                            }
                            aria-label="Diminuisci quantità"
                            className="btn btn-primary btn-sm"
                          >
                            <Minus />
                          </button>
                          <span className="text-xl text-(--muted-text)">
                            x{item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(
                                item.id,
                                item.quantity + 1,
                                item.selectedDough,
                                item.selectedExtras,
                                item.selectedRemovals,
                                item.selectedCookingOption,
                                item.selectedSpiceLevel
                              )
                            }
                            aria-label="Aumenta quantità"
                            className="btn btn-primary btn-sm"
                          >
                            <Plus />
                          </button>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </CardContent>
            </Card>
          </div>
          <div className="flex-1 flex flex-col gap-6 sticky top-32">
            <div className="flex flex-col">
              <h2 className="text-4xl text-(--muted-text)">Totale ordine</h2>
              <p className="text-3xl font-semibold text-primary">
                {formattedTotal}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button className="btn btn-primary">
                <Link href="/checkout" className="text-lg">
                  Procedi con l&apos;ordine
                </Link>
              </button>
              <button className="btn btn-link">
                <Link href="/" className="text-md md:text-lg">
                  Torna allo shop
                </Link>
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
