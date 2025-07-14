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
          { order_item_id: orderItemId, dough_option_id: item.selectedDough.id },
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
          { order_item_id: orderItemId, cooking_option_id: item.selectedCookingOption.id },
        ]);

      if (cookingError) {
        throw new Error(cookingError.message || "Errore inserimento cooking.");
      }
    }

    if (item.selectedSpiceLevel) {
      const { error: spiceError } = await supabase
        .from("order_item_spice")
        .insert([{ order_item_id: orderItemId, spice_level_id: item.selectedSpiceLevel.id }]);

      if (spiceError) {
        throw new Error(spiceError.message || "Errore inserimento spice.");
      }
    }
  }

  // Ritorna public_id per redirect
  return { id: orderId, publicId: order.public_id };
}

export async function getOrderByIdWithDetails(tenantId, orderId) {
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


//------------------------------------------------

export async function getOrdersByStatus(status) {
  try {
    const result = await pool.query(
      `
      SELECT
        orders.id AS order_id,
        orders.customer_name,
        orders.customer_phone,
        orders.customer_email,
        orders.pickup_time,
        orders.total_price,
        order_items.id AS order_item_id,
        order_items.quantity,
        products.id AS product_id,
        products.name AS product_name,
        products.price AS product_price,
        dough_options.name AS dough_name,
        cooking_options.label AS cooking_name,
        spice_levels.label AS spice_level,
        extras_options.name AS extra_name,
        removal_options.name AS removal_name
      FROM orders
      JOIN order_items ON orders.id = order_items.order_id
      JOIN products ON order_items.product_id = products.id
      LEFT JOIN order_item_dough ON order_item_dough.order_item_id = order_items.id
      LEFT JOIN dough_options ON dough_options.id = order_item_dough.dough_option_id
      LEFT JOIN order_item_cooking ON order_item_cooking.order_item_id = order_items.id
      LEFT JOIN cooking_options ON cooking_options.id = order_item_cooking.cooking_option_id
      LEFT JOIN order_item_spice ON order_item_spice.order_item_id = order_items.id
      LEFT JOIN spice_levels ON spice_levels.id = order_item_spice.spice_level_id
      LEFT JOIN order_item_extras ON order_item_extras.order_item_id = order_items.id
      LEFT JOIN extras_options ON extras_options.id = order_item_extras.extra_option_id
      LEFT JOIN order_item_removals ON order_item_removals.order_item_id = order_items.id
      LEFT JOIN removal_options ON removal_options.id = order_item_removals.removal_option_id
      WHERE orders.status = $1
      ORDER BY orders.id, order_items.id
      `,
      [status]
    );

    const ordersMap = new Map();

    result.rows.forEach((row) => {
      if (!ordersMap.has(row.order_id)) {
        ordersMap.set(row.order_id, {
          id: row.order_id,
          customer_name: row.customer_name,
          customer_phone: row.customer_phone,
          customer_email: row.customer_email,
          pickup_time: row.pickup_time,
          total_price: row.total_price,
          items: [],
        });
      }

      const order = ordersMap.get(row.order_id);

      let item = order.items.find((item) => item.id === row.order_item_id);

      if (!item) {
        item = {
          id: row.order_item_id,
          product: {
            id: row.product_id,
            name: row.product_name,
            price: row.product_price,
          },
          quantity: row.quantity,
          dough: row.dough_name || null,
          cooking: row.cooking_name || null,
          spice: row.spice_level || null,
          extras: [],
          removals: [],
        };
        order.items.push(item);
      }

      if (row.extra_name && !item.extras.includes(row.extra_name)) {
        item.extras.push(row.extra_name);
      }

      if (row.removal_name && !item.removals.includes(row.removal_name)) {
        item.removals.push(row.removal_name);
      }
    });

    return Array.from(ordersMap.values());
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getOrderById(orderId) {
  try {
    const orderRes = await pool.query(`SELECT * FROM orders WHERE id = $1`, [
      orderId,
    ]);

    const itemsRes = await pool.query(
      `SELECT 
        order_items.id AS order_item_id,
        order_items.quantity,
        products.id AS product_id,
        products.name,
        products.description,
        CAST(products.price AS FLOAT) AS price
      FROM order_items
      JOIN products ON order_items.product_id = products.id
      WHERE order_items.order_id = $1`,
      [orderId]
    );

    const orderItems = await Promise.all(
      itemsRes.rows.map(async (item) => {
        const [dough, extras, removals, cooking, spice] = await Promise.all([
          pool.query(
            `SELECT d.id, d.name, d.price FROM order_item_dough od JOIN dough_options d ON od.dough_option_id = d.id WHERE od.order_item_id = $1`,
            [item.order_item_id]
          ),
          pool.query(
            `SELECT e.id, e.name, e.price FROM order_item_extras oe JOIN extras_options e ON oe.extra_option_id = e.id WHERE oe.order_item_id = $1`,
            [item.order_item_id]
          ),
          pool.query(
            `SELECT r.id, r.name FROM order_item_removals orr JOIN removal_options r ON orr.removal_option_id = r.id WHERE orr.order_item_id = $1`,
            [item.order_item_id]
          ),
          pool.query(
            `SELECT c.id, c.label FROM order_item_cooking oc JOIN cooking_options c ON oc.cooking_option_id = c.id WHERE oc.order_item_id = $1`,
            [item.order_item_id]
          ),
          pool.query(
            `SELECT s.id, s.label FROM order_item_spice os JOIN spice_levels s ON os.spice_level_id = s.id WHERE os.order_item_id = $1`,
            [item.order_item_id]
          ),
        ]);

        return {
          id: item.product_id,
          name: item.name,
          description: item.description,
          price: item.price,
          quantity: item.quantity,
          dough: dough.rows[0] || null,
          extras: extras.rows || [],
          removals: removals.rows || [],
          cooking: cooking.rows[0] || null,
          spice: spice.rows[0] || null,
        };
      })
    );

    const order = {
      id: orderRes.rows[0].id,
      customer_name: orderRes.rows[0].customer_name,
      customer_phone: orderRes.rows[0].customer_phone,
      pickup_time: orderRes.rows[0].pickup_time,
      customer_email: orderRes.rows[0].customer_email,
      total_price: parseFloat(orderRes.rows[0].total_price),
      status: orderRes.rows[0].status,
      items: orderItems,
    };

    return order;
  } catch (error) {
    console.error("Errore nel recupero dell'ordine:", error);
    throw error;
  }
}

export async function updateOrderStatus(orderId, status) {
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
