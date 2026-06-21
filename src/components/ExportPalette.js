'use client';

import { useState } from 'react';
import { getTextColor } from '@/utils/colorUtils';

export default function ExportPalette({ colors }) {
  const [exportCopied, setExportCopied] = useState(null);

  if (!colors || colors.length === 0) return null;

  const copyToClipboard = async (text, type) => {
    try {
      await navigator.clipboard.writeText(text);
      setExportCopied(type);
      setTimeout(() => setExportCopied(null), 2000);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setExportCopied(type);
      setTimeout(() => setExportCopied(null), 2000);
    }
  };

  const exportAsCssVars = () => {
    const css = `:root {\n${colors
      .map((c, i) => `  --color-${i + 1}: ${c};`)
      .join('\n')}\n}`;
    copyToClipboard(css, 'css');
  };

  const exportAsTailwind = () => {
    const config = `// tailwind.config.js\nmodule.exports = {\n  theme: {\n    extend: {\n      colors: {\n        palette: {\n${colors
      .map((c, i) => `          ${(i + 1) * 100}: '${c}',`)
      .join('\n')}\n        },\n      },\n    },\n  },\n};`;
    copyToClipboard(config, 'tailwind');
  };

  const exportAsArray = () => {
    const arr = `const palette = [\n${colors
      .map((c) => `  '${c}',`)
      .join('\n')}\n];`;
    copyToClipboard(arr, 'array');
  };

  const exportAsPng = () => {
    const canvas = document.createElement('canvas');
    const swatchWidth = 160;
    const swatchHeight = 200;
    const padding = 40;
    const totalWidth = colors.length * swatchWidth + padding * 2;
    const totalHeight = swatchHeight + padding * 2 + 50;

    canvas.width = totalWidth;
    canvas.height = totalHeight;
    const ctx = canvas.getContext('2d');

    // Background
    ctx.fillStyle = '#1A1A2E';
    ctx.fillRect(0, 0, totalWidth, totalHeight);

    // Title
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 18px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Color Palette', totalWidth / 2, padding - 10);

    // Swatches
    colors.forEach((color, i) => {
      const x = padding + i * swatchWidth;
      const y = padding + 10;

      // Rounded rect
      const radius = 12;
      ctx.beginPath();
      ctx.roundRect(x + 4, y, swatchWidth - 8, swatchHeight, radius);
      ctx.fillStyle = color;
      ctx.fill();

      // Color label
      ctx.fillStyle = getTextColor(color);
      ctx.font = '14px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(color, x + swatchWidth / 2, y + swatchHeight - 16);
    });

    // Download
    const link = document.createElement('a');
    link.download = 'palette.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <div className="export-palette">
      <h3 className="export-title">📦 Export Palette</h3>
      <div className="export-buttons">
        <button
          className="export-btn"
          onClick={exportAsPng}
          id="export-png-btn"
        >
          <span className="export-icon">🖼️</span>
          <span>Download PNG</span>
        </button>
        <button
          className={`export-btn ${exportCopied === 'css' ? 'copied' : ''}`}
          onClick={exportAsCssVars}
          id="export-css-btn"
        >
          <span className="export-icon">🎨</span>
          <span>{exportCopied === 'css' ? '✓ Copied!' : 'CSS Variables'}</span>
        </button>
        <button
          className={`export-btn ${exportCopied === 'tailwind' ? 'copied' : ''}`}
          onClick={exportAsTailwind}
          id="export-tailwind-btn"
        >
          <span className="export-icon">💨</span>
          <span>
            {exportCopied === 'tailwind' ? '✓ Copied!' : 'Tailwind Config'}
          </span>
        </button>
        <button
          className={`export-btn ${exportCopied === 'array' ? 'copied' : ''}`}
          onClick={exportAsArray}
          id="export-array-btn"
        >
          <span className="export-icon">{ }</span>
          <span>{exportCopied === 'array' ? '✓ Copied!' : 'JS Array'}</span>
        </button>
      </div>
    </div>
  );
}
