import Image from "next/image";
import { getTenantAssets, getTenantId } from "@/lib/tenantDetails";

export default async function Maintenance() {
  const tenantId = await getTenantId();
  const tenantAssets = await getTenantAssets(tenantId);

  console.log(tenantAssets);

  return (
    <main className="min-h-dvh w-screen flex flex-col items-center justify-center">
      <div className="container">
        <section className="flex flex-col items-center gap-6 text-center">
          <Image
            src={tenantAssets.logoUrl}
            alt="Applicazione disattivata"
            width={400}
            height={400}
          />
          <h1 className="text-5xl font-semibold">Applicazione non disponibile</h1>
          <p>
            L&apos;applicazione è temporaneamente non disponibile. <br /> Ci
            scusiamo per l&apos;inconveniente. <br /> Torneremo al più presto.
          </p>
        </section>
      </div>
    </main>
  );
}
