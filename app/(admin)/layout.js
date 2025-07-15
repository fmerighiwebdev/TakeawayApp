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

export default function AdminLayout({ children }) {
  return (
    <>
      {children}
    </>
  );
}
