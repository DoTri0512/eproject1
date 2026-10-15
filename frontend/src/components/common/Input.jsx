import React, { forwardRef } from 'react';

export const Input = forwardRef(
  (
    {
      label,
      type = 'text',
      id,
      name,
      value,
      onChange,
      placeholder,
      error,
      helperText,
      startIcon,
      endIcon,
      required = false,
      disabled = false,
      className = '',
      inputClassName = '',
      ...props
    },
    ref
  ) => {
    const inputId = id || name;

    return (
      <div className={`flex flex-col gap-1.5 w-full ${className}`}>
        {label && (
          <label
            htmlFor={inputId}
            className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant flex items-center justify-between"
          >
            <span>
              {label} {required && <span className="text-error">*</span>}
            </span>
          </label>
        )}
        <div className="relative flex items-center">
          {startIcon && (
            <div className="absolute left-3 text-outline pointer-events-none flex items-center justify-center">
              {startIcon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            name={name}
            type={type}
            value={value}
            onChange={onChange}
            disabled={disabled}
            placeholder={placeholder}
            className={`w-full h-11 px-3.5 text-sm rounded-lg bg-white border transition-all duration-200 outline-none text-on-surface placeholder:text-outline/70
              ${startIcon ? 'pl-10' : ''}
              ${endIcon ? 'pr-10' : ''}
              ${
                error
                  ? 'border-error focus:border-error focus:ring-2 focus:ring-error/20 bg-red-50/10'
                  : 'border-slate-300 focus:border-primary focus:ring-2 focus:ring-primary/20 hover:border-slate-400'
              }
              ${disabled ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : ''}
              ${inputClassName}
            `}
            {...props}
          />
          {endIcon && (
            <div className="absolute right-3 flex items-center justify-center text-outline">
              {endIcon}
            </div>
          )}
        </div>
        {error && <span className="text-xs font-medium text-error mt-0.5">{error}</span>}
        {!error && helperText && (
          <span className="text-xs text-on-surface-variant mt-0.5">{helperText}</span>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
