'use client';

import { useState, useEffect } from 'react';

export default function ThemeToggle() {
  const [dark, setDark] = useState(true);

  useEffect(() => {
    // Check for saved preference or system preference
    const saved = localStorage.getItem('theme');
    if (saved) {
      setDark(saved === 'dark');
    } else {
      setDark(window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute(
      'data-theme',
      dark ? 'dark' : 'light'
    );
    localStorage.setItem('theme', dark ? 'dark' : 'light');
  }, [dark]);

  return (
    <button
      className="theme-toggle"
      onClick={() => setDark(!dark)}
      aria-label={`Switch to ${dark ? 'light' : 'dark'} mode`}
      id="theme-toggle-btn"
      title={`Switch to ${dark ? 'light' : 'dark'} mode`}
    >
      <span className={`theme-icon ${dark ? 'moon' : 'sun'}`}>
        {dark ? '🌙' : '☀️'}
      </span>
    </button>
  );
}
