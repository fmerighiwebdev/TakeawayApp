export const metadata = {
  title: "Gestione ordini",
  description:
    "Accedi all'area riservata per gestire gli ordini del tuo ristorante.",
  robots: {
    index: false,
    follow: false,
  },
  manifest: "/api/admin/manifest",
  appleWebApp: {
    title: "Gestione ordini",
    statusBarStyle: "default",
    capable: true,
  },
};

export default async function AdminLayout({ children }) {
  return (
    <>
      {children}
    </>
  );
}
