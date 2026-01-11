import React from 'react';

export default function StatsCard({ icon, title, value, subtitle, children }) {
  return (
    <div className="glass p-4 rounded-xl flex items-start gap-3">
      <div className="shrink-0 w-10 h-10 rounded-lg bg-white/5 grid place-items-center border border-white/10">
        {icon}
      </div>
      <div className="flex-1">
        <div className="text-sm text-gray-400">{title}</div>
        <div className="text-2xl font-semibold text-white">{value}</div>
        {subtitle && <div className="text-xs text-gray-400 mt-0.5">{subtitle}</div>}
        {children}
      </div>
    </div>
  );
}
