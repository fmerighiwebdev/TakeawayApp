import AuthGuard from "@/components/admin/auth/auth-guard";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Card } from "@/components/ui/card";
import FloatingBack from "@/components/ui/floating-back";
import { getTopProductsPerCategory, getTopProducts } from "@/lib/products/products";
import { getTenantId } from "@/lib/tenant/tenantDetails";
import Image from "next/image";
import Link from "next/link";

export default async function AdminDashboardStats() {
  const tenantId = await getTenantId();
  const topProducts = await getTopProducts(tenantId);
  const topProductsPerCategory = await getTopProductsPerCategory(tenantId);

  const categoryGroupedProducts = topProductsPerCategory.reduce((acc, row) => {
    acc[row.category_id] ??= { name: row.category_name, items: [] };

    if (row.product_id) {
      acc[row.category_id].items.push(row);
    }

    return acc;
  }, {});

  return (
    <AuthGuard>
      <main className="pt-20 pb-24 lg:pt-16 min-h-dvh">
        <div className="container">
          <section className="w-full max-w-3xl mx-auto">
            <div className="flex flex-col gap-4">
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                      <Link
                        href="/admin/dashboard"
                        className="text-md md:text-lg"
                      >
                        Dashboard
                      </Link>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <span className="text-md md:text-lg text-primary font-semibold">
                      Statistiche
                    </span>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
              <h1 className="text-5xl text-primary font-medium">Statistiche</h1>
              <p className="text-lg md:text-xl text-(--muted-light-text)">
                Qui potrai visualizzare le statistiche dei tuoi ordini e dei
                tuoi prodotti più venduti.
              </p>
              <div className="separator-horizontal"></div>
              <div className="flex flex-col gap-8">
                <div className="flex flex-col gap-3">
                  <h2 className="text-2xl md:text-3xl text-(--muted-text)">
                    Prodotti più venduti
                  </h2>
                  {topProducts.length > 0 ? (
                    <div className="flex flex-col md:flex-row gap-2">
                      {topProducts.map((product) => (
                        <Card
                          key={product.product_id}
                          className="flex gap-4 p-4 rounded-lg w-full lg:w-1/2 border-primary/30"
                        >
                          {product.image_url && (
                            <Image
                              src={product.image_url}
                              alt={product.name}
                              width={80}
                              height={80}
                              className="w-20 h-20 object-cover rounded-md"
                            />
                          )}
                          <div>
                            <h3 className="text-lg font-medium text-(--muted-text)">
                              {product.name}
                            </h3>
                            <p className="text-muted-foreground">
                              <em>{product.description}</em>
                            </p>
                          </div>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">
                      Non sono presenti prodotti.
                    </p>
                  )}
                </div>
                <div className="flex flex-col gap-3">
                  <h2 className="text-2xl md:text-3xl text-(--muted-text)">
                    Prodotti più venduti per categoria
                  </h2>
                  {Object.entries(categoryGroupedProducts).map(
                    ([categoryId, group]) => (
                      <div key={categoryId} className="flex flex-col gap-3">
                        <h3 className="text-xl text-primary">{group.name}</h3>
                        {group.items.length > 0 ? (
                          <div className="flex flex-col md:flex-row gap-2">
                            {group.items.map((p) => (
                              <Card
                                key={p.product_id}
                                className="flex gap-4 p-4 rounded-lg w-full lg:w-1/2 border-primary/30"
                              >
                                {p.image_url && (
                                  <Image
                                    src={p.image_url}
                                    alt={p.product_name}
                                    width={80}
                                    height={80}
                                    className="w-20 h-20 object-cover rounded-md"
                                  />
                                )}
                                <div>
                                  <h3 className="text-lg font-medium text-(--muted-text)">
                                    {p.product_name}
                                  </h3>
                                  <p className="text-muted-foreground">
                                    <em>{p.product_description}</em>
                                  </p>
                                </div>
                              </Card>
                            ))}
                          </div>
                        ) : (
                          <p className="text-muted-foreground">
                            Non sono presenti prodotti in questa categoria.
                          </p>
                        )}
                      </div>
                    ),
                  )}
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
      <FloatingBack href="/admin/dashboard" />
    </AuthGuard>
  );
}
