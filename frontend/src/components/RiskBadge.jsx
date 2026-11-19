import React from 'react';

/**
 * Risk level thresholds according to backend:
 * Low: score < 0.4
 * Medium: 0.4 <= score < 0.7
 * High: score >= 0.7
 */
export const getRiskInfo = (score, level) => {
  // If score is provided, use it; otherwise normalize level
  if (score !== undefined && score !== null) {
    const num = Number(score);
    if (num >= 0.7) return { level: 'High', color: 'bg-rose-50 text-rose-700 border-rose-200 ring-rose-500/20', dot: 'bg-rose-500' };
    if (num >= 0.4) return { level: 'Medium', color: 'bg-amber-50 text-amber-700 border-amber-200 ring-amber-500/20', dot: 'bg-amber-500' };
    return { level: 'Low', color: 'bg-emerald-50 text-emerald-700 border-emerald-200 ring-emerald-500/20', dot: 'bg-emerald-500' };
  }

  const norm = String(level || '').toLowerCase();
  if (norm === 'high') {
    return { level: 'High', color: 'bg-rose-50 text-rose-700 border-rose-200 ring-rose-500/20', dot: 'bg-rose-500' };
  }
  if (norm === 'medium') {
    return { level: 'Medium', color: 'bg-amber-50 text-amber-700 border-amber-200 ring-amber-500/20', dot: 'bg-amber-500' };
  }
  return { level: 'Low', color: 'bg-emerald-50 text-emerald-700 border-emerald-200 ring-emerald-500/20', dot: 'bg-emerald-500' };
};

const RiskBadge = ({ score, level, showScore = false, size = 'sm' }) => {
  const info = getRiskInfo(score, level);
  const displayScore = score !== undefined && score !== null ? `${Math.round(score * 100)}%` : null;

  const sizeClasses = {
    xs: 'px-2 py-0.5 text-xs',
    sm: 'px-2.5 py-1 text-xs font-semibold',
    md: 'px-3 py-1.5 text-sm font-semibold',
    lg: 'px-4 py-2 text-base font-bold',
  }[size] || 'px-2.5 py-1 text-xs font-semibold';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border ring-1 transition-all ${info.color} ${sizeClasses}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${info.dot} animate-pulse`} />
      <span>{info.level} Risk</span>
      {showScore && displayScore && (
        <span className="opacity-75 font-mono text-[11px]">({displayScore})</span>
      )}
    </span>
  );
};

export default RiskBadge;
