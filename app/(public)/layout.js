import AddToHomeScreenPrompt from "@/components/add-to-home/add-to-home";
import Footer from "@/components/footer/footer";
import Header from "@/components/header/header";
import {
  getTenantAssets,
  getTenantDetails,
  getTenantId,
} from "@/lib/tenantDetails";
import Script from "next/script";

export const metadata = {
  manifest: "/api/manifest",
};

export default async function PublicLayout({ children }) {
  const tenantId = await getTenantId();
  const tenantData = await getTenantDetails(tenantId);
  const tenantAssets = await getTenantAssets(tenantId);

  return (
    <>
      <Script
        id="cookieyes"
        src={`https://cdn-cookieyes.com/client_data/d521c03e28eb7f8fcd179382/script.js`}
      ></Script>
      <Header tenantData={tenantData} tenantLogo={tenantAssets.logoUrl} />
      {children}
      <Footer tenantData={tenantData} tenantLogo={tenantAssets.logoUrl} />
      <AddToHomeScreenPrompt />
    </>
  );
}
