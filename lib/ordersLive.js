import supabaseClient from "./supabaseClient";

export async function getOrdersByTenantIdLive(tenantId) {
  if (!tenantId) {
    throw new Error("Tenant ID obbligatorio");
  }

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
    .order("id", { ascending: false });

  if (error) {
    throw new Error(error.message || "Errore nel recupero ordini live");
  }

  return data;
}
