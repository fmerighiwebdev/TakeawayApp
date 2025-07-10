import pool from "./supabaseClient";

export async function getAllProducts() {
  const products = await pool.query("SELECT * FROM products");
  return products.rows;
}

export async function getProductsByCategory(categorySlug) {
  try {
    const products = await pool.query(
      `SELECT id, name, description, price, image_url, slug_subcategory, has_customizations, spice_level FROM products WHERE slug_category = $1 ORDER BY id ASC`,
      [categorySlug]
    );
    return products.rows;
  } catch (error) {
    throw new Error("Errore nel caricamento dei prodotti: " + error.message);
  }
}

export async function getCustomizationsByProductId(productId) {
  try {
    const customizations = await pool.query(
      `
    SELECT 
    JSON_AGG(DISTINCT JSONB_BUILD_OBJECT('id', dough_options.id, 'name', dough_options.name, 'price', dough_options.price)) AS doughs,
    JSON_AGG(DISTINCT JSONB_BUILD_OBJECT('id', extras_options.id, 'name', extras_options.name, 'price', extras_options.price)) AS extras,
    JSON_AGG(DISTINCT JSONB_BUILD_OBJECT('id', cooking_options.id, 'label', cooking_options.label)) AS cookingOptions,
    JSON_AGG(DISTINCT JSONB_BUILD_OBJECT('id', spice_levels.id, 'label', spice_levels.label)) AS spiceLevels,
    JSON_AGG(DISTINCT JSONB_BUILD_OBJECT('id', removal_options.id, 'name', removal_options.name)) AS removals
FROM 
    products
LEFT JOIN 
    dough_options ON products.id = dough_options.product_id AND dough_options.id IS NOT NULL
LEFT JOIN 
    extras_options ON products.id = extras_options.product_id AND extras_options.id IS NOT NULL
LEFT JOIN
    cooking_options ON products.id = cooking_options.product_id AND cooking_options.id IS NOT NULL
LEFT JOIN
    spice_levels ON products.id = spice_levels.product_id AND spice_levels.id IS NOT NULL
LEFT JOIN
    product_removal_options ON products.id = product_removal_options.product_id
LEFT JOIN
    removal_options ON product_removal_options.removal_option_id = removal_options.id AND removal_options.id IS NOT NULL
WHERE 
    products.id = $1
GROUP BY
    products.id;
    `,
      [productId]
    );
    return customizations.rows[0]; // Since we're using aggregation, it will return an array with a single row
  } catch (error) {
    throw new Error(
      "Errore nel caricamento delle personalizzazioni: " + error.message
    );
  }
}

export async function getProductBySlug(slug) {
  const product = await pool.query(
    `
    SELECT 
        products.*,
        COALESCE(
            JSON_AGG(
                DISTINCT JSONB_BUILD_OBJECT('name', dough_options.name, 'price', dough_options.price)
            ) FILTER (WHERE dough_options.name IS NOT NULL),
            '[]'
        ) AS doughs,
        COALESCE(
            JSON_AGG(
                DISTINCT JSONB_BUILD_OBJECT('name', extras_options.name, 'price', extras_options.price)
            ) FILTER (WHERE extras_options.name IS NOT NULL),
            '[]'
        ) AS extras
    FROM 
        products
    LEFT JOIN 
        dough_options ON products.id = dough_options.product_id
    LEFT JOIN 
        extras_options ON products.id = extras_options.product_id
    WHERE 
        products.slug = $1
    GROUP BY 
        products.id;
    `,
    [slug]
  );
  return product.rows[0];
}
