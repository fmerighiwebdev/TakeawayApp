import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-dvh w-screen flex flex-col items-center justify-center">
      <section
        aria-label="Pagina non trovata"
        className="flex flex-col items-center justify-center gap-10 not-found-section"
      >
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-8xl font-semibold text-primary">404</h1>
          <p className="text-(--muted-text) text-xl">
            La pagina che stai cercando non esiste.
          </p>
        </div>
        <button className="btn btn-primary">
          <Link href="/">Torna alla home</Link>
        </button>
      </section>
    </main>
  );
}
