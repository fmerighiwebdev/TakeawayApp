"use client";

import { useCallback, useState, useEffect } from "react";
import styles from "./add-to-home.module.css"; // Assuming you have this CSS module
import Image from "next/image"; // Assuming you've added this for your SVG
import shareIcon from "@/assets/share-icon.svg"; // Assuming this is the correct path to your SVG

export default function AddToHomeScreenPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isIOSDevice, setIsIOSDevice] = useState(false); // State to specifically track if the OS is iOS

  // Function to check if the OS is iOS (does not check for PWA mode)
  const runningOnIOS = () => {
    if (typeof navigator === "undefined") return false; // Guard for SSR or non-browser environments
    return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
  };

  // Event listener for beforeinstallprompt (for non-iOS, non-standalone)
  const handleBeforeInstallPrompt = useCallback((event) => {
    event.preventDefault();
    setDeferredPrompt(event);
    // Additional check to ensure we are not in standalone mode when this event fires
    if (
      !window.matchMedia("(display-mode: standalone)").matches &&
      !window.navigator.standalone
    ) {
      setIsVisible(true);
    }
  }, []);

  useEffect(() => {
    // --- Standalone Check (works for all OS including iOS) ---
    // This is the primaryColor check to see if the app is already running as an installed PWA.
    const isCurrentlyStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      window.navigator.standalone;

    // Log the results of the standalone check for debugging. This is crucial.
    console.log("Standalone Check:", {
      isStandalone: isCurrentlyStandalone,
      displayModeStandalone: window.matchMedia("(display-mode: standalone)")
        .matches,
      navigatorStandalone: window.navigator.standalone, // This should be true for installed iOS PWAs
    });

    // If running standalone, ensure the prompt is hidden and do nothing further in this effect.
    if (isCurrentlyStandalone) {
      setIsVisible(false);
      return; // Exit early, don't add listeners or show prompts
    }

    // --- If NOT Standalone ---
    // Determine if the current OS is iOS
    const currentOSIsIOS = runningOnIOS();
    setIsIOSDevice(currentOSIsIOS); // Set state for conditional rendering & cleanup

    if (currentOSIsIOS) {
      // On an iOS device (and not standalone), show the informational banner
      setIsVisible(true);
    } else {
      // On a non-iOS device (and not standalone), add the listener for the install prompt
      window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    }

    // Cleanup function
    return () => {
      // Only remove listener if it was potentially added (i.e., not iOS)
      if (!currentOSIsIOS) {
        // Use the value determined in this effect's closure
        window.removeEventListener(
          "beforeinstallprompt",
          handleBeforeInstallPrompt
        );
      }
    };
    // Rerun effect if the install prompt handler changes (it shouldn't due to useCallback)
  }, [handleBeforeInstallPrompt]);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      return;
    }
    setIsVisible(false);
    deferredPrompt.prompt();
    try {
      await deferredPrompt.userChoice;
      // Outcome can be 'accepted' or 'dismissed'
    } catch (error) {
      console.error("Error showing install prompt:", error);
    }
    setDeferredPrompt(null); // Prompt can only be used once
  };

  const handleDismissClick = () => {
    setIsVisible(false);
    // For non-iOS, if you want the prompt to potentially reappear later this session
    // (if beforeinstallprompt fires again for some reason), don't nullify deferredPrompt.
    // However, typically, dismissing means the user isn't interested for now.
    // setDeferredPrompt(null); // Optional: clear the prompt
  };

  // Don't render anything if the prompt should not be visible
  if (!isVisible) {
    return null;
  }

  // Render iOS-specific instructions if on an iOS device (and not standalone)
  if (isIOSDevice) {
    return (
      <div className={styles.addToHomeScreenPrompt}>
        <p className={styles.promptHeading}>
          Installa l&apos;app sul tuo dispositivo!
        </p>
        <p className={styles.promptInstructions}>
          Tocca l&apos;icona &quot;Condividi&quot;{" "}
          <Image
            src={shareIcon}
            alt="Icona Condividi iOS"
            style={{ verticalAlign: "middle", margin: "0 0.2em" }}
            width={20}
            height={16}
          />{" "}
          (o Opzioni) e poi &quot;Aggiungi a Home&quot;.
        </p>
        <div className={styles.promptActions}>
          <button
            onClick={handleDismissClick}
            // Consider a more generic class if styles.installApp is too specific
            className={`${styles.iosButton} ${styles.installApp}`} // Example: use existing or new styles
          >
            OK
          </button>
        </div>
      </div>
    );
  }

  // Render standard install prompt for non-iOS devices (and not standalone)
  return (
    <div className={styles.addToHomeScreenPrompt}>
      <p className={styles.promptHeading}>Installa la nostra applicazione!</p>
      <div className={styles.promptActions}>
        <button onClick={handleInstallClick} className={styles.installApp}>
          INSTALLA
        </button>
        <button onClick={handleDismissClick} className={styles.dismissInstall}>
          Versione Web
        </button>
      </div>
    </div>
  );
}
