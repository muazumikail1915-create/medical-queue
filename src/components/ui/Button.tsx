import React from 'react';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost' | 'link';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  icon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, variant = 'primary', size = 'md', isLoading = false, icon, className = '', disabled, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl cursor-pointer select-none';

    const variants = {
      primary: 'bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-900/20 focus:ring-blue-500 dark:bg-blue-600 dark:hover:bg-blue-500',
      secondary: 'bg-slate-100 text-slate-800 hover:bg-slate-200 dark:bg-[#18181b] dark:border dark:border-[#27272a] dark:text-slate-100 dark:hover:bg-[#27272a] focus:ring-slate-400',
      outline: 'border border-slate-300 dark:border-[#27272a] text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-[#18181b] focus:ring-slate-400',
      danger: 'bg-rose-600 hover:bg-rose-700 text-white shadow-sm focus:ring-rose-500 dark:bg-rose-600 dark:hover:bg-rose-500',
      ghost: 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#18181b] focus:ring-slate-400',
      link: 'text-blue-600 dark:text-blue-400 hover:underline p-0 h-auto font-normal',
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-xs gap-1.5',
      md: 'px-4 py-2 text-sm gap-2',
      lg: 'px-5 py-2.5 text-base gap-2.5',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : icon ? (
          <span className="shrink-0">{icon}</span>
        ) : null}
        <span>{children}</span>
      </button>
    );
  }
);

Button.displayName = 'Button';
