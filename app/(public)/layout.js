import Footer from "@/components/footer";
import FloatingCart from "@/components/ui/floating-cart";
import {
  getTenantAssets,
  getTenantCategories,
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
  const tenantCategories = await getTenantCategories(tenantId);

  return (
    <>
      <Script
        id="cookieyes"
        src={`https://cdn-cookieyes.com/client_data/d521c03e28eb7f8fcd179382/script.js`}
      ></Script>
      {children}
      <Footer tenantData={tenantData} tenantLogo={tenantAssets.logoUrl} tenantCategories={tenantCategories} />
      <FloatingCart />
      {/* <AddToHomeScreenPrompt /> */}
    </>
  );
}
