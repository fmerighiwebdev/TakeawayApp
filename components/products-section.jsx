"use client";

import { useState } from "react";
import ProductsGrid from "./products-grid";
import SubcategoryButton from "./subcategory-button";
import Image from "next/image";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Search, Star, X } from "lucide-react";

export default function ProductsSection({
  activeCategory,
  subcategories,
  categoryProducts,
  topCategoryProducts,
}) {
  const [activeSubcategory, setActiveSubcategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const topProductsIds = new Set(
    (topCategoryProducts ?? []).map((p) => p.product_id)
  );

  const isSearching = searchQuery.trim().length > 0;

  return (
    <>
      <section className="flex gap-8 lg:gap-4 flex-col md:flex-row">
        <div className="flex-1 lg:flex-3 flex flex-col gap-8 order-1 md:order-0">
          <div className="flex flex-col gap-2">
            <h1 className="text-4xl md:text-5xl font-medium text-primary">
              {activeCategory.name}
            </h1>
            <p className="text-(--muted-text) text-md md:text-lg">
              {activeCategory.description}
            </p>
          </div>

          {topCategoryProducts.length > 0 && (
            <div className="flex flex-col gap-2">
              <h2 className="text-2xl text-primary flex items-center gap-2">
                I più scelti{" "}
                <Star className="size-4 text-primary" strokeWidth={1.5} />
              </h2>

              {topCategoryProducts.map((product) => (
                <Card
                  key={product.product_id}
                  className="flex gap-4 p-4 rounded-lg w-full lg:w-1/2 border-primary/30"
                >
                  {product.image_url && (
                    <Image
                      src={product.image_url}
                      alt={product.name}
                      width={80}
                      height={80}
                      className="w-20 h-20 object-cover rounded-md"
                    />
                  )}
                  <div>
                    <h3 className="text-lg font-medium text-(--muted-text)">
                      {product.name}
                    </h3>
                    <p className="text-muted-foreground">
                      <em>{product.description}</em>
                    </p>
                  </div>
                </Card>
              ))}
            </div>
          )}

          <div className="flex flex-col gap-4">
            <div className="relative w-full md:max-w-md">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground"
                strokeWidth={1.75}
              />
              <Input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cerca un prodotto..."
                className="pl-10 pr-10"
              />
              {searchQuery && (
                <button
                  type="button"
                  aria-label="Cancella ricerca"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="size-4" strokeWidth={1.75} />
                </button>
              )}
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
                    />
                  ))}
                </ul>
              ) : (
                <p>Nessuna sottocategoria disponibile.</p>
              )}

              <div className="flex items-center gap-4 flex-wrap">
                <button
                  className={`text-primary w-fit underline underline-offset-2 cursor-pointer transition-all ${
                    !activeSubcategory ? "opacity-0 scale-75" : ""
                  }`}
                  onClick={() => setActiveSubcategory(null)}
                >
                  Rimuovi filtro
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 lg:flex-2">
          {activeCategory.image_url && (
            <Image
              src={activeCategory.image_url}
              alt={activeCategory.name}
              className="rounded-lg w-full h-64 sm:h-80 object-cover shadow-sm"
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
          topProductsIds={topProductsIds}
          searchQuery={searchQuery}
        />
      </section>
    </>
  );
}