import supabaseClient from "./supabaseClient";

export async function getOrdersByTenantIdLive(tenantId) {
  if (!tenantId) {
    throw new Error("Tenant ID obbligatorio");
  }

  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);

  const { data, error } = await supabaseClient
    .from("orders")
    .select(
      `
        *,
        order_items (
          id
        )
      `
    )
    .eq("tenant_id", tenantId)
    .gte("created_at", startOfDay.toISOString())
    .lte("created_at", endOfDay.toISOString())
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message || "Errore nel recupero ordini live");
  }

  return data;
}
