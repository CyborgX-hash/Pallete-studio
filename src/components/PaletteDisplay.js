'use client';

import { useState } from 'react';
import { getTextColor, formatRgb, formatHsl } from '@/utils/colorUtils';

export default function PaletteDisplay({ colors, title }) {
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [colorFormat, setColorFormat] = useState('hex'); // hex | rgb | hsl

  const getFormattedColor = (hex) => {
    switch (colorFormat) {
      case 'rgb':
        return formatRgb(hex);
      case 'hsl':
        return formatHsl(hex);
      default:
        return hex;
    }
  };

  const handleCopy = async (hex, index) => {
    const formatted = getFormattedColor(hex);
    try {
      await navigator.clipboard.writeText(formatted);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 1500);
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement('textarea');
      textarea.value = formatted;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 1500);
    }
  };

  if (!colors || colors.length === 0) return null;

  return (
    <div className="palette-display">
      <div className="palette-header">
        {title && <h3 className="palette-title">{title}</h3>}
        <div className="format-toggle">
          {['hex', 'rgb', 'hsl'].map((fmt) => (
            <button
              key={fmt}
              id={`format-${fmt}`}
              className={`format-btn ${colorFormat === fmt ? 'active' : ''}`}
              onClick={() => setColorFormat(fmt)}
            >
              {fmt.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div className="palette-colors">
        {colors.map((color, i) => (
          <button
            key={`${color}-${i}`}
            className="palette-swatch"
            style={{
              backgroundColor: color,
              color: getTextColor(color),
              animationDelay: `${i * 0.08}s`,
            }}
            onClick={() => handleCopy(color, i)}
            title={`Click to copy ${getFormattedColor(color)}`}
            id={`swatch-${i}`}
          >
            <span className="swatch-label">
              {copiedIndex === i ? '✓ Copied!' : getFormattedColor(color)}
            </span>
            <span className="swatch-copy-icon">
              {copiedIndex === i ? '✓' : '⎘'}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
