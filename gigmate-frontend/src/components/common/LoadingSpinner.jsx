import React from 'react';
import { Loader2 } from 'lucide-react';

export const LoadingSpinner = ({ size = 'md', text = 'Loading...' }) => {
  const sizeClass = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  }[size] || 'w-8 h-8';

  return (
    <div className="flex flex-col items-center justify-center p-8 gap-3">
      <Loader2 className={`${sizeClass} animate-spin text-indigo-600`} />
      {text && <p className="text-sm font-medium text-slate-500">{text}</p>}
    </div>
  );
};

export const CardSkeleton = ({ count = 3 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
      {Array.from({ length: count }).map((_, idx) => (
        <div key={idx} className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex justify-between items-start">
            <div className="h-5 bg-slate-200 rounded w-1/2"></div>
            <div className="h-5 bg-slate-200 rounded-full w-16"></div>
          </div>
          <div className="h-4 bg-slate-200 rounded w-3/4"></div>
          <div className="h-16 bg-slate-100 rounded-xl"></div>
          <div className="flex justify-between items-center pt-2">
            <div className="h-4 bg-slate-200 rounded w-20"></div>
            <div className="h-8 bg-slate-200 rounded-lg w-24"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default LoadingSpinner;
