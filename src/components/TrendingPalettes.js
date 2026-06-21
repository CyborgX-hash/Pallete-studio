'use client';

import { useState } from 'react';
import {
  trendingPalettes,
  randomPalette,
  getTextColor,
} from '@/utils/colorUtils';

export default function TrendingPalettes({ onSelect }) {
  const [animatingIndex, setAnimatingIndex] = useState(null);

  const handleSelect = (colors, index) => {
    setAnimatingIndex(index);
    onSelect(colors);
    setTimeout(() => setAnimatingIndex(null), 400);
  };

  const handleRandom = () => {
    const palette = randomPalette(5);
    onSelect(palette);
  };

  return (
    <div className="trending-palettes">
      <div className="trending-header">
        <p className="trending-subtitle">
          Click any palette to use it, or generate a random one
        </p>
        <button
          className="random-palette-btn"
          onClick={handleRandom}
          id="random-palette-btn"
        >
          <span className="random-dice">🎲</span>
          Random Palette
        </button>
      </div>

      <div className="trending-grid">
        {trendingPalettes.map((palette, i) => (
          <button
            key={palette.name}
            className={`trending-card ${animatingIndex === i ? 'selected-anim' : ''}`}
            onClick={() => handleSelect(palette.colors, i)}
            id={`trending-${i}`}
          >
            <div className="trending-swatches">
              {palette.colors.map((color, j) => (
                <div
                  key={j}
                  className="trending-swatch"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
            <span className="trending-name">{palette.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
