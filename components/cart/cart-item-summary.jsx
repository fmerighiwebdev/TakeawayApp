"use client";

import { calculateCartLineTotal } from "@/lib/cart";
import { formatCurrency } from "@/lib/currency";

export default function CartItemSummary({ item, headerAction = null }) {
  const formattedItemPrice = formatCurrency(calculateCartLineTotal(item));
  const formattedDoughPrice = item.selectedDough
    ? formatCurrency(item.selectedDough.price)
    : null;

  return (
    <>
      <div className="flex flex-col">
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-3xl text-(--muted-text) md:text-4xl">
            {item.name}
          </h3>
          {headerAction}
        </div>

        <p className="text-xl font-semibold text-primary md:text-2xl">
          +{formattedItemPrice}
        </p>

        {item.selectedDough && (
          <p className="text-sm text-(--muted-light-text)">
            {item.selectedDough.name} ({formattedDoughPrice})
          </p>
        )}

        {item.selectedExtras.length > 0 &&
          item.selectedExtras.map((extra) => (
            <p
              key={extra.id ?? extra.name}
              className="text-sm text-(--muted-light-text)"
            >
              + {extra.name} ({formatCurrency(extra.price)})
            </p>
          ))}

        {item.selectedRemovals.length > 0 &&
          item.selectedRemovals.map((removal) => (
            <p
              key={removal.id ?? removal.name}
              className="text-sm text-(--muted-light-text)"
            >
              - {removal.name}
            </p>
          ))}

        {item.selectedCookingOption && (
          <p className="text-sm text-(--muted-light-text)">
            Cottura &quot;{item.selectedCookingOption.label}&quot;
          </p>
        )}

        {item.selectedSpiceLevel && (
          <p className="text-sm text-(--muted-light-text)">
            {item.selectedSpiceLevel.label}
          </p>
        )}
      </div>

      {item.description && (
        <p className="font-medium text-(--muted-light-text)">
          <em>{item.description}</em>
        </p>
      )}
    </>
  );
}
