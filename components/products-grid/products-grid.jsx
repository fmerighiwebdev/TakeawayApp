import styles from "./products-grid.module.css";
import ProductItem from "../product-item/product-item";

export default function ProductsGrid({ categoryProducts, activeSubcategory }) {
  const displayedProducts = activeSubcategory
    ? categoryProducts.filter(
        (product) => product.subcategory_id === activeSubcategory
      )
    : categoryProducts;

  return (
    <div className={styles.productsGrid}>
      {displayedProducts.length > 0 && (
        <ul className={styles.productsList}>
          {displayedProducts.map((product) => (
            <ProductItem key={product.id} product={product} />
          ))}
        </ul>
      )}
    </div>
  );
}
