import {
  ORDER_SUMMARY_SELECT,
  mapOrderWithEmbeddedItems,
  mapOrderWithStandaloneItems,
  ORDER_ITEM_DETAILS_SELECT,
  ORDER_WITH_DETAILS_SELECT,
} from "./orderRecordMappers";
import {
  getPaginationRange,
  getTotalPages,
  normalizePage,
  normalizePageSize,
  normalizeSearchTerm,
  sanitizePostgrestSearchTerm,
} from "./listing";
import { getCurrentMonthDateRange, getTodayDateRange } from "./orderDateRanges";
import { normalizePhone } from "./orderRequest";
import supabaseServer from "./supabaseServer";

function applyOrderSearch(query, searchTerm) {
  const search = sanitizePostgrestSearchTerm(searchTerm);

  if (!search) {
    return query;
  }

  const filters = [
    `customer_name.ilike.%${search}%`,
    `customer_email.ilike.%${search}%`,
    `customer_phone.ilike.%${search}%`,
  ];

  const numericId = Number.parseInt(searchTerm, 10);
  if (Number.isInteger(numericId) && numericId > 0) {
    filters.push(`id.eq.${numericId}`);
  }

  const normalizedPhone = normalizePhone(searchTerm);
  if (normalizedPhone && normalizedPhone !== search) {
    filters.push(`customer_phone.ilike.%${normalizedPhone}%`);
  }

  return query.or(filters.join(","));
}

export async function createOrder(orderData, tenantId) {
  const { data, error } = await supabaseServer.rpc("create_takeaway_order", {
    p_tenant_id: tenantId,
    p_first_name: orderData.firstName,
    p_last_name: orderData.lastName,
    p_email: orderData.email,
    p_phone: orderData.phone,
    p_pickup_time: orderData.pickupTime,
    p_items: orderData.items,
    p_notes: orderData.notes,
    p_discount_code: orderData.discountCode,
    p_privacy_consent: true,
  });

  const result = Array.isArray(data) ? data[0] : data;

  if (error || !result) {
    throw new Error(error?.message || "Errore creazione ordine.");
  }

  return {
    id: result.order_id,
    publicId: result.order_public_id,
    customerId: result.customer_id,
    totalPrice: Number(result.total_price),
    discountedPrice:
      result.discounted_price !== null
        ? Number(result.discounted_price)
        : null,
    percentOff: result.percent_off,
    discountCode: result.applied_discount_code,
  };
}

export async function getOrderByIdWithDetails(tenantId, orderId) {
  const { data: order, error: orderError } = await supabaseServer
    .from("orders")
    .select("*")
    .eq("id", orderId)
    .eq("tenant_id", tenantId)
    .single();

  if (orderError || !order) {
    throw new Error(orderError?.message || "Ordine non trovato.");
  }

  const { data: items, error: itemsError } = await supabaseServer
    .from("order_items")
    .select(ORDER_ITEM_DETAILS_SELECT)
    .eq("order_id", orderId);

  if (itemsError) {
    throw new Error(itemsError?.message || "Errore nel recupero degli item.");
  }

  return mapOrderWithStandaloneItems(order, items || []);
}

export async function getOrderByPublicIdWithDetails(tenantId, publicId) {
  const { data: order, error: orderError } = await supabaseServer
    .from("orders")
    .select("*")
    .eq("public_id", publicId)
    .eq("tenant_id", tenantId)
    .maybeSingle();

  if (orderError) {
    throw new Error(orderError?.message || "Ordine non trovato.");
  }
  if (!order) {
    return null;
  }

  const { data: items, error: itemsError } = await supabaseServer
    .from("order_items")
    .select(ORDER_ITEM_DETAILS_SELECT)
    .eq("order_id", order.id);

  if (itemsError) {
    throw new Error(itemsError?.message || "Errore nel recupero degli item.");
  }

  return mapOrderWithStandaloneItems(order, items || []);
}

export async function getTodayOrdersByTenantId(tenantId) {
  if (!tenantId) {
    throw new Error("Tenant ID obbligatorio");
  }

  const { startAt, endAt } = getTodayDateRange();

  const { data, error } = await supabaseServer
    .from("orders")
    .select(ORDER_SUMMARY_SELECT)
    .eq("tenant_id", tenantId)
    .gte("created_at", startAt)
    .lte("created_at", endAt)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message || "Errore nel recupero ordini");
  }

  return data;
}

export async function getPastOrdersByTenantId(tenantId, options = {}) {
  if (!tenantId) {
    throw new Error("Tenant ID obbligatorio");
  }

  const page = normalizePage(options.page);
  const pageSize = normalizePageSize(options.pageSize, {
    fallback: 20,
    max: 100,
  });
  const search = normalizeSearchTerm(options.search);
  const status =
    typeof options.status === "string" ? options.status.trim() : "";
  const { startAt, endAt } =
    options.startAt && options.endAt
      ? {
          startAt: options.startAt,
          endAt: options.endAt,
        }
      : getCurrentMonthDateRange();
  const { from, to } = getPaginationRange(page, pageSize);

  let query = supabaseServer
    .from("orders")
    .select(ORDER_SUMMARY_SELECT, { count: "exact" })
    .eq("tenant_id", tenantId)
    .gte("created_at", startAt)
    .lt("created_at", endAt);

  if (status && status !== "all") {
    query = query.eq("status", status);
  }

  query = applyOrderSearch(query, search);

  const { data, error, count } = await query
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) {
    throw new Error(error.message || "Errore nel recupero ordini");
  }

  const totalCount = count ?? 0;

  return {
    orders: data || [],
    page,
    pageSize,
    search,
    status: status || "all",
    totalCount,
    totalPages: getTotalPages(totalCount, pageSize),
  };
}

export async function getPastOrdersByTenantIdWithDetails(tenantId, options = {}) {
  let query = supabaseServer
    .from("orders")
    .select(ORDER_WITH_DETAILS_SELECT)
    .eq("tenant_id", tenantId);

  if (options.startAt) {
    query = query.gte("created_at", options.startAt);
  }

  if (options.endAt) {
    query = query.lt("created_at", options.endAt);
  }

  const { data: orders, error: ordersError } = await query.order("created_at", {
    ascending: false,
  });

  if (ordersError) {
    throw new Error(
      ordersError?.message || "Errore nel recupero degli ordini completi."
    );
  }

  return (orders || []).map(mapOrderWithEmbeddedItems);
}

export async function updateOrderStatus(orderId, newStatus, tenantId) {
  if (!tenantId) {
    throw new Error("Tenant ID obbligatorio");
  }
  if (!orderId) {
    throw new Error("Order ID obbligatorio");
  }
  if (!newStatus) {
    throw new Error("Nuovo stato obbligatorio");
  }

  const { error } = await supabaseServer
    .from("orders")
    .update({ status: newStatus })
    .eq("id", orderId)
    .eq("tenant_id", tenantId);

  if (error) {
    throw new Error(error.message || "Errore nell'aggiornamento stato ordine");
  }

  return true;
}

export async function updatePickUpTime(orderId, newPickUpTime, tenantId) {
  if (!tenantId) {
    throw new Error("Tenant ID obbligatorio");
  }
  if (!orderId) {
    throw new Error("Order ID obbligatorio");
  }
  if (!newPickUpTime) {
    throw new Error("Nuovo orario di ritiro obbligatorio");
  }

  const { error } = await supabaseServer
    .from("orders")
    .update({ pickup_time: newPickUpTime, is_postponed: true })
    .eq("id", orderId)
    .eq("tenant_id", tenantId);

  if (error) {
    throw new Error(
      error.message || "Errore nell'aggiornamento orario di ritiro"
    );
  }

  return true;
}

export async function getOrderCustomerDetails(tenantId, orderId) {
  if (!tenantId || !orderId) {
    throw new Error("tenantId e orderId sono obbligatori.");
  }

  const { data, error } = await supabaseServer
    .from("orders")
    .select("customer_name, customer_phone, customer_email")
    .eq("id", orderId)
    .eq("tenant_id", tenantId)
    .single();

  if (error) {
    throw new Error(
      error.message || "Errore nel recupero delle informazioni del cliente."
    );
  }

  return data;
}

export async function clearOrders() {
  const now = new Date();

  const cutoffDate = new Date(
    now.getFullYear(),
    now.getMonth(),
    1,
    0,
    0,
    0,
    0
  );

  const readableDate = cutoffDate.toLocaleString("it-IT", {
    dateStyle: "full",
    timeStyle: "short",
  });

  console.log(
    `[CRON] Pulizia ordini antecedenti a: ${readableDate}`
  );

  const { error } = await supabaseServer
    .from("orders")
    .delete()
    .lt("created_at", cutoffDate.toISOString());

  if (error) {
    console.error("[CRON] Errore pulizia ordini:", error);
    throw new Error(error.message || "Errore nella cancellazione ordini");
  }

  console.log("[CRON] Pulizia ordini completata con successo");

  return { success: true };
}
