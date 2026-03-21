"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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
  const isIOS = /iPhone|iPad|iPod/i.test(ua) ||
    (window.navigator.platform === "MacIntel" &&
      window.navigator.maxTouchPoints > 1);

  if (!isIOS) return false;

  const isSafari = /Safari/i.test(ua) &&
    !/CriOS|FxiOS|EdgiOS|OPiOS/i.test(ua);

  return isSafari;
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
    <Dialog open={open} onOpenChange={(next) => !next && dismiss()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Installa l'app</DialogTitle>
          <DialogDescription>
            {ios
              ? "Aggiungi l'app alla schermata Home per aprirla più rapidamente."
              : "Installa l'app sul dispositivo per un accesso più veloce."}
          </DialogDescription>
        </DialogHeader>

        {ios ? (
          <div className="space-y-2 text-sm text-muted-foreground">
            {iosSafari ? (
              <>
                <p>1. Tocca il pulsante Condividi in Safari.</p>
                <p>2. Seleziona “Aggiungi a Home”.</p>
                <p>3. Conferma il nome e completa l’aggiunta.</p>
              </>
            ) : (
              <p>
                Su iPhone/iPad l’installazione va fatta da Safari. Apri questa
                pagina in Safari e poi usa Condividi → Aggiungi a Home.
              </p>
            )}
          </div>
        ) : null}

        <DialogFooter>
          <Button variant="ghost" onClick={dismiss}>
            Non ora
          </Button>

          {!ios ? (
            <Button onClick={install}>
              Installa
            </Button>
          ) : null}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}