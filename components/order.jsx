// components/order.jsx
import Link from "next/link";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Check, CheckCheck, Clock, HandPlatter, Tag } from "lucide-react";

const currencyFormatter = new Intl.NumberFormat("it-IT", {
  style: "currency",
  currency: "EUR",
});

function formatCurrency(value) {
  return currencyFormatter.format(Number(value ?? 0));
}

export default function Order({ order, numberOfItems }) {
  const total = Number(order.total_price ?? 0);
  const discounted =
    order.discounted_price != null ? Number(order.discounted_price) : null;

  const hasDiscount = discounted != null && discounted < total;

  const formattedTotalPrice = formatCurrency(total);
  const formattedDiscountedPrice = hasDiscount ? formatCurrency(discounted) : null;

  // created_at -> GG/MM, HH:MM
  const formattedCreatedAt = new Date(order.created_at).toLocaleString("it-IT", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <Link href={`/dashboard/ordine/${order.id}`}>
      <Card>
        <CardContent>
          <div className="flex items-start justify-between relative">
            <div className="flex items-start gap-4 flex-col md:flex-row">
              <span className="text-2xl md:text-3xl shadow-sm text-white bg-primary block px-2 rounded-sm w-fit">
                #{order.id}
              </span>

              <div>
                <div className="items-center gap-2 flex sm:hidden">
                  <Clock className="size-6 text-primary" strokeWidth={1.5} />
                  <p className="text-xl md:text-2xl text-primary font-medium">
                    {order.pickup_time}
                  </p>
                </div>

                <p className="text-2xl md:text-3xl text-(--muted-text)">
                  {order.customer_name}
                </p>

                {/* Prezzo */}
                {!hasDiscount ? (
                  <p className="text-xl md:text-2xl text-primary font-medium">
                    {formattedTotalPrice}
                  </p>
                ) : (
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-base md:text-lg text-(--muted-light-text) line-through">
                      {formattedTotalPrice}
                    </p>
                    <p className="text-xl md:text-2xl text-primary font-medium">
                      {formattedDiscountedPrice}
                    </p>

                    {/* opzionale: mini badge sconto */}
                    <span className="inline-flex items-center gap-1 text-xs md:text-sm text-green-700 bg-green-100 px-2 py-0.5 rounded-full">
                      <Tag className="size-3.5" />
                      -{order.percent_off}%
                    </span>
                  </div>
                )}

                <p className="text-lg md:text-xl text-(--muted-light-text)">
                  {numberOfItems === 1
                    ? `${numberOfItems} prodotto`
                    : `${numberOfItems} prodotti`}
                </p>
              </div>
            </div>

            {/* Status badge */}
            <Badge
              className={`text-xs md:text-md absolute top-0 right-0 shadow-sm ${
                order.status === "In Attesa"
                  ? "bg-yellow-400 text-yellow-900"
                  : order.status === "Completato"
                  ? "bg-green-500 text-white"
                  : "bg-blue-500 text-white"
              }`}
            >
              {order.status === "In Attesa" ? (
                <HandPlatter className="text-yellow-900" strokeWidth={1.75} />
              ) : order.status === "Completato" ? (
                <CheckCheck className="text-white" />
              ) : (
                <Check className="text-white" />
              )}
              {order.status === "In Attesa"
                ? "In Attesa"
                : order.status === "Completato"
                ? "Completato"
                : "Pronto"}
            </Badge>

            <div className="flex flex-col items-end gap-2 mt-7">
              <p className="text-xs md:text-md text-(--muted-light-text)">
                {formattedCreatedAt}
              </p>
              <div className="items-center gap-2 hidden sm:flex">
                <Clock className="size-6 text-primary" strokeWidth={1.5} />
                <p className="text-xl md:text-2xl text-primary font-medium">
                  {order.pickup_time}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
