import ProductsSection from "@/components/products-section";

import { notFound } from "next/navigation";
import Link from "next/link";

import {
  getTenantCategoryBySlug,
  getTenantDetails,
  getTenantId,
  getTenantSubcategories,
} from "@/lib/tenantDetails";
import { getTenantProductsByCategory } from "@/lib/products";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import FloatingBack from "@/components/ui/floating-back";

export async function generateMetadata({ params }) {
  const { category: categorySlug } = await params;

  const tenantId = await getTenantId();
  const activeCategory = await getTenantCategoryBySlug(tenantId, categorySlug);

  if (!activeCategory) {
    notFound();
  }

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
  const activeCategory = await getTenantCategoryBySlug(tenantId, categorySlug);

  if (!activeCategory) {
    notFound();
  }

  console.log("Active Category:", activeCategory);

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
      <main className="py-24">
        <div className="container flex flex-col gap-10">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/" className="text-lg">
                    Home
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link
                    href={`/${activeCategory.slug}`}
                    className="text-lg text-primary font-semibold"
                  >
                    {activeCategory.name}
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <ProductsSection
            activeCategory={activeCategory}
            subcategories={subcategories}
            categoryProducts={categoryProducts}
          />
          {categoryProducts.length === 0 && (
            <p style={{ textAlign: "center" }}>Nessun prodotto disponibile.</p>
          )}
        </div>
        <FloatingBack href="/" />
      </main>
    </>
  );
}
