import ProductsSection from "@/components/products-section/products-section";

import styles from "./category.module.css";
import leftArrowIcon from "@/assets/left-arrow.svg";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

import { categoryNames } from "@/lib/categories";
import Script from "next/script";

export async function generateMetadata({ params }) {
  const { category: categorySlug } = await params;
  const categoryName = categoryNames[categorySlug];
  const url = `${process.env.BASE_URL}/${categorySlug}`;

  return {
    title: `${categoryName} - All'Amicizia Takeaway`,
    description: `Scopri la nostra selezione di ${categoryName.toLowerCase()} e ordina comodamente online.`,
    openGraph: {
      title: `${categoryName} - All'Amicizia Takeaway`,
      description: `Scopri la nostra selezione di ${categoryName.toLowerCase()} e ordina comodamente online.`,
      url,
      images: [
        {
          url: `/category-images/${categorySlug}.jpg`,
          width: 1200,
          height: 630,
          alt: categoryName
        }
      ],
      locale: 'it_IT',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${categoryName} - All'Amicizia Takeaway`,
      description: `Scopri la nostra selezione di ${categoryName.toLowerCase()} e ordina comodamente online.`,
      images: [`/category-images/${categorySlug}.jpg`],
    },
    alternates: {
      canonical: url
    }
  };
}

export default async function CategoryPage({ params }) {
  const { category: categorySlug } = await params;

  if (!Object.keys(categoryNames).includes(categorySlug)) {
    return notFound();
  }

  const categoryName = categoryNames[categorySlug];
  
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": `${process.env.BASE_URL}`
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": categoryName,
        "item": `${process.env.BASE_URL}/${categorySlug}`
      }
    ]
  };

  return (
    <main className={styles.categoryPage}>
      <Script id="breadcrumb-json-ld" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <div className="container">
        <Link href="/" className={styles.backButton}>
          <Image src={leftArrowIcon} alt="" aria-hidden="true" />
          <span>Home</span>
        </Link>
        <h1>{categoryName}</h1>
        <ProductsSection categorySlug={categorySlug} />
      </div>
    </main>
  );
}
