"use client";

import { useEffect, useState } from "react";
import axios from "axios";

import styles from "./products-grid.module.css";
import ProductItem from "../product-item/product-item";
import Loader from "../loader/loader";

export default function ProductsGrid({ categoryId, activeSubcategory }) {
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      try {
        const response = await axios.get(`/api/products/${categoryId}`);
        setAllProducts(response.data.products);
      } catch (error) {
        console.error(error);
        setError(error.response.data.message);
      }
      setLoading(false);
    }

    fetchProducts();
  }, [categoryId]);

  const displayedProducts = activeSubcategory
    ? allProducts.filter(
        (product) => product.subcategory_id === activeSubcategory
      )
    : allProducts;

  return (
    <div className={styles.productsGrid}>
      {loading ? (
        <Loader />
      ) : (
        <>
          {error && (
            <p className="errorBanner" role="alert">
              {error}
            </p>
          )}
          {displayedProducts.length > 0 && (
            <ul className={styles.productsList}>
              {displayedProducts.map((product) => (
                <ProductItem key={product.id} product={product} />
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
}
