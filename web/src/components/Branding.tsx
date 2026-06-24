// 太极图标 - 五行主题Logo
import React from 'react';

export function TaijiLogo({ size = 32, className = '' }: { size?: number; className?: string }) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} className={className}>
      <defs>
        <radialGradient id="logo-bg" cx="50%" cy="50%">
          <stop offset="0%" stopColor="#1A4D5C" />
          <stop offset="100%" stopColor="#0A2026" />
        </radialGradient>
      </defs>
      <circle cx="50" cy="50" r="48" fill="url(#logo-bg)" stroke="#D4A84B" strokeWidth="1.5" />
      <path d="M 50 8 A 42 42 0 0 1 50 92 A 21 21 0 0 1 50 50 A 21 21 0 0 0 50 8 Z" fill="#F5F1E8" />
      <circle cx="50" cy="29" r="6" fill="#1A4D5C" />
      <circle cx="50" cy="71" r="6" fill="#C8553D" />
    </svg>
  );
}

export function WuxingIcon({ element, size = 24 }: { element: string; size?: number }) {
  const colors: Record<string, string> = {
    木: '#5A8E4A', 火: '#C8553D', 土: '#D4A84B', 金: '#C9B87A', 水: '#3A6E7C',
  };
  const paths: Record<string, string> = {
    木: 'M50 10 L50 50 M50 30 L30 50 M50 30 L70 50 M50 50 L25 80 M50 50 L75 80',
    火: 'M50 10 Q70 30 70 50 Q70 75 50 90 Q30 75 30 50 Q30 30 50 10 Z M50 10 L50 25',
    土: 'M20 35 L80 35 L70 75 L30 75 Z M40 25 L60 25 L65 35 L35 35 Z',
    金: 'M30 25 L70 25 L65 35 L35 35 Z M30 75 L70 75 L65 65 L35 65 Z M50 30 L50 70 M40 50 L60 50',
    水: 'M15 50 Q35 30 50 50 Q65 70 85 50 M15 70 Q35 50 50 70 Q65 90 85 70',
  };
  return (
    <svg viewBox="0 0 100 100" width={size} height={size}>
      <circle cx="50" cy="50" r="46" fill={colors[element]} fillOpacity="0.12" />
      <path d={paths[element]} stroke={colors[element]} strokeWidth="6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function BaguaWheel({ size = 200, className = '' }: { size?: number; className?: string }) {
  const trigrams = [
    { name: '乾', lines: [1, 1, 1] },
    { name: '兑', lines: [1, 1, 0] },
    { name: '离', lines: [1, 0, 1] },
    { name: '震', lines: [1, 0, 0] },
    { name: '巽', lines: [0, 1, 1] },
    { name: '坎', lines: [0, 1, 0] },
    { name: '艮', lines: [0, 0, 1] },
    { name: '坤', lines: [0, 0, 0] },
  ];
  return (
    <div className={className} style={{ width: size, height: size }}>
      <svg viewBox="0 0 200 200" className="bagua-spin">
        <circle cx="100" cy="100" r="95" fill="none" stroke="#D4A84B" strokeWidth="1.5" opacity="0.5" />
        <circle cx="100" cy="100" r="80" fill="none" stroke="#1A4D5C" strokeWidth="1" opacity="0.3" />
        {trigrams.map((t, i) => {
          const angle = (i * 45 - 90) * (Math.PI / 180);
          const x = 100 + 70 * Math.cos(angle);
          const y = 100 + 70 * Math.sin(angle);
          return (
            <g key={i} transform={`translate(${x - 15}, ${y - 15})`}>
              <rect width="30" height="30" fill="#F5F1E8" opacity="0.1" />
              {t.lines.map((line, j) => (
                <line
                  key={j}
                  x1={4}
                  y1={6 + j * 8}
                  x2={26}
                  y2={6 + j * 8}
                  stroke={line ? '#1A4D5C' : '#1A4D5C'}
                  strokeWidth="3"
                  strokeDasharray={line ? 'none' : '8 6'}
                />
              ))}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
