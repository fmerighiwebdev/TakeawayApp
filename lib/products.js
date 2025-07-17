import supabase from "./supabaseClient";

export async function getTenantProductsByCategory(categoryId, tenantId) {
  const { data: products, error } = await supabase
    .from("products")
    .select(
      "id, name, description, price, image_url, slug, has_customizations, spice_level, subcategory_id"
    )
    .eq("tenant_id", tenantId)
    .eq("category_id", categoryId)
    .order("name", { ascending: true });

  if (error) {
    throw new Error(error.message || "Impossibile recuperare i prodotti");
  }

  return products;
}

export async function getProductCustomizations(productId, tenantId) {
  const { data: product, error: productError } = await supabase
    .from("products")
    .select("id")
    .eq("id", productId)
    .eq("tenant_id", tenantId)
    .single();

  if (productError || !product) {
    throw new Error(
      productError?.message ||
        "Prodotto non trovato o non appartiene al tenant."
    );
  }

  const { data: extras, error: extrasError } = await supabase
    .from("extras_options")
    .select("id, name, price")
    .eq("product_id", productId);

  if (extrasError) {
    throw new Error(extrasError.message || "Errore nel recupero degli extra.");
  }

  const { data: doughs, error: doughsError } = await supabase
    .from("dough_options")
    .select("id, name, price")
    .eq("product_id", productId);

  if (doughsError) {
    throw new Error(
      doughsError.message || "Errore nel recupero degli impasti."
    );
  }

  const { data: cookings, error: cookingsError } = await supabase
    .from("cooking_options")
    .select("id, label")
    .eq("product_id", productId);

  if (cookingsError) {
    throw new Error(
      cookingsError.message || "Errore nel recupero delle cotture."
    );
  }

  const { data: spiceLevels, error: spiceError } = await supabase
    .from("spice_levels")
    .select("id, label")
    .eq("product_id", productId);

  if (spiceError) {
    throw new Error(spiceError.message || "Errore nel recupero del piccante.");
  }

  const { data: removals, error: removalsError } = await supabase
    .from("product_removal_options")
    .select("removal_options(id, name)")
    .eq("product_id", productId);

  if (removalsError) {
    throw new Error(
      removalsError.message || "Errore nel recupero delle rimozioni."
    );
  }

  // Ritorna un oggetto unico
  const customizations = {
    extras,
    doughs,
    cookings,
    spiceLevels,
    removals: removals.map((r) => ({
      id: r.removal_options.id,
      name: r.removal_options.name,
    })),
  };

  return customizations;
}