import React from 'react';

export default function RadarChart({ data = [], size = 250 }) {
  const cx = size / 2;
  const cy = size / 2;
  const maxRadius = size * 0.38;
  const levels = 5;
  const angleStep = (2 * Math.PI) / data.length;

  const getPoint = (index, value) => {
    const angle = angleStep * index - Math.PI / 2;
    const r = (value / 100) * maxRadius;
    return {
      x: cx + r * Math.cos(angle),
      y: cy + r * Math.sin(angle),
    };
  };

  const gridLevels = Array.from({ length: levels }, (_, i) => {
    const r = ((i + 1) / levels) * maxRadius;
    const points = data.map((_, j) => {
      const angle = angleStep * j - Math.PI / 2;
      return `${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`;
    });
    return points.join(' ');
  });

  const dataPoints = data.map((d, i) => getPoint(i, d.value));
  const dataPolygon = dataPoints.map(p => `${p.x},${p.y}`).join(' ');

  const labelPoints = data.map((d, i) => {
    const angle = angleStep * i - Math.PI / 2;
    const r = maxRadius + 20;
    return {
      x: cx + r * Math.cos(angle),
      y: cy + r * Math.sin(angle),
      label: d.label,
    };
  });

  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Grid levels */}
        {gridLevels.map((points, i) => (
          <polygon
            key={i}
            points={points}
            fill="none"
            stroke="var(--border-default)"
            strokeWidth="1"
            opacity={0.5}
          />
        ))}

        {/* Axis lines */}
        {data.map((_, i) => {
          const angle = angleStep * i - Math.PI / 2;
          const x2 = cx + maxRadius * Math.cos(angle);
          const y2 = cy + maxRadius * Math.sin(angle);
          return (
            <line
              key={i}
              x1={cx} y1={cy}
              x2={x2} y2={y2}
              stroke="var(--border-subtle)"
              strokeWidth="1"
            />
          );
        })}

        {/* Data polygon */}
        <polygon
          points={dataPolygon}
          fill="rgba(99, 102, 241, 0.15)"
          stroke="var(--accent-indigo)"
          strokeWidth="2"
        />

        {/* Data points */}
        {dataPoints.map((p, i) => (
          <circle
            key={i}
            cx={p.x}
            cy={p.y}
            r={4}
            fill="var(--accent-indigo)"
            stroke="var(--bg-surface)"
            strokeWidth="2"
          />
        ))}

        {/* Labels */}
        {labelPoints.map((p, i) => (
          <text
            key={i}
            x={p.x}
            y={p.y}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="var(--text-tertiary)"
            fontSize="10"
            fontFamily="var(--font-sans)"
            fontWeight="500"
          >
            {p.label}
          </text>
        ))}
      </svg>
    </div>
  );
}
