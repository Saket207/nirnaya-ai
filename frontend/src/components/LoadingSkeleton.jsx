import React from 'react';

export const TableSkeleton = ({ rows = 6, cols = 5 }) => {
  return (
    <div className="w-full bg-white rounded-2xl border border-slate-200/80 p-4 space-y-4 shadow-sm animate-pulse">
      <div className="h-10 bg-slate-100 rounded-xl w-1/3 mb-6" />
      <div className="space-y-3">
        {Array.from({ length: rows }).map((_, rIdx) => (
          <div key={rIdx} className="flex gap-4 items-center">
            {Array.from({ length: cols }).map((_, cIdx) => (
              <div
                key={cIdx}
                className="h-8 bg-slate-100 rounded-lg flex-1"
                style={{ opacity: 1 - cIdx * 0.12 }}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export const CardSkeleton = () => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-6 space-y-4 shadow-sm animate-pulse">
      <div className="flex items-center justify-between">
        <div className="h-6 bg-slate-100 rounded-lg w-1/4" />
        <div className="h-6 bg-slate-100 rounded-full w-20" />
      </div>
      <div className="h-12 bg-slate-100 rounded-xl w-1/2" />
      <div className="h-4 bg-slate-100 rounded w-full" />
      <div className="h-4 bg-slate-100 rounded w-4/5" />
    </div>
  );
};

export const DetailSkeleton = () => {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-20 bg-white rounded-2xl border border-slate-200/80 p-6 flex justify-between items-center">
        <div className="space-y-2 w-1/3">
          <div className="h-6 bg-slate-100 rounded-lg w-3/4" />
          <div className="h-4 bg-slate-100 rounded w-1/2" />
        </div>
        <div className="h-10 bg-slate-100 rounded-xl w-28" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <CardSkeleton />
        <CardSkeleton />
      </div>
    </div>
  );
};

export default TableSkeleton;
