// ============================================================
// Color Conversion Utilities
// ============================================================

/**
 * Parse a HEX color string to RGB object
 * Supports #RGB and #RRGGBB formats
 */
export function hexToRgb(hex) {
  let h = hex.replace('#', '');
  if (h.length === 3) {
    h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
  }
  const num = parseInt(h, 16);
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

/**
 * Convert RGB object to HEX string
 */
export function rgbToHex(r, g, b) {
  return (
    '#' +
    [r, g, b]
      .map((x) => {
        const hex = Math.round(Math.max(0, Math.min(255, x))).toString(16);
        return hex.length === 1 ? '0' + hex : hex;
      })
      .join('')
  ).toUpperCase();
}

/**
 * Convert RGB to HSL
 * Returns { h: 0-360, s: 0-100, l: 0-100 }
 */
export function rgbToHsl(r, g, b) {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h,
    s,
    l = (max + min) / 2;

  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

/**
 * Convert HSL to RGB
 */
export function hslToRgb(h, s, l) {
  h /= 360;
  s /= 100;
  l /= 100;

  let r, g, b;

  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255),
  };
}

/**
 * Convert HEX to HSL
 */
export function hexToHsl(hex) {
  const { r, g, b } = hexToRgb(hex);
  return rgbToHsl(r, g, b);
}

/**
 * Convert HSL to HEX
 */
export function hslToHex(h, s, l) {
  const { r, g, b } = hslToRgb(h, s, l);
  return rgbToHex(r, g, b);
}

// ============================================================
// Color Format Strings
// ============================================================

export function formatRgb(hex) {
  const { r, g, b } = hexToRgb(hex);
  return `rgb(${r}, ${g}, ${b})`;
}

export function formatHsl(hex) {
  const { h, s, l } = hexToHsl(hex);
  return `hsl(${h}, ${s}%, ${l}%)`;
}

// ============================================================
// Color Harmony Generation
// ============================================================

function rotateHue(h, degrees) {
  return ((h + degrees) % 360 + 360) % 360;
}

/**
 * Generate complementary palette (opposite on color wheel)
 */
export function complementary(hex) {
  const { h, s, l } = hexToHsl(hex);
  return [hex, hslToHex(rotateHue(h, 180), s, l)];
}

/**
 * Generate analogous palette (adjacent colors)
 */
export function analogous(hex) {
  const { h, s, l } = hexToHsl(hex);
  return [
    hslToHex(rotateHue(h, -30), s, l),
    hex,
    hslToHex(rotateHue(h, 30), s, l),
    hslToHex(rotateHue(h, 60), s, l),
  ];
}

/**
 * Generate triadic palette (3 equidistant colors)
 */
export function triadic(hex) {
  const { h, s, l } = hexToHsl(hex);
  return [
    hex,
    hslToHex(rotateHue(h, 120), s, l),
    hslToHex(rotateHue(h, 240), s, l),
  ];
}

/**
 * Generate tetradic/square palette (4 equidistant colors)
 */
export function tetradic(hex) {
  const { h, s, l } = hexToHsl(hex);
  return [
    hex,
    hslToHex(rotateHue(h, 90), s, l),
    hslToHex(rotateHue(h, 180), s, l),
    hslToHex(rotateHue(h, 270), s, l),
  ];
}

/**
 * Generate split-complementary palette
 */
export function splitComplementary(hex) {
  const { h, s, l } = hexToHsl(hex);
  return [
    hex,
    hslToHex(rotateHue(h, 150), s, l),
    hslToHex(rotateHue(h, 210), s, l),
  ];
}

/**
 * Generate monochromatic palette (varying lightness)
 */
export function monochromatic(hex) {
  const { h, s, l } = hexToHsl(hex);
  const steps = [15, 30, 45, 60, 75, 85];
  return steps.map((lightness) => hslToHex(h, s, lightness));
}

/**
 * Generate palette based on harmony type
 */
export function generateHarmony(hex, type) {
  switch (type) {
    case 'complementary':
      return complementary(hex);
    case 'analogous':
      return analogous(hex);
    case 'triadic':
      return triadic(hex);
    case 'tetradic':
      return tetradic(hex);
    case 'split-complementary':
      return splitComplementary(hex);
    case 'monochromatic':
      return monochromatic(hex);
    default:
      return complementary(hex);
  }
}

// ============================================================
// WCAG Contrast Ratio
// ============================================================

/**
 * Calculate relative luminance of a color
 * per WCAG 2.1 specification
 */
export function relativeLuminance(hex) {
  const { r, g, b } = hexToRgb(hex);
  const [rs, gs, bs] = [r, g, b].map((c) => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

/**
 * Calculate contrast ratio between two colors
 * Returns a value between 1 and 21
 */
export function contrastRatio(hex1, hex2) {
  const l1 = relativeLuminance(hex1);
  const l2 = relativeLuminance(hex2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Check WCAG compliance levels
 */
export function wcagCompliance(hex1, hex2) {
  const ratio = contrastRatio(hex1, hex2);
  return {
    ratio: Math.round(ratio * 100) / 100,
    AA_normal: ratio >= 4.5,
    AA_large: ratio >= 3,
    AAA_normal: ratio >= 7,
    AAA_large: ratio >= 4.5,
  };
}

// ============================================================
// Color Brightness / Utilities
// ============================================================

/**
 * Determine if a color is light or dark
 */
export function isLightColor(hex) {
  const { r, g, b } = hexToRgb(hex);
  // YIQ formula
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 128;
}

/**
 * Get a readable text color (black or white) for a given background
 */
export function getTextColor(bgHex) {
  return isLightColor(bgHex) ? '#1A1A2E' : '#FFFFFF';
}

/**
 * Generate a random pleasing color
 */
export function randomColor() {
  const h = Math.floor(Math.random() * 360);
  const s = 50 + Math.floor(Math.random() * 40); // 50-90
  const l = 40 + Math.floor(Math.random() * 30); // 40-70
  return hslToHex(h, s, l);
}

/**
 * Generate a random palette of N colors
 */
export function randomPalette(count = 5) {
  const baseHue = Math.floor(Math.random() * 360);
  const spread = 30 + Math.floor(Math.random() * 60);
  const colors = [];
  for (let i = 0; i < count; i++) {
    const h = (baseHue + i * spread) % 360;
    const s = 55 + Math.floor(Math.random() * 30);
    const l = 35 + Math.floor(Math.random() * 35);
    colors.push(hslToHex(h, s, l));
  }
  return colors;
}

// ============================================================
// Curated Trending Palettes
// ============================================================

export const trendingPalettes = [
  {
    name: 'Sunset Vibes',
    colors: ['#FF6B6B', '#FFA07A', '#FFD93D', '#6BCB77', '#4D96FF'],
  },
  {
    name: 'Ocean Breeze',
    colors: ['#0F3460', '#16537E', '#1A759F', '#34A0A4', '#76C893'],
  },
  {
    name: 'Berry Smoothie',
    colors: ['#6B2D5B', '#A13670', '#D63384', '#E685B5', '#F0B5CE'],
  },
  {
    name: 'Midnight Galaxy',
    colors: ['#0D1B2A', '#1B2838', '#2D4059', '#6A5ACD', '#9D8CFF'],
  },
  {
    name: 'Forest Moss',
    colors: ['#1B4332', '#2D6A4F', '#40916C', '#52B788', '#95D5B2'],
  },
  {
    name: 'Candy Pop',
    colors: ['#FF69B4', '#FF85CB', '#A855F7', '#7C3AED', '#4F46E5'],
  },
  {
    name: 'Warm Earth',
    colors: ['#8B4513', '#A0522D', '#CD853F', '#DEB887', '#F5DEB3'],
  },
  {
    name: 'Cyberpunk',
    colors: ['#0D0221', '#0F084B', '#26408B', '#A6CFD5', '#C2E7D9'],
  },
  {
    name: 'Peach Garden',
    colors: ['#FFDAB9', '#FFB7A5', '#FF8C94', '#E06377', '#C83E4D'],
  },
  {
    name: 'Arctic Aurora',
    colors: ['#00B4D8', '#0096C7', '#023E8A', '#6930C3', '#7400B8'],
  },
  {
    name: 'Golden Hour',
    colors: ['#F9C74F', '#F8961E', '#F3722C', '#F94144', '#90BE6D'],
  },
  {
    name: 'Lavender Dream',
    colors: ['#E0C3FC', '#C9B1FF', '#B8A9C9', '#8E6CA8', '#6C4F82'],
  },
];
