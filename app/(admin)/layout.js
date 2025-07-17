export const metadata = {
  title: "Gestione ordini",
  description:
    "Accedi all'area riservata per gestire gli ordini del tuo ristorante.",
  robots: {
    index: false,
    follow: false,
  },
  manifest: "/api/admin/manifest"
};

export default async function AdminLayout({ children }) {
  return (
    <>
      {children}
    </>
  );
}
