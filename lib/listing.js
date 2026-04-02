export function normalizeSearchParamValue(value) {
  if (Array.isArray(value)) {
    return value[0];
  }

  return value;
}

export function normalizePage(value, fallback = 1) {
  const rawValue = normalizeSearchParamValue(value);
  const parsedValue = Number.parseInt(rawValue, 10);

  if (!Number.isFinite(parsedValue) || parsedValue < 1) {
    return fallback;
  }

  return parsedValue;
}

export function normalizePageSize(
  value,
  { fallback = 20, max = 100 } = {},
) {
  const rawValue = normalizeSearchParamValue(value);
  const parsedValue = Number.parseInt(rawValue, 10);

  if (!Number.isFinite(parsedValue) || parsedValue < 1) {
    return fallback;
  }

  return Math.min(parsedValue, max);
}

export function normalizeSearchTerm(value) {
  const rawValue = normalizeSearchParamValue(value);

  if (typeof rawValue !== "string") {
    return "";
  }

  return rawValue.trim().replace(/\s+/g, " ");
}

export function sanitizePostgrestSearchTerm(value) {
  return normalizeSearchTerm(value)
    .replace(/[%,_()]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function getPaginationRange(page, pageSize) {
  const from = (page - 1) * pageSize;

  return {
    from,
    to: from + pageSize - 1,
  };
}

export function getTotalPages(totalCount, pageSize) {
  if (!totalCount || totalCount < 1) {
    return 1;
  }

  return Math.ceil(totalCount / pageSize);
}
