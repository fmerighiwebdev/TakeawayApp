import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import FloatingBack from "@/components/ui/floating-back";
import { getTenantDetails, getTenantId } from "@/lib/tenant/tenantDetails";
import Link from "next/link";

export const metadata = {
  title: "Cookie Policy",
  description:
    "Informativa sull’utilizzo dei cookie e di eventuali strumenti tecnici analoghi.",
  robots: {
    index: false,
    follow: true,
  },
  alternates: {
    canonical: "/cookie-policy",
  },
};

function BreadcrumbJsonLd({ tenantDetails }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            {
              "@type": "ListItem",
              position: 1,
              name: "Home",
              item: `https://${tenantDetails.domain}`,
            },
            {
              "@type": "ListItem",
              position: 2,
              name: "Cookie Policy",
              item: `https://${tenantDetails.domain}/cookie-policy`,
            },
          ],
        }),
      }}
    />
  );
}

function Section({ number, title, children }) {
  return (
    <section className="space-y-4 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold tracking-tight text-neutral-900 sm:text-2xl">
          {number}. {title}
        </h2>
      </div>
      <div className="space-y-4 text-sm leading-7 text-neutral-700 sm:text-base">
        {children}
      </div>
    </section>
  );
}

function BulletList({ items }) {
  return (
    <ul className="list-disc space-y-2 pl-6">
      {items.map((item, index) => (
        <li key={index}>{item}</li>
      ))}
    </ul>
  );
}

export default async function CookiePolicyPage() {
  const tenantId = await getTenantId();
  const tenantDetails = await getTenantDetails(tenantId);

  const today = new Date();
  const formattedDate = `${today.getDate().toString().padStart(2, "0")}/${(
    today.getMonth() + 1
  )
    .toString()
    .padStart(2, "0")}/${today.getFullYear()}`;

  return (
    <>
      <BreadcrumbJsonLd tenantDetails={tenantDetails} />
      <main className="min-h-screen pt-20 pb-24 lg:pt-16 bg-neutral-50">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-10">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link href="/" className="text-md md:text-lg">
                      Home
                    </Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <span className="text-md md:text-lg text-primary font-semibold">
                      Cookie Policy
                    </span>
                  </BreadcrumbLink>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            <header className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm sm:p-8">
              <div className="space-y-4">
                <p className="text-sm font-medium text-neutral-500">
                  Ultimo aggiornamento: {formattedDate}
                </p>

                <div className="space-y-3">
                  <h1 className="text-3xl text-primary font-bold tracking-tight sm:text-4xl">
                    Cookie Policy
                  </h1>
                  <p className="max-w-3xl text-sm leading-7 text-neutral-700 sm:text-base">
                    La presente Cookie Policy descrive l’uso dei cookie e di
                    eventuali strumenti tecnici analoghi da parte del sito/app
                    di {tenantDetails.name}.
                  </p>
                </div>
              </div>
            </header>

            <Section number="1" title="Cosa sono i cookie">
              <p>
                I cookie sono piccoli file di testo che i siti web inviano al
                dispositivo dell’utente, dove vengono memorizzati per essere poi
                ritrasmessi agli stessi siti alla visita successiva.
              </p>

              <p>
                Possono essere utilizzati anche strumenti tecnici analoghi ai
                cookie, ove necessari al funzionamento del servizio.
              </p>
            </Section>

            <Section number="2" title="Tipologie di cookie utilizzati">
              <p>
                Il sito/app utilizza esclusivamente cookie e strumenti tecnici
                strettamente necessari al funzionamento del servizio e alla
                corretta erogazione delle funzionalità richieste dall’utente.
              </p>

              <p>Tra questi possono rientrare, a titolo esemplificativo:</p>

              <BulletList
                items={[
                  "cookie di sessione;",
                  "cookie tecnici necessari alla gestione del carrello o del flusso di ordine;",
                  "cookie o identificatori necessari all’autenticazione nelle aree riservate;",
                  "cookie o strumenti tecnici necessari per sicurezza, bilanciamento del carico, prevenzione di abusi e continuità del servizio;",
                  "eventuali preferenze tecniche strettamente necessarie al funzionamento dell’interfaccia.",
                ]}
              />
            </Section>

            <Section number="3" title="Finalità">
              <p>Tali strumenti sono utilizzati esclusivamente per:</p>

              <BulletList
                items={[
                  "consentire la navigazione e l’utilizzo del sito/app;",
                  "permettere l’inoltro e la gestione degli ordini;",
                  "garantire la sicurezza della piattaforma;",
                  "mantenere la sessione utente e le funzionalità essenziali;",
                  "assicurare il corretto funzionamento delle aree amministrative o riservate.",
                ]}
              />
            </Section>

            <Section number="4" title="Base giuridica e consenso">
              <p>
                L’utilizzo di cookie tecnici e di strumenti strettamente
                necessari non richiede il consenso preventivo dell’utente, in
                quanto è indispensabile per fornire il servizio richiesto.
              </p>

              <p>
                Per tale ragione il sito/app non utilizza, allo stato attuale,
                un banner per la raccolta del consenso ai cookie.
              </p>
            </Section>

            <Section number="5" title="Cookie di terze parti">
              <p>
                Allo stato attuale, il sito/app non utilizza cookie di
                profilazione, marketing o analytics di terze parti per finalità
                statistiche o pubblicitarie.
              </p>

              <p>
                Qualora in futuro venissero implementati strumenti ulteriori non
                strettamente necessari, la presente Cookie Policy sarà
                aggiornata e saranno adottati gli eventuali adempimenti
                richiesti dalla normativa applicabile.
              </p>
            </Section>

            <Section number="6" title="Gestione dei cookie">
              <p>
                L’utente può configurare il proprio browser per bloccare o
                cancellare i cookie tecnici. Tuttavia, la disabilitazione di
                tali cookie può compromettere il corretto funzionamento del
                sito/app o impedirne l’utilizzo.
              </p>
            </Section>

            <Section number="7" title="Titolare del trattamento">
              <p>
                Il titolare del trattamento relativo ai dati raccolti tramite i
                cookie tecnici è:
              </p>

              <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-5">
                <div>
                  <p className="font-semibold text-neutral-900">
                    {tenantDetails.name}
                  </p>
                  <p>Sede legale: {tenantDetails.address}</p>
                  <p>E-mail: {tenantDetails.email}</p>
                  <p>Telefono: {tenantDetails.phone}</p>
                </div>
              </div>
            </Section>

            <Section number="8" title="Aggiornamenti">
              <p>
                La presente Cookie Policy può essere soggetta a modifiche o
                aggiornamenti. Le eventuali modifiche saranno pubblicate su
                questa pagina con indicazione della data di ultimo
                aggiornamento.
              </p>
            </Section>
          </div>
        </div>
        <FloatingBack href="/" />
      </main>
    </>
  );
}
