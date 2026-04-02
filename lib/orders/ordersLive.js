import { createSupabaseBrowserClient } from "../supabase/supabaseClient";
import { ORDER_SUMMARY_SELECT } from "./orderRecordMappers";
import { getTodayDateRange } from "./orderDateRanges";

export async function getOrdersByTenantIdLive(tenantId, adminAuthToken) {
  if (!tenantId) {
    throw new Error("Tenant ID obbligatorio");
  }

  const supabaseClient = createSupabaseBrowserClient(adminAuthToken);
  const { startAt, endAt } = getTodayDateRange();

  const { data, error } = await supabaseClient
    .from("orders")
    .select(ORDER_SUMMARY_SELECT)
    .eq("tenant_id", tenantId)
    .gte("created_at", startAt)
    .lte("created_at", endAt)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message || "Errore nel recupero ordini live");
  }

  return data;
}
