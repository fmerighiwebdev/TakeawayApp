"use client";

import { useEffect, useState } from "react";
import { getCookie, setCookie } from "@/lib/cookies";

export default function CookieBanner({ slug }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = getCookie(`cookieConsent-${slug}`);
    if (!consent) setVisible(true);
  }, []);

  if (!visible) return null;

  return (
    <>
      <div className="fixed  bottom-0 sm:bottom-5 left-1/2 -translate-x-1/2 bg-white z-999 p-4 shadow-lg rounded-lg w-full max-w-md flex flex-col gap-4">
        <p className="text-sm md:text-base">
          Utilizziamo solo cookie tecnici necessari al corretto funzionamento
          dell’app. Non utilizziamo cookie di profilazione o tracciamento.
        </p>

        <div className="flex items-center gap-2 justify-center">
          <button
            className="text-sm md:text-base cursor-pointer bg-primary px-4 py-1 w-30 rounded-md shadow-lg text-primary-foreground"
            onClick={() => {
              setCookie(`cookieConsent-${slug}`, "rejected"); 
              setVisible(false);
            }}
          >
            Rifiuta
          </button>

          <button
            className="text-sm md:text-base cursor-pointer bg-primary px-4 py-1 w-30 rounded-md shadow-lg text-primary-foreground"
            onClick={() => {
              setCookie(`cookieConsent-${slug}`, "accepted");
              setVisible(false);
            }}
          >
            Accetta
          </button>
        </div>
      </div>
    </>
  );
}
