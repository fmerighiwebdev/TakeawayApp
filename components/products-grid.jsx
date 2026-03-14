"use client";

import { motion, AnimatePresence } from "motion/react";
import ProductItem from "./product-item";

function normalizeText(value) {
  return (value ?? "")
    .toString()
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

export default function ProductsGrid({
  categoryProducts,
  activeSubcategory,
  topProductsIds,
  searchQuery,
}) {
  const normalizedQuery = normalizeText(searchQuery);

  const displayedProducts = categoryProducts.filter((product) => {
    const matchesSubcategory = activeSubcategory
      ? product.subcategory_id === activeSubcategory
      : true;

    const matchesSearch =
      normalizedQuery.length === 0
        ? true
        : normalizeText(product.name).includes(normalizedQuery) ||
          normalizeText(product.description).includes(normalizedQuery);

    return matchesSubcategory && matchesSearch;
  });

  const gridKey = `${activeSubcategory ?? "all-products"}-${normalizedQuery || "no-search"}`;

  return (
    <div>
      <AnimatePresence mode="wait">
        {displayedProducts.length > 0 ? (
          <motion.div
            key={gridKey}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
          >
            {displayedProducts.map((product) => (
              <ProductItem
                key={product.id}
                product={product}
                isTopProduct={topProductsIds.has(product.id)}
              />
            ))}
          </motion.div>
        ) : (
          <motion.p
            key={`empty-${gridKey}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="text-(--muted-light-text)"
          >
            {normalizedQuery
              ? "Nessun prodotto corrisponde alla ricerca."
              : "Nessun prodotto disponibile."}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}