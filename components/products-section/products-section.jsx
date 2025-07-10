"use client";

import { useState } from "react";

import ProductsGrid from "../products-grid/products-grid";

import styles from "./products-section.module.css";
import SubcategoryButton from "../subcategory-button/subcategory-button";
import { notFound } from "next/navigation";

import { categoryNames, categoryData } from "@/lib/categories";

export default function ProductsSection({ categorySlug }) {
  const [activeSubcategory, setActiveSubcategory] = useState(null);

  const subcategories = categoryData[categorySlug];

  return (
    <section className={styles.productsSection}>
      <div className={styles.subcategories}>
        <ul role="list">
          {subcategories.map((subcategory) => (
            <SubcategoryButton
              key={subcategory.slug_subcategory}
              subcategory={subcategory}
              isActive={activeSubcategory === subcategory.slug_subcategory}
              onClick={() => setActiveSubcategory(subcategory.slug_subcategory)}
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
      <ProductsGrid categorySlug={categorySlug} activeSubcategory={activeSubcategory} />
    </section>
  );
}
