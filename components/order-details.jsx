"use client";

import { Clock } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Input } from "./ui/input";
import axios from "axios";

const currencyFormatter = new Intl.NumberFormat("it-IT", {
  style: "currency",
  currency: "EUR",
});

function formatCurrency(value) {
  return currencyFormatter.format(value);
}

function buildOrderItemKey(item) {
  const dough = item.dough?.name || "no-dough";
  const extras =
    item.extras.map((extra) => extra.name).join(",") || "no-extras";
  const removals =
    item.removals.map((removal) => removal.name).join(",") || "no-removals";
  const cooking = item.cooking?.label || "no-cooking";
  const spice = item.spice?.label || "no-spice";

  return `${item.id}-${dough}-${extras}-${removals}-${cooking}-${spice}`;
}

function getOrderItemRowPrice(item) {
  const base = item.product.price;
  const doughPrice = item.dough?.price || 0;
  const extrasTotal = item.extras.reduce(
    (acc, extra) => acc + Number(extra.price),
    0
  );

  const singleUnitPrice = base + doughPrice + extrasTotal;
  return singleUnitPrice * item.quantity;
}

export default function OrderDetails({ orderDetails, publicDetails, orderId }) {
  const formattedTotalPrice = formatCurrency(orderDetails?.total_price);

  const router = useRouter();

  const [completeOpen, setShowConfirmation] = useState(false);
  const [postponeOpen, setShowPostponement] = useState(false);

  const [postponementTime, setPostponementTime] = useState("");
  const [pickupTime, setPickupTime] = useState(orderDetails.pickup_time);

  async function handleCompleteOrder() {
    try {
      const response = await axios.patch(`/api/admin/orders/${orderId}`, {
        newStatus: "Completato",
      });

      toast.success("Ordine completato con successo!");
      router.replace("/dashboard");
    } catch (error) {
      console.error(error);
    }
  }

  async function handlePostponeTime() {
    try {
      await axios.patch(`/api/admin/orders/${orderId}`, {
        postponementTime: postponementTime,
      });

      toast.success("Orario di ritiro aggiornato con successo!");
      setPickupTime(postponementTime);
      setShowPostponement(false);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="max-w-3xl w-full">
      <div className="flex flex-col gap-10">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <h2 className="text-4xl text-(--muted-text)">Dettagli ordine</h2>
            <div className="separator-horizontal"></div>
          </div>
          <div className="flex items-start justify-between gap-2">
            <div className="flex flex-col gap-5">
              <span className="text-3xl text-white bg-primary px-2 rounded-sm w-fit">
                #{orderDetails.id}
              </span>
              <div className="flex flex-col">
                <p className="text-3xl text-(--muted-text)">
                  {orderDetails.customer_name}
                </p>
                <a
                  href={`tel:${orderDetails.customer_phone}`}
                  className="text-lg text-(--muted-light-text)"
                >
                  {orderDetails.customer_phone}
                </a>
                <a
                  href={`mailto:${orderDetails.customer_email}`}
                  className="text-lg text-(--muted-light-text)"
                >
                  {orderDetails.customer_email}
                </a>
              </div>
            </div>
            <div className="flex flex-col items-end gap-4">
              <div className="flex items-center gap-2">
                <Clock className="w-8 h-8 text-primary" strokeWidth={1.5} />
                <p className="text-2xl text-primary font-medium">
                  {pickupTime}
                </p>
              </div>
              {!publicDetails && (
                <div className="flex flex-col gap-2">
                  <Dialog
                    open={completeOpen}
                    onOpenChange={setShowConfirmation}
                  >
                    <DialogTrigger asChild>
                      <button className="btn btn-primary btn-sm">
                        Completa ordine
                      </button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle className="text-primary text-2xl">
                          Completa ordine n.{orderId}
                        </DialogTitle>
                        <DialogDescription className="text-md">
                          L&apos;azione non può essere annullata.
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter>
                        <DialogClose asChild>
                          <button type="button" className="btn btn-link">
                            Annulla
                          </button>
                        </DialogClose>
                        <button
                          type="button"
                          className="btn btn-primary"
                          onClick={handleCompleteOrder}
                        >
                          Conferma
                        </button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                  <Dialog
                    open={postponeOpen}
                    onOpenChange={setShowPostponement}
                  >
                    <DialogTrigger asChild>
                      <button className="btn btn-link btn-sm">
                        Posticipa orario ritiro
                      </button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle className="text-primary text-2xl">
                          Nuovo orario ritiro ordine
                        </DialogTitle>
                        <DialogDescription className="text-md">
                          Seleziona il nuovo orario di ritiro dell&apos;ordine:
                        </DialogDescription>
                      </DialogHeader>
                      <div>
                        <Input
                          type="time"
                          value={postponementTime}
                          onChange={(e) => setPostponementTime(e.target.value)}
                        />
                      </div>
                      <DialogFooter>
                        <DialogClose asChild>
                          <button type="button" className="btn btn-link">
                            Annulla
                          </button>
                        </DialogClose>
                        <button
                          type="button"
                          className="btn btn-primary"
                          onClick={handlePostponeTime}
                        >
                          Conferma
                        </button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <h2 className="text-4xl text-(--muted-text)">Prodotti</h2>
            <div className="separator-horizontal"></div>
          </div>
          <Card className="w-full">
            <CardContent>
              {orderDetails.items && orderDetails.items.length > 0 ? (
                orderDetails.items.map((item) => {
                  const key = buildOrderItemKey(item);
                  const itemPrice = getOrderItemRowPrice(item);
                  const formattedItemPrice = formatCurrency(itemPrice);
                  const formattedDoughPrice = item.dough
                    ? formatCurrency(item.dough.price)
                    : null;

                  return (
                    <div
                      key={key}
                      className="flex flex-col gap-4 relative cart-item"
                    >
                      <div className="flex flex-col">
                        <h3 className="text-2xl md:text-3xl text-(--muted-text)">
                          {item.product.name}
                        </h3>
                        <p className="font-semibold text-xl md:text-2xl text-primary">
                          {item.quantity}x {formattedItemPrice}
                        </p>

                        {(item.dough ||
                          item.extras.length > 0 ||
                          item.removals.length > 0 ||
                          item.cooking ||
                          item.spice) && (
                          <div className="flex flex-col">
                            {item.dough && (
                              <p className="text-(--muted-light-text) text-sm">
                                {item.dough.name} ({formattedDoughPrice})
                              </p>
                            )}

                            {item.extras.length > 0 &&
                              item.extras.map((extra) => (
                                <p
                                  key={extra.id ?? extra.name}
                                  className="text-(--muted-light-text) text-sm"
                                >
                                  + {extra.name} ({formatCurrency(extra.price)})
                                </p>
                              ))}

                            {item.removals.length > 0 &&
                              item.removals.map((removal) => (
                                <p
                                  key={removal.id ?? removal.name}
                                  className="text-(--muted-light-text) text-sm"
                                >
                                  - {removal.name}
                                </p>
                              ))}

                            {item.cooking && (
                              <p className="text-(--muted-light-text) text-sm">
                                Cottura &quot;{item.cooking.label}&quot;
                              </p>
                            )}

                            {item.spice && (
                              <p className="text-(--muted-light-text) text-sm">
                                {item.spice.label}
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                      {item.product.description && (
                        <p className="font-medium text-(--muted-light-text)">
                          <em>{item.product.description}</em>
                        </p>
                      )}
                    </div>
                  );
                })
              ) : (
                <p className="text-(--muted-light-text)">Nessun prodotto</p>
              )}
            </CardContent>
          </Card>
        </div>
        {orderDetails.notes && (
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <h2 className="text-4xl text-(--muted-text)">Note aggiuntive</h2>
              <div className="separator-horizontal"></div>
            </div>
            <p className="text-(--muted-light-text) text-lg">{orderDetails.notes}</p>
          </div>
        )}

        {/* Totale ordine */}
        <div className="flex justify-end">
          <div className="text-right">
            <p className="text-2xl uppercase font-medium text-(--muted-text)">
              Totale
            </p>
            <p className="text-4xl font-semibold text-primary">
              {formattedTotalPrice}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
