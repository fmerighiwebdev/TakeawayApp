import supabase from "./supabaseClient";

export async function createOrder(orderData, tenantId) {
  // Inserimento dell'ordine
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert([
      {
        tenant_id: tenantId,
        customer_name: orderData.full_name,
        customer_phone: orderData.phone,
        customer_email: orderData.email,
        pickup_time: orderData.time,
        total_price: orderData.total_price,
      },
    ])
    .select("id, public_id")
    .single();

  if (orderError || !order) {
    throw new Error(orderError?.message || "Errore creazione ordine.");
  }

  const orderId = order.id;

  // Inserimento degli item dell'ordine
  for (const item of orderData.items) {
    const { data: orderItem, error: itemError } = await supabase
      .from("order_items")
      .insert([
        {
          order_id: orderId,
          product_id: item.id,
          quantity: item.quantity,
        },
      ])
      .select("id")
      .single();

    if (itemError || !orderItem) {
      throw new Error(itemError?.message || "Errore creazione item ordine.");
    }

    const orderItemId = orderItem.id;

    console.log("Inserito item ordine:", item);

    // Inserimento delle personalizzazioni dell'item
    if (item.selectedExtras && item.selectedExtras.length > 0) {
      const extrasData = item.selectedExtras.map((extra) => ({
        order_item_id: orderItemId,
        extra_option_id: extra.id,
      }));

      const { error: extrasError } = await supabase
        .from("order_item_extras")
        .insert(extrasData);

      if (extrasError) {
        throw new Error(extrasError.message || "Errore inserimento extras.");
      }
    }

    if (item.selectedDough) {
      const { error: doughError } = await supabase
        .from("order_item_dough")
        .insert([
          {
            order_item_id: orderItemId,
            dough_option_id: item.selectedDough.id,
          },
        ]);

      if (doughError) {
        throw new Error(doughError.message || "Errore inserimento dough.");
      }
    }

    if (item.selectedRemovals && item.selectedRemovals.length > 0) {
      const removalsData = item.selectedRemovals.map((removal) => ({
        order_item_id: orderItemId,
        removal_option_id: removal.id,
      }));

      const { error: removalsError } = await supabase
        .from("order_item_removals")
        .insert(removalsData);

      if (removalsError) {
        throw new Error(
          removalsError.message || "Errore inserimento removals."
        );
      }
    }

    if (item.selectedCookingOption) {
      const { error: cookingError } = await supabase
        .from("order_item_cooking")
        .insert([
          {
            order_item_id: orderItemId,
            cooking_option_id: item.selectedCookingOption.id,
          },
        ]);

      if (cookingError) {
        throw new Error(cookingError.message || "Errore inserimento cooking.");
      }
    }

    if (item.selectedSpiceLevel) {
      const { error: spiceError } = await supabase
        .from("order_item_spice")
        .insert([
          {
            order_item_id: orderItemId,
            spice_level_id: item.selectedSpiceLevel.id,
          },
        ]);

      if (spiceError) {
        throw new Error(spiceError.message || "Errore inserimento spice.");
      }
    }
  }

  // Ritorna public_id per redirect
  return { id: orderId, publicId: order.public_id };
}

export async function getOrderByIdWithDetails(tenantId, orderId) {
  console.log("Recupero ordine con ID:", orderId);
  // Recupera ordine
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .select("*")
    .eq("id", orderId)
    .eq("tenant_id", tenantId)
    .single();

  if (orderError || !order) {
    throw new Error(orderError?.message || "Ordine non trovato.");
  }

  // Recupera tutti gli item con join
  const { data: items, error: itemsError } = await supabase
    .from("order_items")
    .select(
      `
      id,
      quantity,
      product:product_id (
        id,
        name,
        price,
        description,
        image_url
      ),
      order_item_extras (
        extra_option:extra_option_id (
          id,
          name,
          price
        )
      ),
      order_item_dough (
        dough_option:dough_option_id (
          id,
          name,
          price
        )
      ),
      order_item_removals (
        removal_option:removal_option_id (
          id,
          name
        )
      ),
      order_item_cooking (
        cooking_option:cooking_option_id (
          id,
          label
        )
      ),
      order_item_spice (
        spice_level:spice_level_id (
          id,
          label
        )
      )
    `
    )
    .eq("order_id", orderId);

  if (itemsError) {
    throw new Error(itemsError?.message || "Errore nel recupero degli item.");
  }

  // Normalizza dati
  const itemsNormalized = items.map((item) => ({
    id: item.id,
    quantity: item.quantity,
    product: item.product,
    extras: item.order_item_extras.map((e) => e.extra_option),
    dough: item.order_item_dough[0]?.dough_option || null,
    removals: item.order_item_removals.map((r) => r.removal_option),
    cooking: item.order_item_cooking[0]?.cooking_option || null,
    spice: item.order_item_spice[0]?.spice_level || null,
  }));

  // Ritorna tutto
  return {
    ...order,
    items: itemsNormalized,
  };
}

export async function getOrderByPublicIdWithDetails(tenantId, publicId) {
  // Recupera ordine per public_id
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .select("*")
    .eq("public_id", publicId)
    .eq("tenant_id", tenantId)
    .single();

  if (orderError || !order) {
    throw new Error(orderError?.message || "Ordine non trovato.");
  }

  // Recupera tutti gli item con join
  const { data: items, error: itemsError } = await supabase
    .from("order_items")
    .select(
      `
      id,
      quantity,
      product:product_id (
        id,
        name,
        price,
        description,
        image_url
      ),
      order_item_extras (
        extra_option:extra_option_id (
          id,
          name,
          price
        )
      ),
      order_item_dough (
        dough_option:dough_option_id (
          id,
          name,
          price
        )
      ),
      order_item_removals (
        removal_option:removal_option_id (
          id,
          name
        )
      ),
      order_item_cooking (
        cooking_option:cooking_option_id (
          id,
          label
        )
      ),
      order_item_spice (
        spice_level:spice_level_id (
          id,
          label
        )
      )
    `
    )
    .eq("order_id", order.id);

  if (itemsError) {
    throw new Error(itemsError?.message || "Errore nel recupero degli item.");
  }

  // Normalizza dati
  const itemsNormalized = items.map((item) => ({
    id: item.id,
    quantity: item.quantity,
    product: item.product,
    extras: item.order_item_extras.map((e) => e.extra_option),
    dough: item.order_item_dough[0]?.dough_option || null,
    removals: item.order_item_removals.map((r) => r.removal_option),
    cooking: item.order_item_cooking[0]?.cooking_option || null,
    spice: item.order_item_spice[0]?.spice_level || null,
  }));

  // Ritorna tutto
  return {
    ...order,
    items: itemsNormalized,
  };
}

export async function getOrdersByTenantId(tenantId) {
  if (!tenantId) {
    throw new Error("Tenant ID obbligatorio");
  }

  const { data, error } = await supabase
    .from("orders")
    .select(`
      *,
      order_items (
        id
      )
    `
    )
    .eq("tenant_id", tenantId)
    .order("id", { ascending: false });

  if (error) {
    throw new Error(error.message || "Errore nel recupero ordini");
  }

  return data;
}

export async function updateOrderStatus(orderId, newStatus, tenantId) {
  try {
    await pool.query("UPDATE orders SET status = $1 WHERE id = $2", [
      status,
      orderId,
    ]);
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function updatePickUpTime(orderId, newPickUpTime) {
  try {
    await pool.query(
      "UPDATE orders SET pickup_time = $1, is_postponed = true WHERE id = $2",
      [newPickUpTime, orderId]
    );
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getCustomerByOrderId(orderId) {
  try {
    const result = await pool.query(
      `SELECT customer_name, customer_phone, customer_email FROM orders WHERE id = $1`,
      [orderId]
    );
    return result.rows[0];
  } catch (error) {
    console.error("Errore nel recupero del cliente:", error);
    throw error;
  }
}

export async function clearOrders() {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    await client.query(`
      DELETE FROM order_item_extras
      WHERE order_item_id IN (
        SELECT id FROM order_items
      )
    `);

    await client.query(`
      DELETE FROM order_item_removals
      WHERE order_item_id IN (
        SELECT id FROM order_items
      )
    `);

    await client.query(`
      DELETE FROM order_item_dough
      WHERE order_item_id IN (
        SELECT id FROM order_items
      )
    `);

    await client.query(`
      DELETE FROM order_item_cooking
      WHERE order_item_id IN (
        SELECT id FROM order_items
      )
    `);

    await client.query(`
      DELETE FROM order_item_spice
      WHERE order_item_id IN (
        SELECT id FROM order_items
      )
    `);

    await client.query(`
      DELETE FROM order_items
    `);

    await client.query(`
      DELETE FROM orders
    `);

    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    console.error(error);
    throw error;
  } finally {
    client.release();
  }
}
