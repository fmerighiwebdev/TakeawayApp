import ProductsSection from "@/components/products-section/products-section";

import styles from "./category.module.css";
import leftArrowIcon from "@/assets/left-arrow.svg";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

import { categoryNames } from "@/lib/categories";
import {
  getTenantCategories,
  getTenantId,
  getTenantSubcategories,
} from "@/lib/tenantDetails";

export default async function CategoryPage({ params }) {
  const { category: categorySlug } = await params;

  const tenantId = getTenantId();
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
          categoryId={activeCategory.id}
        />
      </div>
    </main>
  );
}
