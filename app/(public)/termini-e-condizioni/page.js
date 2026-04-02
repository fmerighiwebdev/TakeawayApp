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
  title: "Termini e Condizioni",
  description: "Termini e Condizioni del servizio di ordine takeaway.",
  robots: {
    index: false,
    follow: true,
  },
  alternates: {
    canonical: "/termini-e-condizioni",
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
              name: "Termini e Condizioni",
              item: `https://${tenantDetails.domain}/termini-e-condizioni`,
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

export default async function TermsAndConditionsPage() {
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
                      Termini e Condizioni
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
                    Termini e Condizioni del servizio di ordine takeaway
                  </h1>
                  <p className="max-w-3xl text-sm leading-7 text-neutral-700 sm:text-base">
                    I presenti Termini e Condizioni disciplinano l’utilizzo del
                    sito/app e il servizio di inoltro di ordini takeaway presso{" "}
                    {tenantDetails.name}.
                  </p>
                  <p className="max-w-3xl text-sm leading-7 text-neutral-700 sm:text-base">
                    Effettuando un ordine tramite il sito/app, l’utente dichiara
                    di aver letto e accettato i presenti Termini e Condizioni.
                  </p>
                </div>
              </div>
            </header>

            <Section number="1" title="Identità del professionista">
              <p>
                Il servizio di vendita dei prodotti disponibili sul sito/app è
                offerto da:
              </p>

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
            </Section>

            <Section number="2" title="Ruolo della piattaforma tecnologica">
              <p>
                La piattaforma tecnologica utilizzata per la gestione degli
                ordini è fornita da FM, che agisce quale fornitore tecnico del
                servizio digitale.
              </p>

              <p>
                Il contratto di acquisto dei prodotti si conclude esclusivamente
                tra l’utente e il ristorante.
              </p>
            </Section>

            <Section number="3" title="Ambito del servizio">
              <p>Il sito/app consente all’utente di:</p>

              <BulletList
                items={[
                  "consultare il catalogo prodotti;",
                  "selezionare i prodotti desiderati;",
                  "inserire i dati necessari al completamento dell’ordine;",
                  "inoltrare un ordine takeaway per il successivo ritiro presso il punto vendita.",
                ]}
              />
            </Section>

            <Section number="4" title="Procedura di ordine">
              <p>Per effettuare un ordine, l’utente deve:</p>

              <BulletList
                items={[
                  "selezionare i prodotti desiderati;",
                  "verificare il contenuto del carrello;",
                  "inserire i dati richiesti in fase di checkout;",
                  "prendere visione di Privacy Policy e Termini e Condizioni;",
                  "inoltrare l’ordine tramite l’apposito comando finale.",
                ]}
              />

              <p>
                Prima dell’invio dell’ordine, l’utente visualizza un riepilogo
                con le informazioni essenziali dell’ordine, inclusi i prodotti
                selezionati, il prezzo totale e l’orario di ritiro richiesto.
              </p>
            </Section>

            <Section number="5" title="Obbligo di pagamento">
              <p>
                L’inoltro dell’ordine implica per l’utente l’obbligo di
                pagamento del prezzo indicato nel riepilogo dell’ordine.
              </p>

              <p>
                Il comando finale di conferma dell’ordine deve essere inteso
                come ordine con obbligo di pagare.
              </p>
            </Section>

            <Section number="6" title="Prezzi">
              <p>
                Tutti i prezzi sono espressi in euro e si intendono [IVA inclusa
                / IVA esclusa, da adattare] salvo diversa indicazione.
              </p>

              <p>
                Il ristorante si riserva il diritto di modificare in qualsiasi
                momento prezzi, assortimento, disponibilità e descrizioni dei
                prodotti. Tali modifiche non si applicano agli ordini già
                correttamente inoltrati prima della modifica.
              </p>
            </Section>

            <Section number="7" title="Modalità di pagamento">
              <p>
                Salvo diversa indicazione, il pagamento avviene direttamente
                presso il punto vendita al momento del ritiro, secondo le
                modalità accettate dal ristorante.
              </p>
            </Section>

            <Section
              number="8"
              title="Ricezione, accettazione e gestione dell’ordine"
            >
              <p>
                L’inoltro dell’ordine da parte dell’utente costituisce una
                proposta contrattuale di acquisto.
              </p>

              <p>Il ristorante si riserva la facoltà di:</p>

              <BulletList
                items={[
                  "accettare l’ordine;",
                  "contattare l’utente per chiarimenti;",
                  "proporre modifiche in caso di indisponibilità o criticità operative;",
                  "rifiutare l’ordine, in tutto o in parte, in caso di impossibilità di esecuzione, indisponibilità dei prodotti, errori materiali o altri giustificati motivi.",
                ]}
              />

              <p>
                L’eventuale ricezione automatica dell’ordine da parte del
                sistema non equivale, di per sé, ad accettazione definitiva da
                parte del ristorante, ove non diversamente specificato.
              </p>
            </Section>

            <Section number="9" title="Orario di ritiro">
              <p>
                L’utente seleziona un orario di ritiro tra quelli disponibili o
                indicati dal ristorante.
              </p>

              <p>
                Gli orari comunicati devono intendersi indicativi e possono
                subire variazioni in funzione dei tempi di lavorazione,
                dell’affluenza o di eventi imprevisti.
              </p>

              <p>
                L’utente è tenuto a ritirare l’ordine presso il punto vendita
                entro un tempo ragionevole rispetto all’orario concordato.
              </p>
            </Section>

            <Section number="10" title="Modifiche e annullamenti">
              <p>
                L’utente può richiedere la modifica o l’annullamento dell’ordine
                contattando direttamente il ristorante ai recapiti indicati sul
                sito/app.
              </p>

              <p>
                Il ristorante valuterà tali richieste in base allo stato di
                preparazione dell’ordine. Una volta avviata la preparazione,
                l’ordine potrebbe non essere più modificabile o annullabile.
              </p>
            </Section>

            <Section number="11" title="Informazioni sui prodotti">
              <p>
                Le descrizioni dei prodotti, le immagini, gli ingredienti, le
                varianti e le altre informazioni presenti sul sito/app hanno
                finalità informativa e possono essere soggetti ad aggiornamento.
              </p>

              <p>
                Resta fermo l’obbligo dell’utente di segnalare chiaramente
                eventuali esigenze specifiche, nei limiti in cui il ristorante
                consenta tale possibilità.
              </p>
            </Section>

            <Section
              number="12"
              title="Allergie, intolleranze e note aggiuntive"
            >
              <p>
                L’utente è responsabile delle informazioni inserite nel campo
                note.
              </p>

              <p>
                Qualora l’utente inserisca indicazioni relative ad allergie,
                intolleranze o altre esigenze alimentari, tali informazioni
                saranno utilizzate esclusivamente per la gestione dell’ordine,
                fermo restando che il ristorante potrà contattare l’utente per
                chiarimenti e che non potranno essere garantite prestazioni
                ulteriori rispetto a quanto espressamente confermato dal
                ristorante.
              </p>
            </Section>

            <Section number="13" title="Diritto di recesso">
              <p>
                Ai sensi della normativa applicabile, il diritto di recesso può
                essere escluso con riferimento alla fornitura di beni che
                rischiano di deteriorarsi o scadere rapidamente, inclusi, ove
                applicabile, prodotti alimentari preparati per il takeaway.
              </p>
            </Section>

            <Section number="14" title="Uso corretto del sito/app">
              <p>
                L’utente si impegna a utilizzare il sito/app in modo conforme
                alla legge, a non inserire dati falsi, ingannevoli o di terzi
                senza autorizzazione e a non porre in essere condotte idonee a
                compromettere la sicurezza o il corretto funzionamento della
                piattaforma.
              </p>
            </Section>

            <Section number="15" title="Limitazione di responsabilità">
              <p>
                Fatti salvi i limiti inderogabili di legge, il ristorante non
                potrà essere ritenuto responsabile per:
              </p>

              <BulletList
                items={[
                  "malfunzionamenti temporanei della piattaforma non imputabili direttamente al ristorante;",
                  "indisponibilità della rete internet o dei dispositivi dell’utente;",
                  "ritardi o impossibilità di esecuzione dovuti a forza maggiore o eventi imprevedibili;",
                  "errori derivanti da dati incompleti o inesatti forniti dall’utente.",
                ]}
              />
            </Section>

            <Section number="16" title="Proprietà intellettuale">
              <p>
                Contenuti, marchi, segni distintivi, testi, layout, elementi
                grafici e software relativi al sito/app sono protetti dalla
                normativa applicabile e non possono essere utilizzati,
                riprodotti o diffusi senza autorizzazione del rispettivo
                titolare.
              </p>
            </Section>

            <Section number="17" title="Assistenza e reclami">
              <p>
                Per assistenza, segnalazioni o reclami relativi all’ordine,
                l’utente può contattare il ristorante ai recapiti indicati sul
                sito/app.
              </p>
            </Section>

            <Section number="18" title="Legge applicabile e foro competente">
              <p>
                I presenti Termini e Condizioni sono disciplinati dalla legge
                italiana.
              </p>

              <p>
                Per le controversie con utenti qualificabili come consumatori,
                resta fermo il foro inderogabile del consumatore, ove
                applicabile.
              </p>
            </Section>
          </div>
        </div>
        <FloatingBack href="/" />
      </main>
    </>
  );
}
