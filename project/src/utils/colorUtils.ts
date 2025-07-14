/**
 * Color conversion utilities for the custom color picker
 */

export interface HSLColor {
  h: number; // 0-360
  s: number; // 0-100
  l: number; // 0-100
}

export interface RGBColor {
  r: number; // 0-255
  g: number; // 0-255
  b: number; // 0-255
}

export interface HSVColor {
  h: number; // 0-360
  s: number; // 0-100
  v: number; // 0-100
}

/**
 * Convert HSL to RGB
 */
export function hslToRgb(h: number, s: number, l: number): RGBColor {
  h = h / 360;
  s = s / 100;
  l = l / 100;

  const hue2rgb = (p: number, q: number, t: number) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1/6) return p + (q - p) * 6 * t;
    if (t < 1/2) return q;
    if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
    return p;
  };

  if (s === 0) {
    return { r: l * 255, g: l * 255, b: l * 255 };
  }

  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;

  const r = hue2rgb(p, q, h + 1/3);
  const g = hue2rgb(p, q, h);
  const b = hue2rgb(p, q, h - 1/3);

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255)
  };
}

/**
 * Convert RGB to HSL
 */
export function rgbToHsl(r: number, g: number, b: number): HSLColor {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max === min) {
    h = s = 0; // achromatic
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100)
  };
}

/**
 * Convert HSV to RGB
 */
export function hsvToRgb(h: number, s: number, v: number): RGBColor {
  h = h / 360;
  s = s / 100;
  v = v / 100;

  const i = Math.floor(h * 6);
  const f = h * 6 - i;
  const p = v * (1 - s);
  const q = v * (1 - f * s);
  const t = v * (1 - (1 - f) * s);

  let r: number, g: number, b: number;

  switch (i % 6) {
    case 0: r = v; g = t; b = p; break;
    case 1: r = q; g = v; b = p; break;
    case 2: r = p; g = v; b = t; break;
    case 3: r = p; g = q; b = v; break;
    case 4: r = t; g = p; b = v; break;
    case 5: r = v; g = p; b = q; break;
    default: r = 0; g = 0; b = 0;
  }

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255)
  };
}

/**
 * Convert RGB to HSV
 */
export function rgbToHsv(r: number, g: number, b: number): HSVColor {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  const v = max;
  const s = max === 0 ? 0 : (max - min) / max;

  if (max === min) {
    h = 0; // achromatic
  } else {
    const d = max - min;
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    v: Math.round(v * 100)
  };
}

/**
 * Convert RGB to HEX
 */
export function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (n: number) => {
    const hex = Math.round(Math.max(0, Math.min(255, n))).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };
  
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

/**
 * Convert HEX to RGB
 */
export function hexToRgb(hex: string): RGBColor | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

/**
 * Convert HEX to HSL
 */
export function hexToHsl(hex: string): HSLColor | null {
  const rgb = hexToRgb(hex);
  return rgb ? rgbToHsl(rgb.r, rgb.g, rgb.b) : null;
}

/**
 * Convert HSL to HEX
 */
export function hslToHex(h: number, s: number, l: number): string {
  const rgb = hslToRgb(h, s, l);
  return rgbToHex(rgb.r, rgb.g, rgb.b);
}

/**
 * Get contrasting text color (black or white) for a given background color
 */
export function getContrastingTextColor(hex: string): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return '#000000';
  
  // Calculate luminance
  const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;
  
  // Return black for light backgrounds, white for dark backgrounds
  return luminance > 0.5 ? '#000000' : '#ffffff';
}

/**
 * Generate a color palette from a primary color
 */
export function generatePalette(primaryHex: string) {
  const hsl = hexToHsl(primaryHex);
  if (!hsl) return null;

  const { h, s, l } = hsl;

  // Generate variations
  const accent = hslToHex(h, Math.max(20, s - 20), Math.min(80, l + 10));
  const secondary = hslToHex(h, Math.max(30, s - 10), Math.max(20, l - 20));
  const background = hslToHex(h, Math.max(5, s - 70), Math.min(98, l + 40));
  const card = '#ffffff';
  const text = '#2c3e50';
  const textLight = '#6c757d';
  const border = hslToHex(h, Math.max(10, s - 60), Math.min(93, l + 30));
  
  // Generate gradient
  const gradientColor1 = primaryHex;
  const gradientColor2 = secondary;
  const gradient = `linear-gradient(135deg, ${gradientColor1} 0%, ${gradientColor2} 100%)`;

  return {
    primary: primaryHex,
    secondary,
    accent,
    background,
    card,
    text,
    textLight,
    border,
    gradient
  };
}

/**
 * Validate hex color format
 */
export function isValidHex(hex: string): boolean {
  return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(hex);
}

/**
 * Lighten a color by a percentage
 */
export function lightenColor(hex: string, percent: number): string {
  const hsl = hexToHsl(hex);
  if (!hsl) return hex;
  
  const newL = Math.min(100, hsl.l + percent);
  return hslToHex(hsl.h, hsl.s, newL);
}

/**
 * Darken a color by a percentage
 */
export function darkenColor(hex: string, percent: number): string {
  const hsl = hexToHsl(hex);
  if (!hsl) return hex;
  
  const newL = Math.max(0, hsl.l - percent);
  return hslToHex(hsl.h, hsl.s, newL);
}

/**
 * Get complementary color
 */
export function getComplementaryColor(hex: string): string {
  const hsl = hexToHsl(hex);
  if (!hsl) return hex;
  
  const complementaryH = (hsl.h + 180) % 360;
  return hslToHex(complementaryH, hsl.s, hsl.l);
}

/**
 * Get analogous colors
 */
export function getAnalogousColors(hex: string): string[] {
  const hsl = hexToHsl(hex);
  if (!hsl) return [hex];
  
  const color1 = hslToHex((hsl.h + 30) % 360, hsl.s, hsl.l);
  const color2 = hslToHex((hsl.h - 30 + 360) % 360, hsl.s, hsl.l);
  
  return [color1, hex, color2];
}

/**
 * Get triadic colors
 */
export function getTriadicColors(hex: string): string[] {
  const hsl = hexToHsl(hex);
  if (!hsl) return [hex];
  
  const color1 = hslToHex((hsl.h + 120) % 360, hsl.s, hsl.l);
  const color2 = hslToHex((hsl.h + 240) % 360, hsl.s, hsl.l);
  
  return [hex, color1, color2];
}