import React from 'react';

export interface AvatarProps {
  src?: string;
  name: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  status?: 'available' | 'in-session' | 'on-break' | 'offline';
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({ src, name, size = 'md', status, className = '' }) => {
  const getInitials = (n: string) => {
    const parts = n.trim().split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return parts[0] ? parts[0].substring(0, 2).toUpperCase() : 'U';
  };

  const sizes = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-lg font-bold',
  };

  const statusColors = {
    available: 'bg-emerald-500 ring-white dark:ring-slate-900',
    'in-session': 'bg-amber-500 ring-white dark:ring-slate-900',
    'on-break': 'bg-sky-500 ring-white dark:ring-slate-900',
    offline: 'bg-slate-400 ring-white dark:ring-slate-900',
  };

  const statusSizes = {
    sm: 'w-2.5 h-2.5',
    md: 'w-3 h-3',
    lg: 'w-3.5 h-3.5',
    xl: 'w-4 h-4',
  };

  return (
    <div className="relative inline-block shrink-0">
      {src ? (
        <img
          src={src}
          alt={name}
          referrerPolicy="no-referrer"
          className={`${sizes[size]} rounded-full object-cover ring-2 ring-slate-100 dark:ring-slate-800 ${className}`}
        />
      ) : (
        <div
          className={`${sizes[size]} rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 font-semibold flex items-center justify-center ring-2 ring-slate-100 dark:ring-slate-800 ${className}`}
        >
          {getInitials(name)}
        </div>
      )}
      {status && (
        <span
          className={`absolute bottom-0 right-0 rounded-full ring-2 ${statusColors[status]} ${statusSizes[size]}`}
          title={`Status: ${status}`}
        />
      )}
    </div>
  );
};
