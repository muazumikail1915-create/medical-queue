import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, className = '', hoverable = false, ...props }) => {
  return (
    <div
      className={`rounded-2xl border border-slate-200/80 dark:border-[#27272a] bg-white dark:bg-[#18181b] p-5 shadow-xs transition-all duration-200 ${
        hoverable ? 'hover:shadow-md hover:-translate-y-0.5 hover:border-slate-300 dark:hover:border-blue-500/40' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
