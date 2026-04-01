import CookieBanner from "@/components/cookie-banner";
import Footer from "@/components/footer";
import InstallPrompt from "@/components/pwa/install-prompt";
import FloatingCart from "@/components/ui/floating-cart";
import {
  getTenantCategories,
  getTenantContext,
  getTenantId,
} from "@/lib/tenantDetails";

export const metadata = {
  manifest: "/api/manifest",
};

export default async function PublicLayout({ children }) {
  const tenantId = await getTenantId();
  const [tenantContext, tenantCategories] = await Promise.all([
    getTenantContext(tenantId),
    getTenantCategories(tenantId),
  ]);
  const tenantData = tenantContext.tenantDetails;
  const tenantAssets = tenantContext.assets;

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
