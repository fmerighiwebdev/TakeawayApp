import AdminForm from "@/components/admin/auth/admin-form";
import { getTenantId } from "@/lib/tenant/tenantDetails";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function LoginPage() {
  const tenantId = await getTenantId();
  const cookieStore = await cookies();
  const cookieKey = `auth-token-${tenantId}`;
  const authToken = cookieStore.get(cookieKey)?.value;

  let isAuthenticated = false;

  if (authToken) {
    try {
      jwt.verify(authToken, process.env.JWT_SECRET);
      isAuthenticated = true;
    } catch (error) {
      // Token invalido, non fare nulla
    }
  }

  if (isAuthenticated) {
    redirect("/admin/dashboard");
  }

  return (
    <main className="w-screen h-dvh flex items-center justify-center pt-20 pb-24 lg:pt-16">
      <div className="container flex flex-col items-center gap-12">
        <h1 className="text-5xl md:text-6xl text-center font-medium text-primary">Gestione Ordini</h1>
        <section className="w-full max-w-md">
          <AdminForm />
        </section>
      </div>
    </main>
  );
}
