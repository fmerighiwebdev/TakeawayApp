import supabaseServer from "./supabaseServer";
import { headers } from "next/headers";
import { cache } from "react";

export const getTenantId = cache(async function getTenantId() {
  const tenantId = (await headers()).get("x-tenant-id");

  if (!tenantId) {
    throw new Error("Tenant ID non trovato negli headers");
  }

  return tenantId;
});

const getTenantRecord = cache(async function getTenantRecord(tenantId) {
  const { data: tenantData, error } = await supabaseServer
    .from("tenants")
    .select("*")
    .eq("id", tenantId)
    .single();

  if (error || !tenantData) {
    throw new Error(error?.message || "Tenant non trovato");
  }

  return tenantData;
});

const getTenantSettingsRecord = cache(async function getTenantSettingsRecord(
  tenantId,
) {
  const { data: tenantSettings, error } = await supabaseServer
    .from("tenant_settings")
    .select(
      "is_completed, assets, smtp, metadata, theme, ui, pickup_times, features",
    )
    .eq("tenant_id", tenantId)
    .single();

  if (error || !tenantSettings) {
    throw new Error(error?.message || "Configurazione del tenant non trovata");
  }

  return tenantSettings;
});

export const getTenantContext = cache(async function getTenantContext(tenantId) {
  const resolvedTenantId = tenantId ?? (await getTenantId());

  const [tenantDetails, tenantSettings] = await Promise.all([
    getTenantRecord(resolvedTenantId),
    getTenantSettingsRecord(resolvedTenantId),
  ]);

  return {
    tenantId: resolvedTenantId,
    tenantDetails,
    tenantSettings,
    isCompleted: Boolean(tenantSettings.is_completed),
    assets: tenantSettings.assets || {},
    smtp: tenantSettings.smtp || {},
    metadata: tenantSettings.metadata || {},
    theme: tenantSettings.theme || {},
    ui: tenantSettings.ui || {},
    pickupTimes: tenantSettings.pickup_times || [],
    features: tenantSettings.features || {},
  };
});

export async function getTenantDetails(tenantId) {
  const tenantContext = await getTenantContext(tenantId);
  return tenantContext.tenantDetails;
}

export async function getTenantCompletion(tenantId) {
  const tenantContext = await getTenantContext(tenantId);
  return tenantContext.isCompleted;
}

export async function getTenantAssets(tenantId) {
  const tenantContext = await getTenantContext(tenantId);
  return tenantContext.assets;
}

export async function getTenantSMTPConfig(tenantId) {
  const tenantContext = await getTenantContext(tenantId);
  return tenantContext.smtp;
}

export async function getTenantMetadata(tenantId) {
  const tenantContext = await getTenantContext(tenantId);
  return tenantContext.metadata;
}

export async function getTenantTheme(tenantId) {
  const tenantContext = await getTenantContext(tenantId);
  return tenantContext.theme;
}

export async function getTenantUI(tenantId) {
  const tenantContext = await getTenantContext(tenantId);
  return tenantContext.ui;
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

  return data ?? null;
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
      error.message || "Impossibile recuperare le sottocategorie",
    );
  }

  return data;
}

export async function getTenantPickupTimes(tenantId) {
  const tenantContext = await getTenantContext(tenantId);
  return tenantContext.pickupTimes;
}

export async function getTenantFeatures(tenantId) {
  const tenantContext = await getTenantContext(tenantId);
  return tenantContext.features;
}

export async function getTenantDiscounts(tenantId) {
  const { data, error } = await supabaseServer
    .from("discount_codes")
    .select("*")
    .eq("tenant_id", tenantId)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message || "Impossibile recuperare gli sconti");
  }

  return data;
}
