const PHONE_REGEX = /^\d{10,15}$/;
const EMAIL_REGEX = /^\S+@\S+\.\S+$/;

export class OrderRequestError extends Error {
  constructor(message, status = 400) {
    super(message);
    this.name = "OrderRequestError";
    this.status = status;
  }
}

export function normalizeDiscountCode(code) {
  return (code ?? "").trim().toUpperCase().replace(/\s+/g, "");
}

export function normalizeEmail(email) {
  return (email ?? "").trim().toLowerCase();
}

export function normalizePhone(phone) {
  return (phone ?? "").replace(/\D/g, "");
}

function parseIntegerId(value) {
  const parsed = Number(value);

  if (!Number.isInteger(parsed) || parsed <= 0) {
    return null;
  }

  return parsed;
}

function sanitizeIdList(input) {
  if (!Array.isArray(input)) {
    return [];
  }

  return Array.from(
    new Set(input.map(parseIntegerId).filter((value) => value !== null)),
  );
}

function sanitizeOrderItem(item, index) {
  const productId = parseIntegerId(item?.product_id ?? item?.id);
  const quantity = Number(item?.quantity);

  if (!productId) {
    throw new OrderRequestError(
      `Prodotto non valido alla posizione ${index + 1}.`,
    );
  }

  if (!Number.isInteger(quantity) || quantity <= 0) {
    throw new OrderRequestError(
      `Quantita non valida per il prodotto alla posizione ${index + 1}.`,
    );
  }

  return {
    product_id: productId,
    quantity,
    selected_dough_id: parseIntegerId(
      item?.selected_dough_id ?? item?.selectedDough?.id,
    ),
    selected_extra_ids: sanitizeIdList(
      item?.selected_extra_ids ??
        item?.selectedExtras?.map((extra) => extra?.id),
    ),
    selected_removal_ids: sanitizeIdList(
      item?.selected_removal_ids ??
        item?.selectedRemovals?.map((removal) => removal?.id),
    ),
    selected_cooking_option_id: parseIntegerId(
      item?.selected_cooking_option_id ?? item?.selectedCookingOption?.id,
    ),
    selected_spice_level_id: parseIntegerId(
      item?.selected_spice_level_id ?? item?.selectedSpiceLevel?.id,
    ),
  };
}

export function serializeOrderItemsForRequest(items) {
  if (!Array.isArray(items)) {
    return [];
  }

  return items.map(sanitizeOrderItem);
}

export function validateCreateOrderInput(payload) {
  const firstName = String(payload?.name ?? "").trim();
  const lastName = String(payload?.surname ?? "").trim();
  const pickupTime = String(payload?.time ?? "").trim();
  const phone = normalizePhone(payload?.phone);
  const email = normalizeEmail(payload?.email);
  const notes = String(payload?.notes ?? "").trim();
  const items = serializeOrderItemsForRequest(payload?.items);
  const discountCode = normalizeDiscountCode(payload?.discount_code);

  if (!firstName || !lastName || !pickupTime || !phone || !email) {
    throw new OrderRequestError("Dati mancanti");
  }

  if (!PHONE_REGEX.test(phone)) {
    throw new OrderRequestError("Inserisci un numero di telefono valido");
  }

  if (!EMAIL_REGEX.test(email)) {
    throw new OrderRequestError("Inserisci un indirizzo email valido");
  }

  if (items.length === 0) {
    throw new OrderRequestError("L'ordine deve contenere almeno un elemento");
  }

  return {
    firstName,
    lastName,
    pickupTime,
    phone,
    email,
    notes: notes || null,
    discountCode: discountCode || null,
    items,
  };
}

const RPC_ERROR_MESSAGES = {
  CUSTOMER_DATA_REQUIRED: "Dati cliente incompleti.",
  INVALID_PHONE: "Inserisci un numero di telefono valido",
  INVALID_EMAIL: "Inserisci un indirizzo email valido",
  INVALID_PICKUP_TIME: "Seleziona un orario di ritiro valido.",
  ORDER_ITEMS_REQUIRED: "L'ordine deve contenere almeno un elemento",
  INVALID_PRODUCT_REFERENCE: "Uno o piu prodotti non sono validi.",
  INVALID_PRODUCT_QUANTITY: "Quantita non valida per uno dei prodotti.",
  INVALID_DOUGH_OPTION: "Una personalizzazione impasto non e valida.",
  INVALID_EXTRA_OPTION: "Una personalizzazione extra non e valida.",
  INVALID_REMOVAL_OPTION: "Una personalizzazione rimozione non e valida.",
  INVALID_COOKING_OPTION: "Una personalizzazione cottura non e valida.",
  INVALID_SPICE_LEVEL: "Una personalizzazione piccantezza non e valida.",
  INVALID_DISCOUNT_CODE: "Codice sconto non valido.",
  DISCOUNT_CODE_ALREADY_USED: "Hai gia utilizzato questo codice sconto.",
};

export function mapCreateOrderError(error) {
  if (error instanceof OrderRequestError) {
    return {
      status: error.status ?? 400,
      message: error.message,
    };
  }

  const code = String(error?.message ?? "").trim();

  if (RPC_ERROR_MESSAGES[code]) {
    return {
      status:
        code === "DISCOUNT_CODE_ALREADY_USED" ||
        code === "INVALID_DISCOUNT_CODE"
          ? 400
          : 400,
      message: RPC_ERROR_MESSAGES[code],
    };
  }

  return {
    status: 500,
    message: "Errore nella creazione dell'ordine. Riprova.",
  };
}
