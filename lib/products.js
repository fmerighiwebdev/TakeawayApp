import supabaseServer from "./supabaseServer";

export async function getTenantProductsByCategory(categoryId, tenantId) {
  const { data: products, error } = await supabaseServer
    .from("products")
    .select(
      "id, name, description, price, image_url, slug, has_customizations, spice_level, subcategory_id",
    )
    .eq("tenant_id", tenantId)
    .eq("category_id", categoryId)
    .order("name", { ascending: true });

  if (error) {
    throw new Error(error.message || "Impossibile recuperare i prodotti");
  }

  return products;
}

function normalizeCustomizationsPayload(payload) {
  return {
    extras: Array.isArray(payload?.extras) ? payload.extras : [],
    doughs: Array.isArray(payload?.doughs) ? payload.doughs : [],
    cookings: Array.isArray(payload?.cookings) ? payload.cookings : [],
    spiceLevels: Array.isArray(payload?.spiceLevels)
      ? payload.spiceLevels
      : [],
    removals: Array.isArray(payload?.removals) ? payload.removals : [],
  };
}

function isMissingProductCustomizationsRpc(error) {
  const message = error?.message || "";

  return (
    error?.code === "PGRST202" ||
    message.includes("get_product_customizations")
  );
}

async function loadProductCustomizationsFallback(productId, tenantId) {
  const { data: product, error: productError } = await supabaseServer
    .from("products")
    .select("id")
    .eq("id", productId)
    .eq("tenant_id", tenantId)
    .single();

  if (productError || !product) {
    throw new Error(
      productError?.message ||
        "Prodotto non trovato o non appartiene al tenant.",
    );
  }

  const [
    { data: extras, error: extrasError },
    { data: doughs, error: doughsError },
    { data: cookings, error: cookingsError },
    { data: spiceLevels, error: spiceError },
    { data: removals, error: removalsError },
  ] = await Promise.all([
    supabaseServer
      .from("extras_options")
      .select("id, name, price")
      .eq("product_id", productId),
    supabaseServer
      .from("dough_options")
      .select("id, name, price")
      .eq("product_id", productId),
    supabaseServer
      .from("cooking_options")
      .select("id, label")
      .eq("product_id", productId),
    supabaseServer
      .from("spice_levels")
      .select("id, label")
      .eq("product_id", productId),
    supabaseServer
      .from("product_removal_options")
      .select("removal_options(id, name)")
      .eq("product_id", productId),
  ]);

  if (extrasError) {
    throw new Error(extrasError.message || "Errore nel recupero degli extra.");
  }

  if (doughsError) {
    throw new Error(
      doughsError.message || "Errore nel recupero degli impasti.",
    );
  }

  if (cookingsError) {
    throw new Error(
      cookingsError.message || "Errore nel recupero delle cotture.",
    );
  }

  if (spiceError) {
    throw new Error(spiceError.message || "Errore nel recupero del piccante.");
  }

  if (removalsError) {
    throw new Error(
      removalsError.message || "Errore nel recupero delle rimozioni.",
    );
  }

  return normalizeCustomizationsPayload({
    extras,
    doughs,
    cookings,
    spiceLevels,
    removals: (removals || []).map((entry) => ({
      id: entry.removal_options.id,
      name: entry.removal_options.name,
    })),
  });
}

export async function getProductCustomizations(productId, tenantId) {
  const parsedProductId = Number.parseInt(productId, 10);

  if (!Number.isInteger(parsedProductId) || parsedProductId < 1) {
    throw new Error("ID prodotto non valido.");
  }

  const { data, error } = await supabaseServer.rpc(
    "get_product_customizations",
    {
      p_tenant_id: tenantId,
      p_product_id: parsedProductId,
    },
  );

  if (!error) {
    return normalizeCustomizationsPayload(data);
  }

  if (!isMissingProductCustomizationsRpc(error)) {
    throw new Error(
      error.message || "Errore nel recupero delle personalizzazioni.",
    );
  }

  return loadProductCustomizationsFallback(parsedProductId, tenantId);
}

export async function getTopProductsByCategory(categoryId, tenantId) {
  const { data, error } = await supabaseServer.rpc(
    "get_top_products_by_category",
    {
      p_tenant_id: tenantId,
      p_category_id: categoryId,
      p_limit: 3,
      p_days: 30,
      p_min_qty: 3,
    },
  );

  if (error) {
    throw new Error(
      error.message || "Impossibile recuperare i prodotti più popolari",
    );
  }

  return data;
}

export async function getTopProducts(tenantId) {
  const { data, error } = await supabaseServer.rpc("get_top_products", {
    p_tenant_id: tenantId,
    p_limit: 3,
    p_days: 30,
    p_min_qty: 3,
  });

  if (error) {
    throw new Error(
      error.message || "Impossibile recuperare i prodotti più popolari",
    );
  }

  return data;
}

export async function getTopProductsPerCategory(tenantId) {
  const { data, error } = await supabaseServer.rpc("get_top_products_per_category", {
    p_tenant_id: tenantId,
    p_limit: 3,
    p_days: 30,
    p_min_qty: 3,
  });

  if (error) {
    throw new Error(
      error.message || "Impossibile recuperare i prodotti più popolari per categoria",
    );
  }

  return data;
}
