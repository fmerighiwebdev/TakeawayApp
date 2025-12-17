"use client";

import { useState } from "react";

import ProductsGrid from "./products-grid";

import SubcategoryButton from "./subcategory-button";
import Image from "next/image";

export default function ProductsSection({
  activeCategory,
  subcategories,
  categoryProducts,
}) {
  const [activeSubcategory, setActiveSubcategory] = useState(null);

  return (
    <>
      <section className="flex gap-4">
        <div className="flex-3 flex flex-col gap-8">
          <div className="flex flex-col gap-2">
            <h1 className="text-6xl font-medium text-primary">
              {activeCategory.name}
            </h1>
            <p className="text-(--muted-text) text-lg">
              {activeCategory.description}
            </p>
          </div>
          <div className="flex flex-col gap-2">
            {subcategories.length > 0 ? (
              <ul className="flex flex-wrap gap-2">
                {subcategories.map((subcategory) => (
                  <SubcategoryButton
                    key={subcategory.id}
                    subcategory={subcategory}
                    isActive={activeSubcategory === subcategory.id}
                    onClick={() => setActiveSubcategory(subcategory.id)}
                  ></SubcategoryButton>
                ))}
              </ul>
            ) : (
              <p>Nessuna sottocategoria disponibile.</p>
            )}
              <button
                className={`text-primary w-fit underline underline-offset-2 cursor-pointer transition-all ${!activeSubcategory ? 'opacity-0 scale-75' : ''}`}
                onClick={() => setActiveSubcategory(null)}
              >
                Rimuovi filtro
              </button>
          </div>
        </div>
        <div className="flex-2">
          {activeCategory.image_url && (
            <Image
              src={activeCategory.image_url}
              alt={activeCategory.name}
              className="rounded-lg w-full h-full object-cover shadow-sm"
              width={400}
              height={400}
            />
          )}
        </div>
      </section>
      <div className="separator-horizontal"></div>
      <section>
        <ProductsGrid
          categoryProducts={categoryProducts}
          activeSubcategory={activeSubcategory}
        />
      </section>
    </>
  );
}
