import React from 'react';
import { ShieldAlert, ShieldCheck, AlertTriangle } from 'lucide-react';
import { getRiskInfo } from './RiskBadge';

const RiskGauge = ({ score = 0, level = 'Low' }) => {
  const numScore = Math.max(0, Math.min(1, Number(score) || 0));
  const percentage = Math.round(numScore * 100);
  const info = getRiskInfo(numScore, level);

  const getStatusIcon = () => {
    if (info.level === 'High') return <ShieldAlert className="w-6 h-6 text-[#C62828]" />;
    if (info.level === 'Medium') return <AlertTriangle className="w-6 h-6 text-[#D9684C]" />;
    return <ShieldCheck className="w-6 h-6 text-[#2E7D32]" />;
  };

  const getBarColor = () => {
    if (info.level === 'High') return 'bg-[#C62828]';
    if (info.level === 'Medium') return 'bg-[#D9684C]';
    return 'bg-[#2E7D32]';
  };

  return (
    <div className="bg-white rounded-2xl border border-[#DED1C9] p-6 shadow-xs">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          {getStatusIcon()}
          <div>
            <h4 className="text-sm font-heading font-bold text-[#312C29]">Attrition Risk Prediction</h4>
            <p className="text-xs text-[#7A736E]">XGBoost Classification Model (84% test accuracy)</p>
          </div>
        </div>
        <div className="text-right">
          <span className="text-[10px] uppercase tracking-wider font-bold text-[#7A736E] block">Status</span>
          <span className={`text-sm font-bold ${
            info.level === 'High' ? 'text-[#C62828]' : info.level === 'Medium' ? 'text-[#B2553E]' : 'text-[#2E7D32]'
          }`}>
            {info.level} Risk
          </span>
        </div>
      </div>

      {/* Main Score Display */}
      <div className="flex items-baseline gap-2 my-2">
        <span className="text-5xl font-extrabold tracking-tight text-[#312C29] font-mono">
          {percentage}%
        </span>
        <span className="text-xs font-medium text-[#7A736E]">estimated flight probability</span>
      </div>

      {/* Segmented Risk Progress Bar */}
      <div className="mt-4 space-y-1.5">
        <div className="h-3 w-full bg-[#F5E9DF] rounded-full overflow-hidden p-0.5 border border-[#DED1C9]">
          <div
            className={`h-full rounded-full transition-all duration-700 ease-out ${getBarColor()}`}
            style={{ width: `${Math.max(percentage, 4)}%` }}
          />
        </div>

        {/* Threshold Markers */}
        <div className="flex justify-between text-[11px] font-medium text-[#7A736E] px-0.5 pt-1">
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2E7D32] inline-block" />
            0% Low
          </span>
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D9684C] inline-block" />
            40% Medium
          </span>
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C62828] inline-block" />
            70% High
          </span>
          <span>100%</span>
        </div>
      </div>
    </div>
  );
};

export default RiskGauge;
