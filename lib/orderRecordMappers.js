export const ORDER_ITEM_DETAILS_SELECT = `
  id,
  quantity,
  product:product_id (
    id,
    name,
    price,
    description,
    image_url
  ),
  order_item_extras (
    extra_option:extra_option_id (
      id,
      name,
      price
    )
  ),
  order_item_dough (
    dough_option:dough_option_id (
      id,
      name,
      price
    )
  ),
  order_item_removals (
    removal_option:removal_option_id (
      id,
      name
    )
  ),
  order_item_cooking (
    cooking_option:cooking_option_id (
      id,
      label
    )
  ),
  order_item_spice (
    spice_level:spice_level_id (
      id,
      label
    )
  )
`;

export const ORDER_WITH_DETAILS_SELECT = `
  id,
  customer_name,
  customer_phone,
  pickup_time,
  status,
  total_price,
  customer_email,
  is_postponed,
  tenant_id,
  public_id,
  notes,
  created_at,
  discount_code,
  percent_off,
  discounted_price,
  order_items (
    ${ORDER_ITEM_DETAILS_SELECT}
  )
`;

export function normalizeOrderItemDetails(item) {
  return {
    id: item.id,
    quantity: item.quantity,
    product: item.product,
    extras: (item.order_item_extras || []).map((entry) => entry.extra_option),
    dough: item.order_item_dough?.[0]?.dough_option || null,
    removals: (item.order_item_removals || []).map(
      (entry) => entry.removal_option,
    ),
    cooking: item.order_item_cooking?.[0]?.cooking_option || null,
    spice: item.order_item_spice?.[0]?.spice_level || null,
  };
}

export function normalizeOrderItemDetailsList(items = []) {
  return items.map(normalizeOrderItemDetails);
}

export function mapOrderWithStandaloneItems(order, items) {
  return {
    ...order,
    items: normalizeOrderItemDetailsList(items),
  };
}

export function mapOrderWithEmbeddedItems(order) {
  return {
    ...order,
    order_items: normalizeOrderItemDetailsList(order.order_items || []),
  };
}
