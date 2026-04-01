const EUR_CURRENCY_FORMATTER = new Intl.NumberFormat("it-IT", {
  style: "currency",
  currency: "EUR",
});

export function formatCurrency(value) {
  return EUR_CURRENCY_FORMATTER.format(Number(value ?? 0));
}
