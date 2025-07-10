import AddToHomeScreenPrompt from "@/components/add-to-home/add-to-home";
import Footer from "@/components/footer/footer";
import Header from "@/components/header/header";
import Script from "next/script";

export const metadata = {
  manifest: "/site.webmanifest"
}

export default function PublicLayout({ children }) {
  return (
    <>
      <Script
        id="cookieyes"
        src={`https://cdn-cookieyes.com/client_data/d521c03e28eb7f8fcd179382/script.js`}>
      </Script>
      <Header />
      {children}
      <Footer />
      <AddToHomeScreenPrompt />
    </>
  );
}