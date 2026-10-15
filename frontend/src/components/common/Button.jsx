import React from 'react';
import LoadingSpinner from './LoadingSpinner';

export const Button = ({
  children,
  type = 'button',
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  icon = null,
  iconPosition = 'left',
  className = '',
  onClick,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100';

  const sizeStyles = {
    sm: 'text-xs px-3 py-1.5 gap-1.5 h-8',
    md: 'text-sm px-4 py-2 gap-2 h-10',
    lg: 'text-base px-6 py-2.5 gap-2.5 h-12',
  }[size] || 'text-sm px-4 py-2 gap-2 h-10';

  const variantStyles = {
    primary:
      'bg-gradient-to-r from-primary to-secondary text-white hover:from-primary-dark hover:to-secondary-dark shadow-sm hover:shadow-md focus:ring-primary',
    secondary:
      'bg-surface-container-high text-primary hover:bg-surface-container hover:text-primary-dark focus:ring-primary',
    outline:
      'border border-primary text-primary bg-white hover:bg-sky-50 focus:ring-primary',
    ghost:
      'text-on-surface-variant hover:text-primary hover:bg-surface-container-low focus:ring-primary',
    danger:
      'bg-error text-white hover:bg-red-700 shadow-sm focus:ring-error',
    dark:
      'bg-[#0f172a] text-white hover:bg-[#1e293b] shadow-sm focus:ring-slate-800',
  }[variant] || '';

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      onClick={onClick}
      className={`${baseStyles} ${sizeStyles} ${variantStyles} ${className}`}
      {...props}
    >
      {isLoading ? (
        <>
          <LoadingSpinner size="sm" className="text-current" />
          <span>{children}</span>
        </>
      ) : (
        <>
          {icon && iconPosition === 'left' && <span className="shrink-0">{icon}</span>}
          <span>{children}</span>
          {icon && iconPosition === 'right' && <span className="shrink-0">{icon}</span>}
        </>
      )}
    </button>
  );
};

export default Button;
