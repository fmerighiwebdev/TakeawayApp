import CookieBanner from "@/components/cookie-banner";
import Footer from "@/components/footer";
import InstallPrompt from "@/components/pwa/install-prompt";
import FloatingCart from "@/components/ui/floating-cart";
import {
  getTenantAssets,
  getTenantCategories,
  getTenantDetails,
  getTenantId,
} from "@/lib/tenantDetails";

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
      {children}
      <Footer tenantData={tenantData} tenantLogo={tenantAssets.logoUrl} tenantCategories={tenantCategories} />
      <FloatingCart />
      {/* <CookieBanner /> */}
      <InstallPrompt />
    </>
  );
}
