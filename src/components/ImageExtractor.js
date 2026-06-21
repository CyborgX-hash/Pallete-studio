'use client';

import { useState, useRef, useCallback } from 'react';
import { extractColorsFromImage } from '@/utils/imageAnalysis';

export default function ImageExtractor({ onExtract }) {
  const [isDragging, setIsDragging] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [extracting, setExtracting] = useState(false);
  const [colorCount, setColorCount] = useState(6);
  const fileInputRef = useRef(null);

  const processImage = useCallback(
    (file) => {
      if (!file || !file.type.startsWith('image/')) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
        setExtracting(true);

        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
          const colors = extractColorsFromImage(img, colorCount);
          onExtract(colors);
          setExtracting(false);
        };
        img.onerror = () => {
          setExtracting(false);
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    },
    [colorCount, onExtract]
  );

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    processImage(file);
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) processImage(file);
  };

  const handleReExtract = () => {
    if (!imagePreview) return;
    setExtracting(true);
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const colors = extractColorsFromImage(img, colorCount);
      onExtract(colors);
      setExtracting(false);
    };
    img.src = imagePreview;
  };

  return (
    <div className="image-extractor">
      <div
        className={`drop-zone ${isDragging ? 'dragging' : ''} ${imagePreview ? 'has-image' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        id="image-drop-zone"
      >
        {imagePreview ? (
          <div className="image-preview-container">
            <img
              src={imagePreview}
              alt="Uploaded preview"
              className="image-preview"
            />
            {extracting && (
              <div className="extracting-overlay">
                <div className="extracting-spinner" />
                <span>Extracting colors...</span>
              </div>
            )}
          </div>
        ) : (
          <div className="drop-zone-content">
            <div className="drop-zone-icon">🖼️</div>
            <p className="drop-zone-text">
              Drop an image here or <span className="drop-zone-link">browse</span>
            </p>
            <p className="drop-zone-hint">PNG, JPG, WEBP — up to 10MB</p>
          </div>
        )}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          accept="image/*"
          className="hidden-input"
          id="image-file-input"
        />
      </div>

      <div className="extractor-controls">
        <div className="color-count-control">
          <label htmlFor="color-count-slider" className="control-label">
            Colors to extract
          </label>
          <div className="slider-group">
            <input
              type="range"
              id="color-count-slider"
              min="3"
              max="10"
              value={colorCount}
              onChange={(e) => setColorCount(Number(e.target.value))}
              className="color-count-slider"
            />
            <span className="slider-value">{colorCount}</span>
          </div>
        </div>
        {imagePreview && (
          <button
            className="re-extract-btn"
            onClick={handleReExtract}
            disabled={extracting}
            id="re-extract-btn"
          >
            {extracting ? 'Extracting...' : '↻ Re-extract'}
          </button>
        )}
      </div>
    </div>
  );
}
