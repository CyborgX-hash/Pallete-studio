'use client';

import { useState, useCallback } from 'react';
import { generateHarmony, randomColor } from '@/utils/colorUtils';
import ColorPicker from '@/components/ColorPicker';
import HarmonySelector from '@/components/HarmonySelector';
import PaletteDisplay from '@/components/PaletteDisplay';
import ImageExtractor from '@/components/ImageExtractor';
import ContrastChecker from '@/components/ContrastChecker';
import ExportPalette from '@/components/ExportPalette';
import TrendingPalettes from '@/components/TrendingPalettes';
import ThemeToggle from '@/components/ThemeToggle';
import Footer from '@/components/Footer';

export default function Home() {
  const [activeTab, setActiveTab] = useState('generate');
  const [baseColor, setBaseColor] = useState('#3B82F6');
  const [harmonyType, setHarmonyType] = useState('analogous');
  const [palette, setPalette] = useState(() =>
    generateHarmony('#3B82F6', 'analogous')
  );

  const handleColorChange = useCallback(
    (color) => {
      setBaseColor(color);
      if (activeTab === 'generate') {
        setPalette(generateHarmony(color, harmonyType));
      }
    },
    [activeTab, harmonyType]
  );

  const handleHarmonyChange = useCallback(
    (type) => {
      setHarmonyType(type);
      setPalette(generateHarmony(baseColor, type));
    },
    [baseColor]
  );

  const handleImageExtract = useCallback((colors) => {
    setPalette(colors);
  }, []);

  const handleTrendingSelect = useCallback((colors) => {
    setPalette(colors);
  }, []);

  const tabs = [
    { id: 'generate', label: '🎨 Generate', desc: 'From Base Color' },
    { id: 'extract', label: '🖼️ Extract', desc: 'From Image' },
    { id: 'trending', label: '🔥 Trending', desc: 'Popular Palettes' },
  ];

  return (
    <div className="app-wrapper">
      {/* Animated background blobs */}
      <div className="bg-blobs" aria-hidden="true">
        <div className="blob blob-1" />
        <div className="blob blob-2" />
        <div className="blob blob-3" />
      </div>

      {/* Header */}
      <header className="app-header">
        <div className="header-content">
          <div className="logo-group">
            <div className="logo-icon" aria-hidden="true">
              <span className="logo-spectrum">
                <span style={{ background: '#FF6B6B' }} />
                <span style={{ background: '#FFA07A' }} />
                <span style={{ background: '#FFD93D' }} />
                <span style={{ background: '#6BCB77' }} />
                <span style={{ background: '#4D96FF' }} />
                <span style={{ background: '#9D8CFF' }} />
              </span>
            </div>
            <div>
              <h1 className="app-title">Palette Studio</h1>
              <p className="app-subtitle">
                Create beautiful color palettes in seconds
              </p>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="app-main">
        {/* Tab Navigation */}
        <nav className="tab-nav" role="tablist" aria-label="Palette mode">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              role="tab"
              id={`tab-${tab.id}`}
              aria-selected={activeTab === tab.id}
              className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="tab-icon">{tab.label}</span>
              <span className="tab-desc">{tab.desc}</span>
            </button>
          ))}
        </nav>

        {/* Tab Content */}
        <div className="tab-content">
          {/* Generate Tab */}
          {activeTab === 'generate' && (
            <section className="tab-panel fade-in" id="panel-generate">
              <div className="generate-controls">
                <ColorPicker
                  color={baseColor}
                  onChange={handleColorChange}
                />
                <HarmonySelector
                  selected={harmonyType}
                  onChange={handleHarmonyChange}
                />
              </div>
            </section>
          )}

          {/* Extract Tab */}
          {activeTab === 'extract' && (
            <section className="tab-panel fade-in" id="panel-extract">
              <ImageExtractor onExtract={handleImageExtract} />
            </section>
          )}

          {/* Trending Tab */}
          {activeTab === 'trending' && (
            <section className="tab-panel fade-in" id="panel-trending">
              <TrendingPalettes onSelect={handleTrendingSelect} />
            </section>
          )}
        </div>

        {/* Palette Output — always visible */}
        {palette && palette.length > 0 && (
          <div className="palette-output fade-in">
            <PaletteDisplay
              colors={palette}
              title="Your Palette"
            />

            <div className="palette-tools">
              <ContrastChecker colors={palette} />
              <ExportPalette colors={palette} />
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
