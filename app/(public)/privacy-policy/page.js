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
  title: "Privacy Policy",
  description:
    "Informativa sul trattamento dei dati personali ai sensi degli articoli 13 e seguenti del Regolamento (UE) 2016/679 (GDPR).",
  robots: {
    index: false,
    follow: true,
  },
  alternates: {
    canonical: "/privacy-policy",
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
              name: "Privacy Policy",
              item: `https://${tenantDetails.domain}/privacy-policy`,
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

export default async function PrivacyPolicyPage() {
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
                      Privacy Policy
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
                    Privacy Policy
                  </h1>
                  <p className="max-w-3xl text-sm leading-7 text-neutral-700 sm:text-base">
                    La presente informativa è resa ai sensi degli articoli 13 e
                    seguenti del Regolamento (UE) 2016/679 (“GDPR”) agli utenti
                    che effettuano ordini tramite la piattaforma online di
                    takeaway del ristorante.
                  </p>
                </div>
              </div>
            </header>

            <Section number="1" title="Titolare del trattamento">
              <p>Il titolare del trattamento dei dati personali è:</p>

              <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-5">
                <div>
                  <p className="font-semibold text-neutral-900">
                    {tenantDetails.name}
                  </p>
                  <p>Sede legale: {tenantDetails.address}</p>
                  <p>P. IVA / C.F.: {tenantDetails.tax}</p>
                  <p>E-mail: {tenantDetails.email}</p>
                  <p>Telefono: {tenantDetails.phone}</p>
                </div>
              </div>

              <p>
                Per qualsiasi richiesta relativa al trattamento dei dati
                personali o all’esercizio dei diritti previsti dal GDPR,
                l’utente può contattare il Titolare ai recapiti sopra indicati.
              </p>
            </Section>

            <Section
              number="2"
              title="Responsabile del trattamento e fornitori tecnici"
            >
              <p>
                Per l’erogazione della piattaforma, il Titolare si avvale di
                fornitori terzi che trattano dati personali per suo conto,
                debitamente nominati, ove necessario, quali responsabili o
                sub-responsabili del trattamento.
              </p>

              <p>Tra questi possono rientrare:</p>

              <BulletList
                items={[
                  "il fornitore della piattaforma software;",
                  "fornitori di hosting, infrastruttura cloud e database;",
                  "fornitori di assistenza tecnica, manutenzione applicativa e sicurezza informatica;",
                  "eventuali fornitori di servizi e-mail o notifiche, se utilizzati.",
                ]}
              />

              <p>
                Tali soggetti trattano i dati esclusivamente nei limiti
                necessari all’erogazione dei rispettivi servizi e secondo
                istruzioni del Titolare.
              </p>
            </Section>

            <Section number="3" title="Tipologie di dati trattati">
              <p>
                Il Titolare può trattare le seguenti categorie di dati
                personali:
              </p>

              <BulletList
                items={[
                  "nome e cognome;",
                  "numero di telefono;",
                  "indirizzo e-mail;",
                  "dati relativi all’ordine effettuato;",
                  "orario di ritiro selezionato;",
                  "eventuali note inserite dall’utente;",
                  "dati tecnici di navigazione e di funzionamento del servizio;",
                  "eventuali dati relativi alla salute solo se volontariamente inseriti dall’utente nelle note dell’ordine (ad esempio allergie o intolleranze), nei limiti strettamente necessari alla gestione della richiesta.",
                ]}
              />
            </Section>

            <Section number="4" title="Finalità del trattamento">
              <div className="space-y-5">
                <div>
                  <p className="font-semibold text-neutral-900">
                    a) Gestione dell’ordine takeaway
                  </p>
                  <p>
                    Per ricevere, elaborare, confermare, preparare e mettere a
                    disposizione l’ordine per il ritiro.
                  </p>
                </div>

                <div>
                  <p className="font-semibold text-neutral-900">
                    b) Comunicazioni di servizio relative all’ordine
                  </p>
                  <p>
                    Per contattare l’utente in merito all’ordine, ad esempio per
                    conferme, variazioni, ritardi, indisponibilità o altre
                    comunicazioni operative.
                  </p>
                </div>

                <div>
                  <p className="font-semibold text-neutral-900">
                    c) Gestione di richieste specifiche inserite nelle note
                  </p>
                  <p>
                    Per gestire eventuali richieste aggiuntive collegate
                    all’ordine, incluse — ove presenti — indicazioni relative ad
                    allergie, intolleranze o esigenze alimentari particolari.
                  </p>
                </div>

                <div>
                  <p className="font-semibold text-neutral-900">
                    d) Adempimenti amministrativi, contabili e legali
                  </p>
                  <p>
                    Per adempiere a obblighi previsti da leggi, regolamenti o
                    richieste dell’autorità competente.
                  </p>
                </div>

                <div>
                  <p className="font-semibold text-neutral-900">
                    e) Sicurezza, manutenzione e difesa dei diritti
                  </p>
                  <p>
                    Per garantire sicurezza informatica, continuità del
                    servizio, prevenzione di abusi, gestione di incidenti
                    tecnici e tutela dei diritti del Titolare in sede
                    stragiudiziale o giudiziaria.
                  </p>
                </div>
              </div>
            </Section>

            <Section number="5" title="Base giuridica del trattamento">
              <p>
                Il trattamento dei dati personali si fonda sulle seguenti basi
                giuridiche:
              </p>

              <BulletList
                items={[
                  "esecuzione di un contratto o di misure precontrattuali, per la gestione dell’ordine e delle comunicazioni di servizio;",
                  "adempimento di obblighi legali, per gli adempimenti amministrativi, fiscali e normativi;",
                  "legittimo interesse del Titolare, per esigenze di sicurezza del sistema, prevenzione abusi, assistenza tecnica e difesa dei diritti;",
                  "consenso esplicito dell’interessato, limitatamente agli eventuali dati particolari relativi alla salute volontariamente inseriti nelle note dell’ordine, ove necessari per gestire richieste alimentari specifiche.",
                ]}
              />
            </Section>

            <Section number="6" title="Natura del conferimento dei dati">
              <p>
                Il conferimento dei dati contrassegnati come obbligatori è
                necessario per consentire la corretta gestione dell’ordine. Il
                mancato conferimento può comportare l’impossibilità di
                completare o gestire l’ordine.
              </p>

              <p>
                Il conferimento di eventuali dati relativi alla salute nelle
                note è facoltativo; tuttavia, ove l’utente decida di inserirli,
                tali dati saranno trattati esclusivamente nei limiti
                strettamente necessari alla gestione della richiesta formulata.
              </p>
            </Section>

            <Section number="7" title="Modalità del trattamento">
              <p>
                Il trattamento dei dati avviene con strumenti informatici e
                telematici, nonché, ove necessario, con strumenti manuali, nel
                rispetto dei principi di liceità, correttezza, trasparenza,
                minimizzazione, integrità e riservatezza.
              </p>

              <p>
                Sono adottate misure tecniche e organizzative adeguate a
                prevenire accessi non autorizzati, divulgazione, perdita,
                distruzione o uso illecito dei dati.
              </p>
            </Section>

            <Section number="8" title="Destinatari dei dati">
              <p>
                I dati personali possono essere comunicati o comunque resi
                accessibili a:
              </p>

              <BulletList
                items={[
                  "personale autorizzato del Titolare;",
                  "personale e collaboratori del fornitore della piattaforma, nei limiti necessari ad assistenza tecnica, manutenzione e supporto;",
                  "fornitori di servizi cloud, hosting, database, infrastruttura IT e sicurezza;",
                  "soggetti cui la comunicazione sia dovuta per obbligo di legge o ordine dell’autorità.",
                ]}
              />

              <p>I dati non sono diffusi.</p>
            </Section>

            <Section number="9" title="Trasferimenti verso Paesi extra SEE">
              <p>
                I dati personali sono trattati, di regola, all’interno dello
                Spazio Economico Europeo.
              </p>

              <p>
                Qualora, per esigenze tecniche o organizzative, alcuni fornitori
                comportino trasferimenti verso Paesi non appartenenti allo
                Spazio Economico Europeo, tali trasferimenti avverranno nel
                rispetto della normativa applicabile e mediante l’adozione delle
                garanzie previste dal GDPR.
              </p>
            </Section>

            <Section number="10" title="Periodo di conservazione">
              <p>
                I dati personali sono conservati per un periodo non superiore a
                quello necessario rispetto alle finalità per cui sono stati
                raccolti.
              </p>

              <p>In particolare:</p>

              <BulletList
                items={[
                  "i dati relativi agli ordini sono conservati per il tempo necessario alla gestione dell’ordine e per l’eventuale gestione di contestazioni;",
                  "i dati necessari per adempimenti amministrativi e fiscali sono conservati per il periodo previsto dalla legge;",
                  "i log tecnici e i dati trattati per finalità di sicurezza sono conservati per il tempo strettamente necessario a tali finalità;",
                  "eventuali dati relativi alla salute inseriti nelle note sono conservati per il tempo strettamente necessario alla gestione dell’ordine e, successivamente, solo se e nella misura in cui ciò sia richiesto da obblighi di legge o esigenze di tutela dei diritti.",
                ]}
              />
            </Section>

            <Section number="11" title="Diritti dell’interessato">
              <p>
                L’interessato può esercitare, nei casi previsti, i diritti di:
              </p>

              <BulletList
                items={[
                  "accesso ai dati personali;",
                  "rettifica dei dati inesatti o integrazione dei dati incompleti;",
                  "cancellazione dei dati;",
                  "limitazione del trattamento;",
                  "opposizione al trattamento, ove applicabile;",
                  "portabilità dei dati, nei casi previsti;",
                  "revoca del consenso in qualsiasi momento, senza pregiudicare la liceità del trattamento basata sul consenso prestato prima della revoca;",
                  "reclamo all’Autorità Garante per la protezione dei dati personali.",
                ]}
              />

              <p>
                Le richieste possono essere inviate ai recapiti del Titolare
                indicati nella presente informativa.
              </p>
            </Section>

            <Section number="12" title="Modifiche alla presente informativa">
              <p>
                Il Titolare si riserva il diritto di modificare o aggiornare la
                presente Privacy Policy in qualsiasi momento. Le modifiche
                saranno pubblicate su questa pagina con indicazione della data
                di aggiornamento.
              </p>
            </Section>
          </div>
        </div>
        <FloatingBack href="/" />
      </main>
    </>
  );
}
