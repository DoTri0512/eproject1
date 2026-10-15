import React from 'react';

export const Badge = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  icon = null,
}) => {
  const sizeStyles = {
    sm: 'text-[11px] px-2 py-0.5 gap-1 font-semibold',
    md: 'text-xs px-2.5 py-1 gap-1.5 font-semibold',
    lg: 'text-sm px-3 py-1.5 gap-1.5 font-bold',
  }[size] || 'text-xs px-2.5 py-1 gap-1.5 font-semibold';

  const variantStyles = {
    primary: 'bg-sky-100 text-primary border border-sky-200',
    secondary: 'bg-blue-100 text-secondary border border-blue-200',
    cyan: 'bg-cyan-50 text-cyan-700 border border-cyan-200',
    success: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    warning: 'bg-amber-50 text-amber-700 border border-amber-200',
    danger: 'bg-rose-50 text-rose-700 border border-rose-200',
    neutral: 'bg-slate-100 text-slate-700 border border-slate-200',
    dark: 'bg-slate-800 text-white',
    glass: 'bg-white/20 backdrop-blur-md text-white border border-white/30',
  }[variant] || 'bg-sky-100 text-primary';

  return (
    <span
      className={`inline-flex items-center rounded-full tracking-wide shrink-0 ${sizeStyles} ${variantStyles} ${className}`}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
    </span>
  );
};

export default Badge;
