import CartItems from "@/components/cart-items";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import FloatingBack from "@/components/ui/floating-back";
import { cookies, headers } from "next/headers";
import Link from "next/link";

export const metadata = {
  title: "Carrello",
  description: "Gestisci il tuo carrello e procedi all'acquisto",
  robots: {
    index: false,
    follow: true,
  },
  alternates: {
    canonical: "/carrello",
  },
};

export default async function CartPage() {
  const headersList = await headers();
  let hostname = headersList.get("host") || "localhost";

  if (hostname === "localhost:3000") {
    hostname = "localhost";
  }

  const cookieStore = await cookies();
  const cartCount =
    Number(cookieStore.get(`cart-count-${hostname}`)?.value) || 0;

  if (cartCount === 0) {
    return (
      <main className="w-screen h-dvh flex items-center justify-center py-24">
        <section>
          <div className="container flex flex-col items-center gap-12">
            <h1 className="text-6xl font-medium text-(--muted-text) text-center">
              Il carrello è vuoto
            </h1>
            <button className="btn btn-primary">
              <Link href="/" className="text-lg">
                Torna allo shop
              </Link>
            </button>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="py-24 min-h-dvh">
      <div className="container flex flex-col gap-10">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/" className="text-lg">
                  Home
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <span className="text-lg text-primary font-semibold">
                  Carrello
                </span>
              </BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="flex flex-col gap-2">
          <h1 className="text-6xl text-primary font-medium">Il tuo ordine</h1>
          <div className="separator-horizontal"></div>
        </div>
        <CartItems />
      </div>
      <FloatingBack href="/" />
    </main>
  );
}
