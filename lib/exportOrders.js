function escapeCsvValue(value) {
  if (value === null || value === undefined) return '""';

  const stringValue = String(value).replace(/"/g, '""');
  return `"${stringValue}"`;
}

function formatCurrency(value) {
  if (value === null || value === undefined || value === "") return "";

  const numeric = typeof value === "number" ? value : Number(value);
  if (Number.isNaN(numeric)) return "";

  return numeric.toFixed(2).replace(".", ",");
}

function formatDateTime(value) {
  if (!value) {
    return { date: "", time: "" };
  }

  const date = new Date(value);

  return {
    date: new Intl.DateTimeFormat("it-IT", {
      timeZone: "Europe/Rome",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(date),
    time: new Intl.DateTimeFormat("it-IT", {
      timeZone: "Europe/Rome",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).format(date),
  };
}

function normalizeOptionValues(input) {
  if (!Array.isArray(input)) return [];

  return input
    .map((entry) => {
      if (entry === null || entry === undefined) return "";

      if (typeof entry === "string" || typeof entry === "number") {
        return String(entry);
      }

      if (typeof entry === "object") {
        return String(
          entry.name ??
            entry.label ??
            entry.value ??
            entry.title ??
            ""
        );
      }

      return "";
    })
    .filter(Boolean);
}

function formatOptionGroup(label, values) {
  if (!values.length) return "";
  return `${label}: ${values.join(", ")}`;
}

function formatOrderItems(items) {
  if (!Array.isArray(items) || items.length === 0) return "";

  return items
    .map((item) => {
      const quantity = item.quantity ?? 1;
      const name = item.product_name ?? item.name ?? "Prodotto";
      const unitPrice = formatCurrency(item.unit_price ?? item.price);

      const variants = normalizeOptionValues(item.selected_variants);
      const extras = normalizeOptionValues(item.selected_extras);

      const details = [
        unitPrice ? `€${unitPrice}` : "",
        formatOptionGroup("Varianti", variants),
        formatOptionGroup("Extra", extras),
      ].filter(Boolean);

      if (details.length > 0) {
        return `${quantity}x ${name} (${details.join(" | ")})`;
      }

      return `${quantity}x ${name}`;
    })
    .join(" ; ");
}

export function buildOrdersCsv(orders) {
  const headers = [
    "ID interno",
    "ID pubblico",
    "Data ordine",
    "Ora ordine",
    "Cliente",
    "Telefono",
    "Email",
    "Orario ritiro",
    "Stato",
    "Totale lordo",
    "Codice sconto",
    "Sconto percentuale",
    "Totale scontato",
    "Posticipato",
    "Note",
    "Articoli",
  ];

  const rows = orders.map((order) => {
    const { date, time } = formatDateTime(order.created_at);

    return [
      order.id,
      order.public_id ?? "",
      date,
      time,
      order.customer_name ?? "",
      order.customer_phone ?? "",
      order.customer_email ?? "",
      order.pickup_time ?? "",
      order.status ?? "",
      formatCurrency(order.total_price),
      order.discount_code ?? "",
      order.percent_off ?? "",
      formatCurrency(order.discounted_price),
      order.is_postponed ? "Sì" : "No",
      order.notes ?? "",
      formatOrderItems(order.order_items),
    ];
  });

  const csvLines = [
    headers.map(escapeCsvValue).join(";"),
    ...rows.map((row) => row.map(escapeCsvValue).join(";")),
  ];

  return csvLines.join("\n");
}