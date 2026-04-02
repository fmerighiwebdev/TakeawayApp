function cloneOption(option) {
  if (!option) {
    return null;
  }

  return {
    id: option.id ?? null,
    name: option.name ?? null,
    label: option.label ?? null,
    price:
      option.price != null
        ? Number(option.price)
        : null,
  };
}

function createCartProductSnapshot(product) {
  return {
    id: product?.id ?? product?.product_id ?? null,
    name: product?.name ?? product?.product?.name ?? "",
    price: Number(product?.price ?? product?.product?.price ?? 0),
    description:
      product?.description ??
      product?.product?.description ??
      null,
  };
}

function getOptionIdentifier(option) {
  if (!option) {
    return "none";
  }

  return String(option.id ?? option.name ?? option.label ?? "none");
}

function compareCartOptions(left, right) {
  const leftIdentifier = getOptionIdentifier(left);
  const rightIdentifier = getOptionIdentifier(right);

  const leftNumber = Number(leftIdentifier);
  const rightNumber = Number(rightIdentifier);

  if (!Number.isNaN(leftNumber) && !Number.isNaN(rightNumber)) {
    return leftNumber - rightNumber;
  }

  return leftIdentifier.localeCompare(rightIdentifier);
}

function normalizeCartOptionList(options = []) {
  return [...(options || [])]
    .filter(Boolean)
    .map((option) => ({ ...option }))
    .sort(compareCartOptions);
}

export function buildCartSelectionKey(
  productId,
  {
    selectedDough = null,
    selectedExtras = [],
    selectedRemovals = [],
    selectedCookingOption = null,
    selectedSpiceLevel = null,
  } = {},
) {
  return [
    String(productId ?? "unknown-product"),
    getOptionIdentifier(selectedDough),
    normalizeCartOptionList(selectedExtras)
      .map(getOptionIdentifier)
      .join(",") || "none",
    normalizeCartOptionList(selectedRemovals)
      .map(getOptionIdentifier)
      .join(",") || "none",
    getOptionIdentifier(selectedCookingOption),
    getOptionIdentifier(selectedSpiceLevel),
  ].join("|");
}

export function buildCartItemKey(item) {
  return buildCartSelectionKey(item?.product_id ?? item?.id, {
    selectedDough: item?.selectedDough,
    selectedExtras: item?.selectedExtras,
    selectedRemovals: item?.selectedRemovals,
    selectedCookingOption: item?.selectedCookingOption,
    selectedSpiceLevel: item?.selectedSpiceLevel,
  });
}

export function normalizeCartItem(
  product,
  {
    quantity,
    selectedDough = null,
    selectedExtras,
    selectedRemovals,
    selectedCookingOption = null,
    selectedSpiceLevel = null,
  } = {},
) {
  return {
    ...createCartProductSnapshot(product),
    quantity: Number(quantity ?? product?.quantity ?? 1),
    selectedDough: cloneOption(selectedDough ?? product?.selectedDough),
    selectedExtras: normalizeCartOptionList(
      selectedExtras ?? product?.selectedExtras,
    ),
    selectedRemovals: normalizeCartOptionList(
      selectedRemovals ?? product?.selectedRemovals,
    ),
    selectedCookingOption: cloneOption(
      selectedCookingOption ?? product?.selectedCookingOption,
    ),
    selectedSpiceLevel: cloneOption(
      selectedSpiceLevel ?? product?.selectedSpiceLevel,
    ),
  };
}

export function calculateCartLineUnitPrice(item) {
  const basePrice = Number(item?.price ?? item?.product?.price ?? 0);
  const doughPrice = Number(item?.selectedDough?.price ?? item?.dough?.price ?? 0);
  const extras =
    item?.selectedExtras ??
    item?.extras ??
    [];
  const extrasTotal = extras.reduce(
    (sum, extra) => sum + Number(extra?.price ?? 0),
    0,
  );

  return basePrice + doughPrice + extrasTotal;
}

export function calculateCartLineTotal(item) {
  return calculateCartLineUnitPrice(item) * Number(item?.quantity ?? 0);
}

export function calculateCartTotal(items = []) {
  return items.filter(Boolean).reduce(
    (sum, item) => sum + calculateCartLineTotal(item),
    0,
  );
}

export function calculateDiscountAmount(total, percentOff = 0) {
  const normalizedTotal = Number(total ?? 0);
  const normalizedPercentOff = Number(percentOff ?? 0);

  if (normalizedPercentOff <= 0) {
    return 0;
  }

  return (normalizedTotal * normalizedPercentOff) / 100;
}

export function calculateDiscountedTotal(total, percentOff = 0) {
  return Math.max(Number(total ?? 0) - calculateDiscountAmount(total, percentOff), 0);
}
