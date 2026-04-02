"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { Minus, Plus, Trash } from "lucide-react";
import { toast } from "sonner";

import CartItemSummary from "@/components/cart/cart-item-summary";
import { buildCartItemKey } from "@/lib/cart";
import { formatCurrency } from "@/lib/currency";
import { useCartStore } from "@/store/cart";
import { Card, CardContent } from "./ui/card";
import { Spinner } from "./ui/spinner";

export default function CartItems() {
  const { cart, updateQuantity, hydrated, getTotalPrice, removeFromCart } =
    useCartStore();

  const total = getTotalPrice();
  const formattedTotal = formatCurrency(total);

  if (hydrated && cart.length === 0) {
    return (
      <section className="w-screen h-dvh absolute top-0 left-0 flex items-center justify-center pt-20 pb-24 lg:pt-16">
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
                        <CartItemSummary
                          item={item}
                          headerAction={
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
                                  item.selectedSpiceLevel,
                                );
                              }}
                            >
                              <Trash className="size-5 cursor-pointer text-red-700 transition duration-300 hover:text-red-900 md:size-7" />
                            </button>
                          }
                        />

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
                            <Minus className="size-5 md:size-7" />
                          </button>
                          <span className="text-lg md:text-xl text-(--muted-text)">
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
                            <Plus className="size-5 md:size-7" />
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
