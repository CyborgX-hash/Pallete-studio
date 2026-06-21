'use client';

import { useState, useEffect } from 'react';

export default function ColorPicker({ color, onChange }) {
  const [inputValue, setInputValue] = useState(color || '#3B82F6');

  useEffect(() => {
    setInputValue(color);
  }, [color]);

  const handleHexInput = (e) => {
    let val = e.target.value;
    if (!val.startsWith('#')) val = '#' + val;
    setInputValue(val);

    // Only trigger onChange for valid hex colors
    const clean = val.replace('#', '');
    if (/^[0-9A-Fa-f]{6}$/.test(clean)) {
      onChange(val.toUpperCase());
    }
  };

  const handleNativeChange = (e) => {
    const val = e.target.value.toUpperCase();
    setInputValue(val);
    onChange(val);
  };

  return (
    <div className="color-picker">
      <div className="color-picker-preview-wrapper">
        <div
          className="color-picker-preview"
          style={{ backgroundColor: color }}
        >
          <input
            type="color"
            id="color-picker-native"
            value={color}
            onChange={handleNativeChange}
            className="color-picker-native"
            aria-label="Choose base color"
          />
        </div>
        <div className="color-picker-sparkle">✦</div>
      </div>
      <div className="color-picker-input-group">
        <label htmlFor="hex-input" className="color-picker-label">
          HEX Color
        </label>
        <input
          type="text"
          id="hex-input"
          value={inputValue}
          onChange={handleHexInput}
          className="color-picker-input"
          placeholder="#3B82F6"
          maxLength={7}
          spellCheck={false}
        />
      </div>
    </div>
  );
}
