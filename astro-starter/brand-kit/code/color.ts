// Color theory helpers shared by tools (duotone derivation, HSL conversions).
// Pure functions so they stay testable and reusable by future layer components.

// Returns [hue (0-360), saturation (0-1), lightness (0-1)]
export function hexToHsl(hex: string): [number, number, number] {
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  const fullHex = hex.replace(shorthandRegex, (_, r, g, b) => r + r + g + g + b + b);
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(fullHex);
  if (!result) return [0, 0, 0];

  const r = parseInt(result[1], 16) / 255;
  const g = parseInt(result[2], 16) / 255;
  const b = parseInt(result[3], 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;

  if (max === min) return [0, 0, l];

  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

  let h: number;
  if (max === r) h = (g - b) / d + (g < b ? 6 : 0);
  else if (max === g) h = (b - r) / d + 2;
  else h = (r - g) / d + 4;

  return [h * 60, s, l];
}

export function hslToHex(h: number, s: number, l: number): string {
  const hue = (((h % 360) + 360) % 360) / 360;

  const hue2rgb = (p: number, q: number, t: number) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };

  let r: number, g: number, b: number;
  if (s === 0) {
    r = g = b = l;
  } else {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, hue + 1 / 3);
    g = hue2rgb(p, q, hue);
    b = hue2rgb(p, q, hue - 1 / 3);
  }

  const toHexByte = (x: number) =>
    Math.round(Math.min(1, Math.max(0, x)) * 255)
      .toString(16)
      .padStart(2, '0');

  return `#${toHexByte(r)}${toHexByte(g)}${toHexByte(b)}`;
}

// Duotone gradient map derivation, locked to the reference brand pairing:
// gradient #B9C3FE/#0137FF (blue ~229°) maps to #69EAED/#042D2E (cyan 181°).
// Rule: shift the gradient's mean hue -48° (analogous neighbor), then build a
// monochromatic duotone: a light tint stop and a near-black shadow stop.
export const HUE_SHIFT = -48;
export const LIGHT_SATURATION = 0.79;
export const LIGHT_LIGHTNESS = 0.67;
export const DARK_SATURATION = 0.84;
export const DARK_LIGHTNESS = 0.1;

export function deriveDuotone(
  color1: string,
  color2: string,
  avgLuminance: number = 0.5
): { light: string; dark: string } {
  const [h1, s1] = hexToHsl(color1);
  const [h2, s2] = hexToHsl(color2);

  // Dynamic lightness adjustments based on image's average luminance
  const d = avgLuminance - 0.5;
  let lightL = LIGHT_LIGHTNESS;
  let darkL = DARK_LIGHTNESS;

  if (d < 0) {
    // Dark image: stretch highlights lighter (up to 0.90), and shadows slightly lighter (up to 0.20) to avoid crushing
    lightL = Math.max(LIGHT_LIGHTNESS, Math.min(0.90, LIGHT_LIGHTNESS - d * 0.40));
    darkL = Math.max(0.05, Math.min(0.20, DARK_LIGHTNESS - d * 0.10));
  } else {
    // Bright image: stretch shadows darker (down to 0.02), and highlights slightly darker (down to 0.50) to retain detail
    lightL = Math.max(0.50, Math.min(LIGHT_LIGHTNESS, LIGHT_LIGHTNESS - d * 0.20));
    darkL = Math.max(0.02, Math.min(DARK_LIGHTNESS, DARK_LIGHTNESS - d * 0.20));
  }

  // Near-grayscale gradients have no meaningful hue; fall back to a neutral map
  if (Math.max(s1, s2) < 0.05) {
    return {
      light: hslToHex(0, 0, lightL),
      dark: hslToHex(0, 0, darkL),
    };
  }

  // Circular mean of the two hues, weighted by saturation so a gray stop
  // cannot drag the derived hue toward 0° (red)
  const rad = Math.PI / 180;
  const x = Math.cos(h1 * rad) * s1 + Math.cos(h2 * rad) * s2;
  const y = Math.sin(h1 * rad) * s1 + Math.sin(h2 * rad) * s2;
  const meanHue = Math.atan2(y, x) / rad;

  const mapHue = meanHue + HUE_SHIFT;
  return {
    light: hslToHex(mapHue, LIGHT_SATURATION, lightL),
    dark: hslToHex(mapHue, DARK_SATURATION, darkL),
  };
}
