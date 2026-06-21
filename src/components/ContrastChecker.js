'use client';

import { useState } from 'react';
import { wcagCompliance, getTextColor } from '@/utils/colorUtils';

export default function ContrastChecker({ colors }) {
  const [fg, setFg] = useState(0);
  const [bg, setBg] = useState(colors.length > 1 ? 1 : 0);

  if (!colors || colors.length < 2) return null;

  const fgColor = colors[fg] || colors[0];
  const bgColor = colors[bg] || colors[1];
  const compliance = wcagCompliance(fgColor, bgColor);

  return (
    <div className="contrast-checker">
      <h3 className="contrast-title">♿ Accessibility Checker</h3>

      <div className="contrast-selectors">
        <div className="contrast-selector">
          <label className="contrast-label">Foreground</label>
          <div className="contrast-color-options">
            {colors.map((c, i) => (
              <button
                key={`fg-${i}`}
                className={`contrast-color-btn ${fg === i ? 'selected' : ''}`}
                style={{ backgroundColor: c }}
                onClick={() => setFg(i)}
                title={c}
                id={`contrast-fg-${i}`}
              />
            ))}
          </div>
        </div>
        <div className="contrast-selector">
          <label className="contrast-label">Background</label>
          <div className="contrast-color-options">
            {colors.map((c, i) => (
              <button
                key={`bg-${i}`}
                className={`contrast-color-btn ${bg === i ? 'selected' : ''}`}
                style={{ backgroundColor: c }}
                onClick={() => setBg(i)}
                title={c}
                id={`contrast-bg-${i}`}
              />
            ))}
          </div>
        </div>
      </div>

      <div
        className="contrast-preview"
        style={{ backgroundColor: bgColor, color: fgColor }}
      >
        <span className="preview-sample-large">Sample Text</span>
        <span className="preview-sample-small">
          The quick brown fox jumps over the lazy dog
        </span>
      </div>

      <div className="contrast-results">
        <div className="contrast-ratio-display">
          <span className="ratio-number">{compliance.ratio}:1</span>
          <span className="ratio-label">Contrast Ratio</span>
        </div>
        <div className="wcag-badges">
          <div
            className={`wcag-badge ${compliance.AA_normal ? 'pass' : 'fail'}`}
          >
            <span className="badge-level">AA</span>
            <span className="badge-size">Normal</span>
            <span className="badge-status">
              {compliance.AA_normal ? '✓' : '✗'}
            </span>
          </div>
          <div
            className={`wcag-badge ${compliance.AA_large ? 'pass' : 'fail'}`}
          >
            <span className="badge-level">AA</span>
            <span className="badge-size">Large</span>
            <span className="badge-status">
              {compliance.AA_large ? '✓' : '✗'}
            </span>
          </div>
          <div
            className={`wcag-badge ${compliance.AAA_normal ? 'pass' : 'fail'}`}
          >
            <span className="badge-level">AAA</span>
            <span className="badge-size">Normal</span>
            <span className="badge-status">
              {compliance.AAA_normal ? '✓' : '✗'}
            </span>
          </div>
          <div
            className={`wcag-badge ${compliance.AAA_large ? 'pass' : 'fail'}`}
          >
            <span className="badge-level">AAA</span>
            <span className="badge-size">Large</span>
            <span className="badge-status">
              {compliance.AAA_large ? '✓' : '✗'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
