import Image from "next/image";
import { getTenantDetails, getTenantId } from "@/lib/tenantDetails";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";

export const metadata = {
  title: "Contatti",
  description: "Per qualsiasi informazione, non esitare a contattarci!",
  alternates: {
    canonical: "/contatti",
  },
};

function BreadcrumbJsonLd({ tenantDetails }) {
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
              name: "Contatti",
              item: `https://${tenantDetails.domain}/contatti`,
            },
          ],
        }),
      }}
    />
  );
}

function ContactPageJsonLd({ tenantDetails }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ContactPage",
          name: "Contatti",
          mainEntity: {
            "@type": "Organization",
            name: tenantDetails.name,
            url: `https://${tenantDetails.domain}`,
            contactPoint: {
              "@type": "ContactPoint",
              telephone: `+39${tenantDetails.phone}`,
              contactType: "Customer Service",
              areaServed: "IT",
              availableLanguage: "Italian",
            },
          },
        }),
      }}
    />
  );
}

export default async function ContactsPage() {
  const tenantId = await getTenantId();
  const tenantDetails = await getTenantDetails(tenantId);

  return (
    <>
      <BreadcrumbJsonLd tenantDetails={tenantDetails} />
      <ContactPageJsonLd tenantDetails={tenantDetails} />
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
                  <span className="text-md md:text-lg text-primary font-semibold hover:text-primary">
                    Contatti
                  </span>
                </BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <div className="flex flex-col gap-2">
            <h1 className="text-5xl md:text-6xl text-primary font-medium">Contatti</h1>
            <p className="text-(--muted-light-text) text-lg md:text-xl">
              Per qualsiasi informazione, non esitare a contattarci!
            </p>
            <div className="separator-horizontal"></div>
          </div>
          <div className="flex flex-col md:flex-row items-start gap-10">
            <div className="flex-1 flex flex-col gap-6">
              <div className="flex items-center gap-4">
                <Phone
                  size={36}
                  color="var(--color-primary)"
                  strokeWidth={1.5}
                />
                <p className="text-2xl lg:text-3xl text-(--muted-text)">{tenantDetails.phone}</p>
              </div>
              <div className="flex items-start gap-4">
                <MapPin
                  size={36}
                  color="var(--color-primary)"
                  strokeWidth={1.5}
                />
                <p className="text-2xl lg:text-3xl text-(--muted-text)">
                  {tenantDetails.address} <br />
                  {tenantDetails.city} ({tenantDetails.region}), {tenantDetails.postal_code}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <Mail
                  size={36}
                  color="var(--color-primary)"
                  strokeWidth={1.5}
                />
                <p className="text-2xl lg:text-3xl text-(--muted-text)">{tenantDetails.email}</p>
              </div>
            </div>
            <div className="flex-1 w-full h-full">
              <Image
                src="https://woi8jmqaak1w974e.public.blob.vercel-storage.com/locale/general/general-1.webp"
                alt="Contatti"
                width={600}
                height={400}
                className="w-full h-full object-cover rounded-lg"
                style={{ boxShadow: "-20px 20px 0 var(--color-primary)" }}
              />
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
