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
    if (num >= 0.7) return { level: 'High', color: 'bg-[#FFEBEE] text-[#C62828] border-[#EF9A9A] ring-[#C62828]/20', dot: 'bg-[#C62828]' };
    if (num >= 0.4) return { level: 'Medium', color: 'bg-[#FDEAE5] text-[#B2553E] border-[#D9684C]/40 ring-[#D9684C]/20', dot: 'bg-[#D9684C]' };
    return { level: 'Low', color: 'bg-[#E8F5E9] text-[#2E7D32] border-[#A5D6A7] ring-[#2E7D32]/20', dot: 'bg-[#2E7D32]' };
  }

  const norm = String(level || '').toLowerCase();
  if (norm === 'high') {
    return { level: 'High', color: 'bg-[#FFEBEE] text-[#C62828] border-[#EF9A9A] ring-[#C62828]/20', dot: 'bg-[#C62828]' };
  }
  if (norm === 'medium') {
    return { level: 'Medium', color: 'bg-[#FDEAE5] text-[#B2553E] border-[#D9684C]/40 ring-[#D9684C]/20', dot: 'bg-[#D9684C]' };
  }
  return { level: 'Low', color: 'bg-[#E8F5E9] text-[#2E7D32] border-[#A5D6A7] ring-[#2E7D32]/20', dot: 'bg-[#2E7D32]' };
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
