function clamp01(x) {
  return Math.min(1, Math.max(0, x));
}

function parseHexColor(input) {
  const hex = input.replace("#", "").trim();

  if (hex.length === 3) {
    const r = Number.parseInt(hex[0] + hex[0], 16);
    const g = Number.parseInt(hex[1] + hex[1], 16);
    const b = Number.parseInt(hex[2] + hex[2], 16);
    if ([r, g, b].some(Number.isNaN)) return null;
    return { r, g, b };
  }

  if (hex.length === 6) {
    const r = Number.parseInt(hex.slice(0, 2), 16);
    const g = Number.parseInt(hex.slice(2, 4), 16);
    const b = Number.parseInt(hex.slice(4, 6), 16);
    if ([r, g, b].some(Number.isNaN)) return null;
    return { r, g, b };
  }

  return null;
}

function parseRgbColor(input) {
  const m = input.trim().match(/^rgba?\((.+)\)$/i);
  if (!m) return null;

  const parts = m[1]
    .split(",")
    .map((p) => p.trim())
    .slice(0, 3);

  if (parts.length !== 3) return null;

  const [r, g, b] = parts.map((v) => Number.parseFloat(v));
  if ([r, g, b].some((n) => Number.isNaN(n))) return null;

  return { r, g, b };
}

function parseColorToRgb(input) {
  if (!input) return null;
  const s = input.trim();

  if (s.startsWith("#")) return parseHexColor(s);
  if (s.toLowerCase().startsWith("rgb")) return parseRgbColor(s);

  return null;
}

// WCAG: converti sRGB -> linear
function srgbToLinear(c) {
  const v = c / 255;
  return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
}

function relativeLuminance({ r, g, b }) {
  const R = srgbToLinear(r);
  const G = srgbToLinear(g);
  const B = srgbToLinear(b);
  return 0.2126 * R + 0.7152 * G + 0.0722 * B;
}

function contrastRatio(l1, l2) {
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Restituisce "#000000" o "#FFFFFF" scegliendo quello con contrasto maggiore.
 * Target: 4.5:1 per testo normale (WCAG AA).
 * Se il colore non è parsabile, fallback a nero.
 */
export function getAccessibleTextColor(bgColor) {
  const rgb = parseColorToRgb(bgColor);
  if (!rgb) return "#000000";

  const Lbg = relativeLuminance(rgb);
  const Lwhite = 1; // luminanza bianco
  const Lblack = 0; // luminanza nero

  const contrastWithWhite = contrastRatio(Lbg, Lwhite);
  const contrastWithBlack = contrastRatio(Lbg, Lblack);

  return contrastWithBlack >= contrastWithWhite ? "#000000" : "#FFFFFF";
}