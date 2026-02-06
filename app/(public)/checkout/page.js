import CheckoutForm from "@/components/checkout-form";
import CheckoutItems from "@/components/checkout-items";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import {
  getTenantDiscounts,
  getTenantFeatures,
  getTenantId,
  getTenantPickupTimes,
} from "@/lib/tenantDetails";
import { headers } from "next/headers";
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
  const headersList = await headers();
  const hostname = (headersList.get("host") || "localhost").split(":")[0];

  console.log("Hostname:", hostname);

  const cookieStore = await cookies();
  const cartCount =
    Number(cookieStore.get(`cart-count-${hostname}`)?.value) || 0;

  if (cartCount === 0) {
    redirect("/carrello");
  }

  const tenantId = await getTenantId();
  const pickupTimes = await getTenantPickupTimes(tenantId);
  const tenantFeatures = await getTenantFeatures(tenantId);
  const tenantDiscounts = await getTenantDiscounts(tenantId);

  return (
    <main className="py-24">
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
          tenantDiscounts={tenantDiscounts}
        />
      </div>
      <FloatingBack href="/" />
    </main>
  );
}
