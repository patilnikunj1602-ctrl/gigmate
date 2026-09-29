import React from 'react';

export const StatCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  color = 'indigo', // indigo, emerald, amber, rose, blue, purple
}) => {
  const colorMap = {
    indigo: {
      bg: 'bg-indigo-50 text-indigo-600',
      border: 'hover:border-indigo-200',
      glow: 'group-hover:text-indigo-600',
    },
    emerald: {
      bg: 'bg-emerald-50 text-emerald-600',
      border: 'hover:border-emerald-200',
      glow: 'group-hover:text-emerald-600',
    },
    amber: {
      bg: 'bg-amber-50 text-amber-600',
      border: 'hover:border-amber-200',
      glow: 'group-hover:text-amber-600',
    },
    rose: {
      bg: 'bg-rose-50 text-rose-600',
      border: 'hover:border-rose-200',
      glow: 'group-hover:text-rose-600',
    },
    blue: {
      bg: 'bg-blue-50 text-blue-600',
      border: 'hover:border-blue-200',
      glow: 'group-hover:text-blue-600',
    },
    purple: {
      bg: 'bg-purple-50 text-purple-600',
      border: 'hover:border-purple-200',
      glow: 'group-hover:text-purple-600',
    },
  }[color] || {
    bg: 'bg-indigo-50 text-indigo-600',
    border: 'hover:border-indigo-200',
    glow: 'group-hover:text-indigo-600',
  };

  return (
    <div
      className={`group bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-all duration-200 ${colorMap.border}`}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          {title}
        </span>
        <div className={`p-2.5 rounded-xl ${colorMap.bg} transition-colors`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <div className="mt-3">
        <span className="text-2xl lg:text-3xl font-bold tracking-tight text-slate-900">
          {value}
        </span>
        {subtitle && (
          <p className="mt-1 text-xs text-slate-500 font-medium">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
};

export default StatCard;
