'use client';

export default function HarmonySelector({ selected, onChange }) {
  const harmonies = [
    {
      id: 'complementary',
      label: 'Complementary',
      icon: '◑',
      desc: 'Opposite on wheel',
    },
    {
      id: 'analogous',
      label: 'Analogous',
      icon: '◔',
      desc: 'Adjacent colors',
    },
    {
      id: 'triadic',
      label: 'Triadic',
      icon: '△',
      desc: '3 equidistant',
    },
    {
      id: 'tetradic',
      label: 'Tetradic',
      icon: '◇',
      desc: '4 equidistant',
    },
    {
      id: 'split-complementary',
      label: 'Split Comp.',
      icon: '⑂',
      desc: 'Split opposite',
    },
    {
      id: 'monochromatic',
      label: 'Monochromatic',
      icon: '▥',
      desc: 'Single hue shades',
    },
  ];

  return (
    <div className="harmony-selector">
      <p className="harmony-selector-title">Color Harmony</p>
      <div className="harmony-grid">
        {harmonies.map((h) => (
          <button
            key={h.id}
            id={`harmony-${h.id}`}
            className={`harmony-btn ${selected === h.id ? 'active' : ''}`}
            onClick={() => onChange(h.id)}
            title={h.desc}
          >
            <span className="harmony-icon">{h.icon}</span>
            <span className="harmony-label">{h.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
