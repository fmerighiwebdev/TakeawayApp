"use client";

import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/currency";
import {
  buildOrderItemKey,
  getOrderItemRowPrice,
} from "@/lib/orderPresentation";

export default function OrderItemsCard({ items }) {
  if (!items?.length) {
    return (
      <Card className="w-full">
        <CardContent>
          <p className="text-(--muted-light-text)">Nessun prodotto</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardContent>
        {items.map((item) => {
          const key = buildOrderItemKey(item);
          const itemPrice = getOrderItemRowPrice(item);
          const formattedItemPrice = formatCurrency(itemPrice);
          const formattedDoughPrice = item.dough
            ? formatCurrency(item.dough.price)
            : null;

          return (
            <div key={key} className="cart-item relative flex flex-col gap-4">
              <div className="flex flex-col">
                <h3 className="text-2xl text-(--muted-text) md:text-3xl">
                  {item.product.name}
                </h3>
                <p className="text-xl font-semibold text-primary md:text-2xl">
                  {item.quantity}x {formattedItemPrice}
                </p>

                {(item.dough ||
                  item.extras.length > 0 ||
                  item.removals.length > 0 ||
                  item.cooking ||
                  item.spice) && (
                  <div className="flex flex-col">
                    {item.dough && (
                      <p className="text-sm text-(--muted-light-text)">
                        {item.dough.name} ({formattedDoughPrice})
                      </p>
                    )}

                    {item.extras.length > 0 &&
                      item.extras.map((extra) => (
                        <p
                          key={extra.id ?? extra.name}
                          className="text-sm text-(--muted-light-text)"
                        >
                          + {extra.name} ({formatCurrency(extra.price)})
                        </p>
                      ))}

                    {item.removals.length > 0 &&
                      item.removals.map((removal) => (
                        <p
                          key={removal.id ?? removal.name}
                          className="text-sm text-(--muted-light-text)"
                        >
                          - {removal.name}
                        </p>
                      ))}

                    {item.cooking && (
                      <p className="text-sm text-(--muted-light-text)">
                        Cottura &quot;{item.cooking.label}&quot;
                      </p>
                    )}

                    {item.spice && (
                      <p className="text-sm text-(--muted-light-text)">
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
        })}
      </CardContent>
    </Card>
  );
}
