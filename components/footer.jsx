import Image from "next/image";

import Link from "next/link";

export default async function Footer({
  tenantData,
  tenantLogo,
  tenantCategories,
}) {
  const currentYear = new Date().getFullYear();

  console.log("Rendering footer for tenant:", tenantData);

  return (
    <footer className="bg-neutral-primary-soft">
      <div className="mx-auto w-full max-w-7xl p-4 py-6 lg:py-8">
        <div className="md:flex md:justify-between">
          <div className="mb-6 md:mb-0 flex flex-col gap-2">
            <Image
              src={tenantLogo}
              alt={`${tenantData?.name} Logo`}
              width={100}
              height={40}
            />
            <div>
              <p className="font-semibold text-(--muted-text)">
                {tenantData?.name}
              </p>
              <p className="text-(--muted-text)">{tenantData?.tax}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-8 sm:gap-6 sm:grid-cols-3">
            <div>
              <h2 className="mb-6 text-sm font-semibold text-(--muted-text) uppercase">
                CATEGORIE
              </h2>
              <ul className="text-body font-medium">
                {tenantCategories?.map((category) => (
                  <li className="mb-2" key={category.id}>
                    <Link
                      href={`/menu/category/${category.slug}`}
                      className="hover:text-primary text-(--muted-text) transition-colors duration-200"
                    >
                      {category.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="mb-6 text-sm font-semibold text-(--muted-text) uppercase">
                LINK UTILI
              </h2>
              <ul className="text-body font-medium">
                {tenantData.website_url && (
                  <li className="mb-2">
                    <button className="btn btn-primary text-md">
                      <a
                        href={tenantData.website_url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Visita il nostro sito
                      </a>
                    </button>
                  </li>
                )}
                <li>
                  <Link
                    href="/contatti"
                    className="hover:text-primary text-(--muted-text) transition-colors duration-200"
                  >
                    Contattaci
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h2 className="mb-6 text-sm font-semibold text-(--muted-text) uppercase">
                LEGAL
              </h2>
              <ul className="text-body font-medium">
                <li className="mb-2">
                  <a href="#" className="hover:text-primary text-(--muted-text) transition-colors duration-200">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary text-(--muted-text) transition-colors duration-200">
                    Termini e condizioni
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <hr className="my-6 border-default sm:mx-auto lg:my-8" />
        <div className="sm:flex sm:items-center sm:justify-between">
          <span className="text-sm text-(--muted-light-text) sm:text-center">
            © {currentYear} {tenantData?.name || "Your Company"}. Tutti i
            diritti riservati.
          </span>
          <div className="flex mt-4 sm:justify-center sm:mt-0">
            {tenantData.socials.facebook && (
              <a
                href={tenantData.socials.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="text-body hover:text-heading mx-2"
              >
                <FacebookIcon />
              </a>
            )}
            {tenantData.socials.instagram && (
              <a
                href={tenantData.socials.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-body hover:text-heading mx-2"
              >
                <InstagramIcon />
              </a>
            )}
            {tenantData.socials.tiktok && (
              <a
                href={tenantData.socials.tiktok}
                target="_blank"
                rel="noopener noreferrer"
                className="text-body hover:text-heading mx-2"
              >
                <TikTokIcon />
              </a>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}

function InstagramIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="rgb(83, 83, 83)"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="lucide lucide-instagram-icon lucide-instagram hover:stroke-primary transition-colors duration-200"
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="rgb(83, 83, 83)"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="lucide lucide-facebook-icon lucide-facebook hover:stroke-primary transition-colors duration-200"
    >
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

function TikTokIcon() {
  return (
    <svg
      fill="none"
      width="24"
      height="24"
      viewBox="0 0 32 32"
      version="1.1"
      stroke="rgb(83, 83, 83)"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      xmlns="http://www.w3.org/2000/svg"
      className="lucide lucide-tiktok-icon lucide-tiktok hover:stroke-primary transition-colors duration-200"
    >
      <path d="M16.656 1.029c1.637-0.025 3.262-0.012 4.886-0.025 0.054 2.031 0.878 3.859 2.189 5.213l-0.002-0.002c1.411 1.271 3.247 2.095 5.271 2.235l0.028 0.002v5.036c-1.912-0.048-3.71-0.489-5.331-1.247l0.082 0.034c-0.784-0.377-1.447-0.764-2.077-1.196l0.052 0.034c-0.012 3.649 0.012 7.298-0.025 10.934-0.103 1.853-0.719 3.543-1.707 4.954l0.020-0.031c-1.652 2.366-4.328 3.919-7.371 4.011l-0.014 0c-0.123 0.006-0.268 0.009-0.414 0.009-1.73 0-3.347-0.482-4.725-1.319l0.040 0.023c-2.508-1.509-4.238-4.091-4.558-7.094l-0.004-0.041c-0.025-0.625-0.037-1.25-0.012-1.862 0.49-4.779 4.494-8.476 9.361-8.476 0.547 0 1.083 0.047 1.604 0.136l-0.056-0.008c0.025 1.849-0.050 3.699-0.050 5.548-0.423-0.153-0.911-0.242-1.42-0.242-1.868 0-3.457 1.194-4.045 2.861l-0.009 0.030c-0.133 0.427-0.21 0.918-0.21 1.426 0 0.206 0.013 0.41 0.037 0.61l-0.002-0.024c0.332 2.046 2.086 3.59 4.201 3.59 0.061 0 0.121-0.001 0.181-0.004l-0.009 0c1.463-0.044 2.733-0.831 3.451-1.994l0.010-0.018c0.267-0.372 0.45-0.822 0.511-1.311l0.001-0.014c0.125-2.237 0.075-4.461 0.087-6.698 0.012-5.036-0.012-10.060 0.025-15.083z"></path>
    </svg>
  );
}
