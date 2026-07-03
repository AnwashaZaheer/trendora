import React from 'react';

export const Badge = ({
  children,
  variant = 'primary',
  className = '',
  ...props
}) => {
  const baseStyles = 'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold select-none';
  
  const variants = {
    primary: 'bg-brand-50 text-brand-700 border border-brand-200/50 dark:bg-brand-950/40 dark:text-brand-300 dark:border-brand-900/30',
    secondary: 'bg-slate-100 text-slate-700 border border-slate-200/50 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700/50',
    success: 'bg-emerald-50 text-emerald-700 border border-emerald-200/50 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900/30',
    warning: 'bg-amber-50 text-amber-700 border border-amber-200/50 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-900/30',
    danger: 'bg-rose-50 text-rose-700 border border-rose-200/50 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-900/30',
  };

  return (
    <span
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
};
