"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

const DISMISS_KEY = "pwa-install-dismissed-at";
const ACCEPTED_KEY = "pwa-install-accepted";
const DISMISS_TTL = 1000 * 60 * 60 * 24 * 7;
const DELAY_MS = 20000;

function isStandalone() {
  if (typeof window === "undefined") return false;
  if (window.matchMedia("(display-mode: standalone)").matches) return true;
  return Boolean(window.navigator.standalone);
}

function isIOS() {
  if (typeof window === "undefined") return false;

  const ua = window.navigator.userAgent;
  const touchMac =
    window.navigator.platform === "MacIntel" &&
    window.navigator.maxTouchPoints > 1;

  return /iPhone|iPad|iPod/i.test(ua) || touchMac;
}

function isIOSSafari() {
  if (typeof window === "undefined") return false;

  const ua = window.navigator.userAgent;
  const ios =
    /iPhone|iPad|iPod/i.test(ua) ||
    (window.navigator.platform === "MacIntel" &&
      window.navigator.maxTouchPoints > 1);

  if (!ios) return false;

  return /Safari/i.test(ua) && !/CriOS|FxiOS|EdgiOS|OPiOS/i.test(ua);
}

export default function InstallPrompt() {
  const [open, setOpen] = useState(false);
  const [delayElapsed, setDelayElapsed] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    if (isStandalone()) {
      setIsInstalled(true);
      return;
    }

    const accepted = localStorage.getItem(ACCEPTED_KEY) === "1";
    if (accepted) {
      setIsInstalled(true);
      return;
    }

    const dismissedAt = Number(localStorage.getItem(DISMISS_KEY) || 0);
    if (dismissedAt && Date.now() - dismissedAt < DISMISS_TTL) {
      return;
    }

    const timer = window.setTimeout(() => {
      setDelayElapsed(true);
    }, DELAY_MS);

    const onBeforeInstallPrompt = (event) => {
      event.preventDefault();
      setDeferredPrompt(event);
    };

    const onAppInstalled = () => {
      localStorage.setItem(ACCEPTED_KEY, "1");
      setIsInstalled(true);
      setOpen(false);
      setDeferredPrompt(null);
    };

    window.addEventListener("beforeinstallprompt", onBeforeInstallPrompt);
    window.addEventListener("appinstalled", onAppInstalled);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("beforeinstallprompt", onBeforeInstallPrompt);
      window.removeEventListener("appinstalled", onAppInstalled);
    };
  }, []);

  useEffect(() => {
    if (isInstalled || !delayElapsed) return;

    if (isIOS()) {
      setOpen(true);
      return;
    }

    if (deferredPrompt) {
      setOpen(true);
    }
  }, [delayElapsed, deferredPrompt, isInstalled]);

  function dismiss() {
    localStorage.setItem(DISMISS_KEY, String(Date.now()));
    setOpen(false);
  }

  async function install() {
    if (!deferredPrompt) return;

    const result = await deferredPrompt.prompt();

    if (result?.outcome === "accepted") {
      localStorage.setItem(ACCEPTED_KEY, "1");
      setIsInstalled(true);
    }

    setDeferredPrompt(null);
    setOpen(false);
  }

  if (!open || isInstalled) return null;

  const ios = isIOS();
  const iosSafari = isIOSSafari();

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-4 z-50 px-4">
      <div className="pointer-events-auto mx-auto w-full max-w-md rounded-2xl border bg-background p-4 shadow-xl">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <h3 className="text-sm font-semibold">Installa l&apos;app</h3>
            <p className="text-sm text-muted-foreground">
              {ios
                ? "Aggiungi l'app alla schermata Home per aprirla più rapidamente."
                : "Installa l'app sul dispositivo per un accesso più veloce."}
            </p>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 shrink-0"
            onClick={dismiss}
            aria-label="Chiudi suggerimento installazione"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {ios ? (
          <div className="mt-3 space-y-1 text-sm text-muted-foreground">
            {iosSafari ? (
              <>
                <p>1. Tocca Condividi in Safari.</p>
                <p>2. Seleziona “Aggiungi a Home”.</p>
                <p>3. Conferma per completare.</p>
              </>
            ) : (
              <p>
                Su iPhone/iPad l’aggiunta alla Home va fatta da Safari. Apri
                questa pagina in Safari e usa Condividi → Aggiungi a Home.
              </p>
            )}
          </div>
        ) : null}

        <div className="mt-4 flex items-center justify-end gap-2">
          <Button variant="ghost" onClick={dismiss}>
            Non ora
          </Button>

          {!ios ? (
            <Button onClick={install}>
              Installa
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  );
}