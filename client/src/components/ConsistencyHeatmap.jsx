import React, { useMemo } from 'react';

// Simple horizontal heatmap like GitHub contributions
// Props:
// - weeks (default 52): number of weeks (columns)
// - getLevel: function(index) => 0..4 for intensity; if not provided, uses a simple pattern
// - size: cell size in tailwind classes (e.g., 'w-3 h-3')
export default function ConsistencyHeatmap({ weeks = 52, getLevel, size = 'w-3 h-3 md:w-4 md:h-4' }) {
  const days = 7; // rows
  const total = weeks * days;

  const levels = useMemo(() => {
    return Array.from({ length: total }, (_, i) => (getLevel ? getLevel(i) : (i % 5)));
  }, [total, getLevel]);

  const shades = [
    'bg-white/10',
    'bg-violet-500/20',
    'bg-violet-500/40',
    'bg-violet-500/60',
    'bg-violet-500/80',
  ];

  return (
    <div className="w-full overflow-x-auto">
      <div className="inline-block">
        <div
          className="grid grid-flow-col gap-1"
          style={{ gridTemplateRows: `repeat(${days}, minmax(0, 1fr))` }}
        >
          {levels.map((lvl, i) => (
            <div key={i} className={`${size} ${shades[lvl]} rounded-sm`} />
          ))}
        </div>
      </div>
    </div>
  );
}
