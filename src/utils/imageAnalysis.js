// ============================================================
// Image Color Extraction — Median Cut Algorithm
// ============================================================

/**
 * Extract dominant colors from an image using the Median Cut algorithm.
 * Runs entirely client-side using Canvas.
 *
 * @param {HTMLImageElement} img - The loaded image element
 * @param {number} colorCount - Number of colors to extract (default 5)
 * @returns {string[]} Array of HEX color strings
 */
export function extractColorsFromImage(img, colorCount = 5) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  // Scale down for performance — we don't need full resolution
  const maxDim = 200;
  const scale = Math.min(maxDim / img.width, maxDim / img.height, 1);
  canvas.width = Math.floor(img.width * scale);
  canvas.height = Math.floor(img.height * scale);

  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const pixels = imageData.data;

  // Convert pixel data to array of [R, G, B]
  const pixelArray = [];
  for (let i = 0; i < pixels.length; i += 4) {
    const r = pixels[i];
    const g = pixels[i + 1];
    const b = pixels[i + 2];
    const a = pixels[i + 3];

    // Skip transparent or near-transparent pixels
    if (a < 125) continue;
    // Skip very white or very black pixels (usually backgrounds)
    if (r > 250 && g > 250 && b > 250) continue;
    if (r < 5 && g < 5 && b < 5) continue;

    pixelArray.push([r, g, b]);
  }

  if (pixelArray.length === 0) {
    // Fallback if image is all white/black/transparent
    return ['#333333', '#666666', '#999999', '#CCCCCC', '#EEEEEE'].slice(
      0,
      colorCount
    );
  }

  // Run median cut
  const palette = medianCut(pixelArray, colorCount);

  // Convert to HEX and sort by luminance
  return palette
    .map(([r, g, b]) => rgbToHexLocal(r, g, b))
    .sort((a, b) => luminance(a) - luminance(b));
}

/**
 * Median Cut Algorithm
 * Recursively splits the color space into buckets
 */
function medianCut(pixels, depth) {
  if (depth <= 1 || pixels.length === 0) {
    return [averageColor(pixels)];
  }

  // Find the channel with the widest range
  const ranges = [0, 1, 2].map((ch) => {
    const values = pixels.map((p) => p[ch]);
    return Math.max(...values) - Math.min(...values);
  });

  const splitChannel = ranges.indexOf(Math.max(...ranges));

  // Sort pixels by the widest-range channel
  pixels.sort((a, b) => a[splitChannel] - b[splitChannel]);

  const mid = Math.floor(pixels.length / 2);
  const left = pixels.slice(0, mid);
  const right = pixels.slice(mid);

  // Recurse
  const leftCount = Math.ceil(depth / 2);
  const rightCount = depth - leftCount;

  return [
    ...medianCut(left, leftCount),
    ...medianCut(right, rightCount),
  ];
}

/**
 * Compute the average color of a bucket of pixels
 */
function averageColor(pixels) {
  if (pixels.length === 0) return [128, 128, 128];

  let rSum = 0,
    gSum = 0,
    bSum = 0;
  for (const [r, g, b] of pixels) {
    rSum += r;
    gSum += g;
    bSum += b;
  }
  const count = pixels.length;
  return [
    Math.round(rSum / count),
    Math.round(gSum / count),
    Math.round(bSum / count),
  ];
}

/**
 * Convert RGB to HEX (local helper to avoid circular imports)
 */
function rgbToHexLocal(r, g, b) {
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
 * Simple luminance for sorting
 */
function luminance(hex) {
  const h = hex.replace('#', '');
  const r = parseInt(h.substring(0, 2), 16);
  const g = parseInt(h.substring(2, 4), 16);
  const b = parseInt(h.substring(4, 6), 16);
  return 0.299 * r + 0.587 * g + 0.114 * b;
}
