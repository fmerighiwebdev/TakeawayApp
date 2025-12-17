"use client";

import { motion, AnimatePresence } from "motion/react";
import ProductItem from "./product-item";

export default function ProductsGrid({ categoryProducts, activeSubcategory }) {
  const displayedProducts = activeSubcategory
    ? categoryProducts.filter(
        (product) => product.subcategory_id === activeSubcategory
      )
    : categoryProducts;

  const gridKey = activeSubcategory ? activeSubcategory : "all-products";

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
              <ProductItem key={product.id} product={product} />
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
            Nessun prodotto disponibile.
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
