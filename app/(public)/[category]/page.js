import ProductsSection from "@/components/products-section/products-section";

import styles from "./category.module.css";
import leftArrowIcon from "@/assets/left-arrow.svg";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

import {
  getTenantCategories,
  getTenantId,
  getTenantSubcategories,
} from "@/lib/tenantDetails";
import { getTenantProductsByCategory } from "@/lib/products";

export default async function CategoryPage({ params }) {
  const { category: categorySlug } = await params;

  const tenantId = await getTenantId();
  const tenantCategories = await getTenantCategories(tenantId);

  const activeCategory = tenantCategories.find(
    (category) => category.slug === categorySlug
  );

  if (!activeCategory) {
    notFound();
  }

  const subcategories = await getTenantSubcategories(
    tenantId,
    activeCategory.id
  );

  const categoryProducts = await getTenantProductsByCategory(
    activeCategory.id,
    tenantId
  );

  return (
    <main className={styles.categoryPage}>
      <div className="container">
        <Link href="/" className={styles.backButton}>
          <Image src={leftArrowIcon} alt="" aria-hidden="true" />
          <span>Home</span>
        </Link>
        <h1>{activeCategory.name}</h1>
        <ProductsSection
          subcategories={subcategories}
          categoryProducts={categoryProducts}
        />
      </div>
    </main>
  );
}
