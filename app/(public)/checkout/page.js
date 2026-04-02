import { redirect } from "next/navigation";
import { cookies, headers } from "next/headers";
import {
  hasCartSession,
  hasLegacyCartCountCookie,
} from "@/lib/cartSession";
import {
  getTenantContext,
  getTenantId,
} from "@/lib/tenantDetails";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";
import FloatingBack from "@/components/ui/floating-back";
import CheckoutSection from "@/components/checkout-section";

export const metadata = {
  title: "Checkout",
  description: "Scegli l'orario di ritiro e conferma il tuo ordine",
  robots: {
    index: false,
    follow: true,
  },
  alternates: {
    canonical: "/checkout",
  },
};

export default async function CheckoutPage() {
  const [headersList, cookieStore] = await Promise.all([headers(), cookies()]);

  if (
    !hasCartSession(cookieStore) &&
    !hasLegacyCartCountCookie(cookieStore, headersList.get("host"))
  ) {
    redirect("/carrello");
  }

  const tenantId = await getTenantId();
  const tenantContext = await getTenantContext(tenantId);
  const pickupTimes = tenantContext.pickupTimes;
  const tenantFeatures = tenantContext.features;

  return (
    <main className="pt-20 pb-24 lg:pt-16">
      <div className="container flex flex-col gap-10">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/" className="text-md md:text-lg">
                  Home
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href={`/carrello`} className="text-md md:text-lg">
                  Carrello
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <span className="text-md md:text-lg text-primary font-semibold">
                  Checkout
                </span>
              </BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="flex flex-col gap-2">
          <h1 className="text-5xl md:text-6xl text-primary font-medium">
            Conferma il tuo ordine
          </h1>
          <div className="separator-horizontal"></div>
        </div>
        <CheckoutSection
          pickupTimes={pickupTimes}
          tenantFeatures={tenantFeatures}
        />
      </div>
      <FloatingBack href="/" />
    </main>
  );
}
