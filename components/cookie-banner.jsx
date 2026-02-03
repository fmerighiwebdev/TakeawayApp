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
      <div className="fixed bottom-5 left-5 bg-white z-999 p-4 shadow-lg rounded-lg w-full max-w-sm flex flex-col gap-4">
        <p>
          Utilizziamo solo cookie tecnici necessari al corretto funzionamento
          dell’app. Non utilizziamo cookie di profilazione o tracciamento.
        </p>

        <div className="flex items-center gap-2">
          <button
            className="bg-primary px-4 py-1 w-30 rounded-md shadow-lg text-primary-foreground"
            onClick={() => {
              setCookie(`cookieConsent-${slug}`, "rejected");
              setVisible(false);
            }}
          >
            Rifiuta
          </button>

          <button
            className="bg-primary px-4 py-1 w-30 rounded-md shadow-lg text-primary-foreground"
            onClick={() => {
              setCookie("cookieConsent", "accepted");
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
