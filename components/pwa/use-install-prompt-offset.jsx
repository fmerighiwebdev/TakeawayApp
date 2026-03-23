"use client";

import { useEffect } from "react";

const CSS_VAR_NAME = "--install-prompt-offset";

export function setInstallPromptOffset(value) {
  if (typeof document === "undefined") return;
  document.documentElement.style.setProperty(CSS_VAR_NAME, value);
}

export function resetInstallPromptOffset() {
  if (typeof document === "undefined") return;
  document.documentElement.style.setProperty(CSS_VAR_NAME, "0px");
}

export function useInstallPromptOffset(active, ref, extraGap = 16) {
  useEffect(() => {
    if (!active || !ref.current) {
      resetInstallPromptOffset();
      return;
    }

    const node = ref.current;

    const updateOffset = () => {
      const height = Math.ceil(node.getBoundingClientRect().height);
      setInstallPromptOffset(`${height + extraGap}px`);
    };

    updateOffset();

    const observer = new ResizeObserver(() => {
      updateOffset();
    });

    observer.observe(node);

    return () => {
      observer.disconnect();
      resetInstallPromptOffset();
    };
  }, [active, ref, extraGap]);
}