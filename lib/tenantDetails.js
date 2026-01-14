import supabaseServer from "./supabaseServer";
import { headers } from "next/headers";

export async function getTenantId() {
  const tenantId = (await headers()).get("x-tenant-id");
  if (!tenantId) {
    throw new Error("Tenant ID non trovato negli headers");
  }
  return tenantId;
}

export async function getTenantDetails(tenantId) {
  const { data: tenantData, error } = await supabaseServer
    .from("tenants")
    .select("*")
    .eq("id", tenantId)
    .single();

  if (error || !tenantData) {
    throw new Error(error?.message || "Tenant non trovato");
  }

  return tenantData;
}

export async function getTenantCompletion(tenantId) {
  const { data: tenantData, error } = await supabaseServer
    .from("tenant_settings")
    .select("is_completed")
    .eq("tenant_id", tenantId)
    .single();

  if (error || !tenantData) {
    throw new Error(error?.message || "Impossibile recuperare lo stato di completamento del tenant");
  }

  return tenantData.is_completed;
}

export async function getTenantAssets(tenantId) {
  if (!tenantId) {
    throw new Error("Tenant ID non fornito");
  }

  const { data: tenantData, error } = await supabaseServer
    .from("tenant_settings")
    .select("assets")
    .eq("tenant_id", tenantId)
    .single();

  if (error || !tenantData) {
    throw new Error(error?.message || "Logo del tenant non trovato");
  }

  return tenantData.assets;
}

export async function getTenantSMTPConfig(tenantId) {
  const { data: tenantData, error } = await supabaseServer
    .from("tenant_settings")
    .select("smtp")
    .eq("tenant_id", tenantId)
    .single();

  if (error || !tenantData) {
    throw new Error(error?.message || "Configurazione SMTP del tenant non trovata");
  }

  return tenantData.smtp;
}

export async function getTenantMetadata(tenantId) {
  const { data: tenantData, error } = await supabaseServer
    .from("tenant_settings")
    .select("metadata")
    .eq("tenant_id", tenantId)
    .single();

  if (error || !tenantData) {
    throw new Error(error?.message || "Metadata del tenant non trovati");
  }

  return tenantData.metadata;
}

export async function getTenantTheme(tenantId) {
  const { data: tenantData, error } = await supabaseServer
    .from("tenant_settings")
    .select("theme")
    .eq("tenant_id", tenantId)
    .single();

  if (error || !tenantData) {
    throw new Error(error?.message || "Tema del tenant non trovato");
  }

  return tenantData.theme;
}

export async function getTenantCategories(tenantId) {
  const { data, error } = await supabaseServer
    .from("categories")
    .select("id, name, description, slug, sort_order, image_url")
    .eq("tenant_id", tenantId)
    .order("sort_order", { ascending: true });

  if (error) {
    throw new Error(error.message || "Impossibile recuperare le categorie");
  }

  return data;
}

export async function getTenantCategoryBySlug(tenantId, categorySlug) {
  const { data, error } = await supabaseServer
    .from("categories")
    .select("id, name, description, slug, sort_order, image_url")
    .eq("tenant_id", tenantId)
    .eq("slug", categorySlug)
    .maybeSingle();

  if (error) {
    throw new Error(error?.message || "Categoria non trovata");
  }
  if (!data) {
    return null;
  }

  return data;
}

export async function getTenantSubcategories(tenantId, categoryId) {
  const { data, error } = await supabaseServer
    .from("subcategories")
    .select("id, name, slug, sort_order")
    .eq("tenant_id", tenantId)
    .eq("category_id", categoryId)
    .order("sort_order", { ascending: true });

  if (error) {
    throw new Error(
      error.message || "Impossibile recuperare le sottocategorie"
    );
  }

  return data;
}

export async function getTenantPickupTimes(tenantId) {
  const { data, error } = await supabaseServer
    .from("tenant_settings")
    .select("pickup_times")
    .eq("tenant_id", tenantId)
    .single();

  if (error || !data) {
    throw new Error(
      error?.message || "Impossibile recuperare gli orari di ritiro."
    );
  }

  return data.pickup_times || [];
}

export async function getTenantFeatures(tenantId) {
  const { data, error } = await supabaseServer
    .from("tenant_settings")
    .select("features")
    .eq("tenant_id", tenantId)
    .single();

  if (error || !data) {
    throw new Error(
      error?.message || "Impossibile recuperare le funzionalità del tenant."
    );
  }
  return data.features || {};
}