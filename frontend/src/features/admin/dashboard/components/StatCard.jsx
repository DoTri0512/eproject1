import React from 'react';

export const StatCard = ({
  title,
  value,
  unit,
  change,
  changeType = 'up',
  note,
  icon,
  iconBg = 'bg-sky-50 text-sky-600',
}) => {
  return (
    <div className="relative overflow-hidden p-5 rounded-2xl bg-white border border-slate-200/80 shadow-soft hover:shadow-hover transition-all duration-300 flex flex-col justify-between group">
      {/* Decorative ambient bubble */}
      <div className="absolute -right-4 -top-4 w-24 h-24 rounded-full bg-slate-100/50 pointer-events-none group-hover:scale-125 transition-transform" />

      <div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            {title}
          </span>
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${iconBg} shadow-xs`}>
            <span className="material-symbols-outlined text-[22px]">{icon}</span>
          </div>
        </div>

        <div className="flex items-baseline gap-2 mb-1">
          <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {value}
          </span>
          {unit && <span className="text-xs font-semibold text-slate-500">{unit}</span>}
        </div>
      </div>

      <div className="pt-3 mt-2 border-t border-slate-100 flex items-center justify-between">
        {change && (
          <div
            className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold ${
              changeType === 'up'
                ? 'bg-emerald-50 text-emerald-700'
                : 'bg-rose-50 text-rose-700'
            }`}
          >
            <span className="material-symbols-outlined text-[14px]">
              {changeType === 'up' ? 'trending_up' : 'trending_down'}
            </span>
            <span>{change}</span>
          </div>
        )}
        {note && <span className="text-xs text-slate-400 truncate">{note}</span>}
      </div>
    </div>
  );
};

export default StatCard;
