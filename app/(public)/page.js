import Link from "next/link";

import Image from "next/image";

import {
  getTenantAssets,
  getTenantCategories,
  getTenantDetails,
  getTenantId,
} from "@/lib/tenantDetails";
import { MapPin, Phone } from "lucide-react";

export const metadata = {
  alternates: {
    canonical: "/",
  },
};

export default async function Home() {
  const tenantId = await getTenantId();
  const tenantData = await getTenantDetails(tenantId);
  const tenantAssets = await getTenantAssets(tenantId);
  const tenantCategories = await getTenantCategories(tenantId);

  return (
    <main className="w-screen min-h-dvh pt-24 pb-24 lg:pt-0 flex flex-col gap-12 lg:gap-8">
      <section className="lg:h-[60dvh] relative">
        <div className="container h-full flex flex-col lg:flex-row items-start">
          <div className="flex flex-1 flex-col gap-4 h-full justify-center relative">
            {tenantAssets.logoUrl && (
              <Image
                src={tenantAssets.logoUrl}
                alt={`Takeaway | ${tenantData.name} | Logo`}
                width={100}
                height={100}
                className="w-20 md:w-24 h-auto"
                priority
              />
            )}
            <div className="w-full lg:max-w-lg">
              <p className="text-(--muted-light-text) font-medium">TAKEAWAY</p>
              <h1 className="text-5xl text-primary font-medium">
                {tenantData.name ? tenantData.name : "[Nome]"}
              </h1>
              <h2 className="text-(--muted-text) text-lg md:text-xl">
                <em>{tenantData.slogan}</em>
              </h2>
            </div>
            <div className="flex flex-start flex-col xs:flex-row">
              <div className="flex-1 p-4 h-fit gap-4 card rounded-bl-none max-w-64 xs:rounded-bl-sm rounded-br-none xs:rounded-br-none xs:rounded-tr-none lg:rounded-br-sm lg:rounded-tr-sm bg-primary bg-opacity-90 lg:max-w-xs shadow-sm">
                <div className="flex gap-2">
                  <MapPin
                    color="var(--color-primary-content)"
                    strokeWidth={1.5}
                    className="size-7 md:size-8"
                  />
                  {tenantData.address && (
                    <p className="text-primary-foreground text-md md:text-lg">
                      {tenantData.address} <br /> {tenantData.city} (
                      {tenantData.region})
                    </p>
                  )}
                </div>
                {tenantData.phone && (
                  <a
                    href={`tel:+39${tenantData.phone}`}
                    aria-label={`Chiama il ristorante al numero ${tenantData.phone}`}
                    className="flex gap-2 items-center"
                  >
                    <Phone
                      color="var(--color-primary-content)"
                      strokeWidth={1.5}
                      className="size-7 md:size-8"
                    />
                    <span className="text-primary-foreground text-md md:text-lg">
                      {tenantData.phone}
                    </span>
                  </a>
                )}
              </div>
              <div className="flex-2 block lg:hidden">
                <Image
                  src="https://woi8jmqaak1w974e.public.blob.vercel-storage.com/locale/general/general-1.webp"
                  alt="Hero Image"
                  width={4096}
                  height={2304}
                  className="w-full h-full object-cover rounded-sm rounded-tl-none xs:rounded-tl-sm shadow-sm"
                />
              </div>
            </div>
          </div>
          <div className="flex-1 hidden lg:block">
            <Image
              src="https://woi8jmqaak1w974e.public.blob.vercel-storage.com/locale/general/general-1.webp"
              alt="Hero Image"
              width={4096}
              height={2304}
              className="w-full h-full object-cover shadow-sm rounded-lg"
              style={{ boxShadow: "-20px 20px 0 var(--color-primary)" }}
            />
          </div>
        </div>
      </section>
      <section>
        <div className="container">
          <h3 className="text-3xl font-normal text-(--muted-text)">
            Scegli una categoria
          </h3>
          <div className="separator-horizontal mt-6 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {tenantCategories.length > 0 ? (
              tenantCategories.map((category) => (
                <div
                  className="categoryCard relative w-full h-52 transition-transform rounded-lg shadow-sm duration-300"
                  key={category.id}
                >
                  <Link
                    href={`/${category.slug}`}
                    className="relative z-10 w-full h-full overflow-hidden rounded-lg shadow-sm flex items-center justify-center"
                  >
                    <figure className="absolute z-0 top-0 left-0 w-full h-full">
                      <Image
                        src={category.image_url}
                        width={400}
                        height={200}
                        className="w-full h-full object-cover"
                        alt={category.name}
                      />
                    </figure>
                    <div className="bg-black/50 absolute z-1 top-0 left-0 w-full h-full"></div>
                    <div className="absolute z-2 bottom-5 left-5">
                      <h3 className="text-3xl uppercase text-primary-foreground transition-transform duration-300 relative w-fit">
                        {category.name}
                      </h3>
                    </div>
                  </Link>
                </div>
              ))
            ) : (
              <p className="col-span-full text-center">
                Nessuna categoria disponibile.
              </p>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
