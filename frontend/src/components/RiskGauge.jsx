import React from 'react';
import { ShieldAlert, ShieldCheck, AlertTriangle } from 'lucide-react';
import { getRiskInfo } from './RiskBadge';

const RiskGauge = ({ score = 0, level = 'Low' }) => {
  const numScore = Math.max(0, Math.min(1, Number(score) || 0));
  const percentage = Math.round(numScore * 100);
  const info = getRiskInfo(numScore, level);

  const getStatusIcon = () => {
    if (info.level === 'High') return <ShieldAlert className="w-6 h-6 text-rose-600" />;
    if (info.level === 'Medium') return <AlertTriangle className="w-6 h-6 text-amber-600" />;
    return <ShieldCheck className="w-6 h-6 text-emerald-600" />;
  };

  const getBarColor = () => {
    if (info.level === 'High') return 'bg-rose-500';
    if (info.level === 'Medium') return 'bg-amber-500';
    return 'bg-emerald-500';
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          {getStatusIcon()}
          <div>
            <h4 className="text-sm font-semibold text-slate-800">Attrition Risk Prediction</h4>
            <p className="text-xs text-slate-500">XGBoost Classification Model (84% test accuracy)</p>
          </div>
        </div>
        <div className="text-right">
          <span className="text-xs uppercase tracking-wider font-semibold text-slate-400 block">Status</span>
          <span className={`text-sm font-bold ${
            info.level === 'High' ? 'text-rose-600' : info.level === 'Medium' ? 'text-amber-600' : 'text-emerald-600'
          }`}>
            {info.level} Risk
          </span>
        </div>
      </div>

      {/* Main Score Display */}
      <div className="flex items-baseline gap-2 my-2">
        <span className="text-5xl font-extrabold tracking-tight text-slate-900 font-mono">
          {percentage}%
        </span>
        <span className="text-sm font-medium text-slate-500">estimated flight probability</span>
      </div>

      {/* Segmented Risk Progress Bar */}
      <div className="mt-4 space-y-1.5">
        <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200">
          <div
            className={`h-full rounded-full transition-all duration-700 ease-out ${getBarColor()}`}
            style={{ width: `${Math.max(percentage, 4)}%` }}
          />
        </div>

        {/* Threshold Markers */}
        <div className="flex justify-between text-[11px] font-medium text-slate-400 px-0.5 pt-1">
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
            0% Low
          </span>
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 inline-block" />
            40% Medium
          </span>
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 inline-block" />
            70% High
          </span>
          <span>100%</span>
        </div>
      </div>
    </div>
  );
};

export default RiskGauge;
