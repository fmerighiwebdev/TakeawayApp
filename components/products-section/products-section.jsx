"use client";

import { useState } from "react";

import ProductsGrid from "../products-grid/products-grid";

import styles from "./products-section.module.css";
import SubcategoryButton from "../subcategory-button/subcategory-button";

import { categoryNames, categoryData } from "@/lib/categories";

export default function ProductsSection({ subcategories, categoryId }) {
  const [activeSubcategory, setActiveSubcategory] = useState(null);

  return (
    <section className={styles.productsSection}>
      <div className={styles.subcategories}>
        <ul role="list">
          {subcategories.map((subcategory) => (
            <SubcategoryButton
              key={subcategory.id}
              subcategory={subcategory}
              isActive={activeSubcategory === subcategory.id}
              onClick={() => setActiveSubcategory(subcategory.id)}
            />
          ))}
        </ul>
        {activeSubcategory && (
          <button
            className={styles.removeFilter}
            onClick={() => setActiveSubcategory(null)}
          >
            Rimuovi filtro
          </button>
        )}
      </div>
      <ProductsGrid categoryId={categoryId} activeSubcategory={activeSubcategory} />
    </section>
  );
}
