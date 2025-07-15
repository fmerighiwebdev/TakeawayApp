import { getTenantId } from "@/lib/tenantDetails";
import { redirect } from "next/navigation";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export const metadata = {
  title: "All'Amicizia Takeaway - Ordini",
  description:
    "Accedi all'area riservata per gestire gli ordini del tuo ristorante.",
  robots: {
    index: false,
    follow: false,
  },
  manifest: "/api/admin-manifest"
};

export default async function AdminLayout({ children }) {
  return (
    <>
      {children}
    </>
  );
}
