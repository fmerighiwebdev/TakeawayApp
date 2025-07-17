import ProductsSection from "@/components/products-section/products-section";

import styles from "./category.module.css";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

import {
  getTenantCategories,
  getTenantDetails,
  getTenantId,
  getTenantSubcategories,
} from "@/lib/tenantDetails";
import { getTenantProductsByCategory } from "@/lib/products";
import { getIcon } from "@/lib/icons";

export async function generateMetadata({ params }) {
  const { category: categorySlug } = await params;

  const tenantId = await getTenantId();
  const tenantCategories = await getTenantCategories(tenantId);

  const activeCategory = tenantCategories.find(
    (category) => category.slug === categorySlug
  );

  return {
    title: activeCategory.name,
    description: `Scopri i prodotti della categoria ${activeCategory.name}`,
    alternates: {
      canonical: `/${categorySlug}`,
    },
  };
}

function MenuJsonLd({ activeCategory, categoryProducts }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "MenuSection",
          name: activeCategory.name,
          description: activeCategory.description,
          hasMenuItem: categoryProducts.map((product) => ({
            "@type": "MenuItem",
            name: product.name,
            description: product.description,
          })),
        }),
      }}
    />
  );
}

function BreadcrumbJsonLd({ tenantDetails, activeCategory }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            {
              "@type": "ListItem",
              position: 1,
              name: "Home",
              item: `https://${tenantDetails.domain}`,
            },
            {
              "@type": "ListItem",
              position: 2,
              name: activeCategory.name,
              item: `https://${tenantDetails.domain}/${activeCategory.slug}`,
            },
          ],
        }),
      }}
    />
  );
}

export default async function CategoryPage({ params }) {
  const { category: categorySlug } = await params;

  const tenantId = await getTenantId();
  const tenantDetails = await getTenantDetails(tenantId);
  const tenantCategories = await getTenantCategories(tenantId);

  const leftArrowIcon = getIcon("leftArrow");

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
    <>
      <MenuJsonLd
        activeCategory={activeCategory}
        categoryProducts={categoryProducts}
      />
      <BreadcrumbJsonLd
        tenantDetails={tenantDetails}
        activeCategory={activeCategory}
      />
      <main className={styles.categoryPage}>
        <div className="container">
          <Link href="/" className={styles.backButton}>
            <Image
              src={leftArrowIcon}
              alt=""
              aria-hidden="true"
              width={32}
              height={32}
            />
            <span>Home</span>
          </Link>
          <h1>{activeCategory.name}</h1>
          <ProductsSection
            subcategories={subcategories}
            categoryProducts={categoryProducts}
          />
        </div>
      </main>
    </>
  );
}
