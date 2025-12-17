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
    <main className="w-screen min-h-dvh pb-24 flex flex-col gap-12">
      <section className="h-[60dvh] relative">
        <div className="container h-full">
          <div className="flex flex-col gap-4 h-full justify-center">
            {tenantAssets.logoUrl && (
              <Image
                src={tenantAssets.logoUrl}
                alt={`Takeaway | ${tenantData.name} | Logo`}
                width={100}
                height={100}
                priority
              />
            )}
            <div className="w-full max-w-1/2">
              <p className="text-(--muted-light-text) font-medium">TAKEAWAY</p>
              <h1 className="text-6xl text-primary font-medium">
                {tenantData.name ? tenantData.name : "[Nome]"}
              </h1>
              <h2 className="text-(--muted-text) text-xl">
                <em>{tenantData.slogan}</em>
              </h2>
            </div>
            <div className="flex flex-col gap-4 card bg-(--color-primary) bg-opacity-90 p-4 max-w-xs shadow-sm">
              <div className="flex gap-2">
                <MapPin
                  size={32}
                  color="var(--color-primary-content)"
                  strokeWidth={1.5}
                />
                {tenantData.address && (
                  <p className="text-(--color-primary-content) text-lg">
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
                    size={32}
                    color="var(--color-primary-content)"
                    strokeWidth={1.5}
                  />
                  <span className="text-(--color-primary-content) text-lg">
                    {tenantData.phone}
                  </span>
                </a>
              )}
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-200 h-full">
          <Image
            src="https://woi8jmqaak1w974e.public.blob.vercel-storage.com/locale/general/general-1.webp"
            alt="Hero Image"
            width={4096}
            height={2304}
            className="w-full h-full object-cover shadow-sm rounded-lg"
            style={{ boxShadow: "-30px 30px 0 var(--color-primary)" }}
          />
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
                        src="https://woi8jmqaak1w974e.public.blob.vercel-storage.com/locale/general/general-2.webp"
                        width={400}
                        height={200}
                        className="w-full h-full object-cover"
                        alt={category.name}
                      />
                    </figure>
                    <div className="bg-black/50 absolute z-1 top-0 left-0 w-full h-full"></div>
                    <div className="absolute z-2 bottom-5 left-5">
                      <h3 className="text-3xl uppercase text-(--color-primary-content) transition-transform duration-300 relative w-fit">
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
