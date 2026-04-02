import { normalizeCartItem } from "./cart.js";

export const CART_SESSION_STORAGE_KEY = "takeaway-cart";
const CART_SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 30;

function normalizeHostName(hostname) {
  return String(hostname ?? "localhost").split(":")[0];
}

function parseStoredCartValue(value) {
  if (!value) {
    return [];
  }

  let decodedValue = value;

  try {
    decodedValue = decodeURIComponent(value);
  } catch {
    decodedValue = value;
  }

  try {
    const parsed = JSON.parse(decodedValue);

    if (Array.isArray(parsed?.state?.cart)) {
      return parsed.state.cart.map((item) => normalizeCartItem(item));
    }

    if (Array.isArray(parsed?.cart)) {
      return parsed.cart.map((item) => normalizeCartItem(item));
    }

    if (Array.isArray(parsed)) {
      return parsed.map((item) => normalizeCartItem(item));
    }
  } catch {
    return [];
  }

  return [];
}

function readCookieValue(name) {
  if (typeof document === "undefined") {
    return null;
  }

  const entries = document.cookie
    .split(";")
    .map((entry) => entry.trim())
    .filter(Boolean);

  for (const entry of entries) {
    const separatorIndex = entry.indexOf("=");

    if (separatorIndex === -1) {
      continue;
    }

    const entryName = entry.slice(0, separatorIndex);

    if (entryName === name) {
      return entry.slice(separatorIndex + 1);
    }
  }

  return null;
}

function getLegacyCartStorageKey() {
  const hostname =
    typeof window !== "undefined"
      ? window.location.hostname
      : "default";

  return `cart-storage-${hostname}`;
}

function getLegacyCartCountCookieName() {
  if (typeof window === "undefined") {
    return null;
  }

  return `cart-count-${normalizeHostName(window.location.host)}`;
}

export function createCartSessionStorage() {
  return {
    getItem(name) {
      const value = readCookieValue(name);

      if (!value) {
        return null;
      }

      try {
        return decodeURIComponent(value);
      } catch {
        return value;
      }
    },
    setItem(name, value) {
      if (typeof document === "undefined") {
        return;
      }

      document.cookie = `${name}=${encodeURIComponent(
        value,
      )}; path=/; max-age=${CART_SESSION_MAX_AGE_SECONDS}; SameSite=Lax`;
    },
    removeItem(name) {
      if (typeof document === "undefined") {
        return;
      }

      document.cookie = `${name}=; path=/; max-age=0; SameSite=Lax`;
    },
  };
}

export function getCartFromCookieStore(cookieStore) {
  return parseStoredCartValue(cookieStore.get(CART_SESSION_STORAGE_KEY)?.value);
}

export function hasCartSession(cookieStore) {
  return getCartFromCookieStore(cookieStore).length > 0;
}

export function hasLegacyCartCountCookie(cookieStore, hostname) {
  const normalizedHostname = normalizeHostName(hostname);
  return (
    Number(
      cookieStore.get(`cart-count-${normalizedHostname}`)?.value,
    ) || 0
  ) > 0;
}

export function readLegacyCartFromLocalStorage() {
  if (typeof window === "undefined") {
    return [];
  }

  return parseStoredCartValue(
    window.localStorage.getItem(getLegacyCartStorageKey()),
  );
}

export function removeLegacyCartFromLocalStorage() {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(getLegacyCartStorageKey());
}

export function clearLegacyCartCountCookie() {
  if (typeof document === "undefined") {
    return;
  }

  const legacyCartCountCookieName = getLegacyCartCountCookieName();

  if (!legacyCartCountCookieName) {
    return;
  }

  document.cookie = `${legacyCartCountCookieName}=; path=/; max-age=0; SameSite=Lax`;
}
