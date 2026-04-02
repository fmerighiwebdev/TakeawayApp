import CookieBanner from "@/components/layout/cookie-banner";
import Footer from "@/components/layout/footer";
import InstallPrompt from "@/components/pwa/install-prompt";
import FloatingCart from "@/components/cart/floating-cart";
import {
  getTenantCategories,
  getTenantContext,
  getTenantId,
} from "@/lib/tenant/tenantDetails";

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
