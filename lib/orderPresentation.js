import { formatCurrency } from "./currency";

export function buildOrderItemKey(item) {
  const dough = item.dough?.name || "no-dough";
  const extras =
    item.extras?.map((extra) => extra.name).join(",") || "no-extras";
  const removals =
    item.removals?.map((removal) => removal.name).join(",") || "no-removals";
  const cooking = item.cooking?.label || "no-cooking";
  const spice = item.spice?.label || "no-spice";

  return `${item.id}-${dough}-${extras}-${removals}-${cooking}-${spice}`;
}

export function getOrderItemRowPrice(item) {
  const basePrice = Number(item.product?.price ?? 0);
  const doughPrice = Number(item.dough?.price ?? 0);
  const extrasTotal =
    item.extras?.reduce(
      (sum, extra) => sum + Number(extra?.price ?? 0),
      0,
    ) ?? 0;

  return (basePrice + doughPrice + extrasTotal) * Number(item.quantity ?? 0);
}

export function getOrderPricingSummary(orderDetails) {
  const total = Number(orderDetails?.total_price ?? 0);
  const discounted =
    orderDetails?.discounted_price != null
      ? Number(orderDetails.discounted_price)
      : null;

  const hasDiscount =
    !!orderDetails?.discount_code &&
    orderDetails?.percent_off != null &&
    discounted != null &&
    discounted < total;

  const discountAmount = hasDiscount ? total - discounted : 0;

  return {
    total,
    discounted,
    hasDiscount,
    discountAmount,
    formattedTotalPrice: formatCurrency(total),
    formattedDiscountedPrice:
      discounted != null ? formatCurrency(discounted) : null,
    formattedDiscountAmount: hasDiscount
      ? formatCurrency(discountAmount)
      : null,
  };
}
