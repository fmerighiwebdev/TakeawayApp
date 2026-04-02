import supabaseServer from "../supabase/supabaseServer";

function parsePositiveInteger(value, fallbackValue) {
  const parsedValue = Number(value);

  if (!Number.isFinite(parsedValue) || parsedValue <= 0) {
    return fallbackValue;
  }

  return Math.floor(parsedValue);
}

// Best-effort per-instance cache for host-to-tenant resolution.
const TENANT_RESOLUTION_TTL_MS = parsePositiveInteger(
  process.env.TENANT_RESOLUTION_TTL_MS,
  5 * 60 * 1000,
);
const TENANT_RESOLUTION_NEGATIVE_TTL_MS = parsePositiveInteger(
  process.env.TENANT_RESOLUTION_NEGATIVE_TTL_MS,
  60 * 1000,
);
const TENANT_RESOLUTION_CACHE_MAX_SIZE = parsePositiveInteger(
  process.env.TENANT_RESOLUTION_CACHE_MAX_SIZE,
  500,
);

const tenantHostCache = globalThis.__tenantHostCache || new Map();
const inflightTenantLookups = globalThis.__inflightTenantLookups || new Map();

if (!globalThis.__tenantHostCache) {
  globalThis.__tenantHostCache = tenantHostCache;
}

if (!globalThis.__inflightTenantLookups) {
  globalThis.__inflightTenantLookups = inflightTenantLookups;
}

export function normalizeTenantHost(host) {
  return String(host || "")
    .split(",")[0]
    .trim()
    .toLowerCase()
    .replace(/\.$/, "")
    .split(":")[0];
}

export function isLocalDevelopmentHost(host) {
  const normalizedHost = normalizeTenantHost(host);

  return (
    normalizedHost === "localhost" ||
    normalizedHost === "127.0.0.1" ||
    normalizedHost === "[::1]"
  );
}

function getCachedResolution(normalizedHost) {
  const cachedEntry = tenantHostCache.get(normalizedHost);

  if (!cachedEntry) {
    return null;
  }

  if (cachedEntry.expiresAt <= Date.now()) {
    tenantHostCache.delete(normalizedHost);
    return null;
  }

  return cachedEntry.tenantId;
}

function setCachedResolution(normalizedHost, tenantId) {
  if (tenantHostCache.size >= TENANT_RESOLUTION_CACHE_MAX_SIZE) {
    const oldestCacheKey = tenantHostCache.keys().next().value;

    if (oldestCacheKey) {
      tenantHostCache.delete(oldestCacheKey);
    }
  }

  tenantHostCache.set(normalizedHost, {
    tenantId,
    expiresAt:
      Date.now() +
      (tenantId
        ? TENANT_RESOLUTION_TTL_MS
        : TENANT_RESOLUTION_NEGATIVE_TTL_MS),
  });
}

export async function resolveTenantIdByHost(host) {
  const normalizedHost = normalizeTenantHost(host);

  if (!normalizedHost) {
    return null;
  }

  const cachedTenantId = getCachedResolution(normalizedHost);

  if (cachedTenantId !== null) {
    return cachedTenantId;
  }

  if (tenantHostCache.has(normalizedHost)) {
    return null;
  }

  const existingLookup = inflightTenantLookups.get(normalizedHost);

  if (existingLookup) {
    return existingLookup;
  }

  const lookupPromise = (async () => {
    const { data, error } = await supabaseServer
      .from("tenants")
      .select("id")
      .eq("domain", normalizedHost)
      .maybeSingle();

    if (error) {
      throw new Error(error.message || "Errore nella risoluzione del tenant.");
    }

    const tenantId = data?.id ?? null;
    setCachedResolution(normalizedHost, tenantId);

    return tenantId;
  })();

  inflightTenantLookups.set(normalizedHost, lookupPromise);

  try {
    return await lookupPromise;
  } finally {
    inflightTenantLookups.delete(normalizedHost);
  }
}
