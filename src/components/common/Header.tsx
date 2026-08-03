import React from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { useThemeStore } from '../../store/useThemeStore';
import { RoleSwitcher } from './RoleSwitcher';
import { NotificationBell } from './NotificationBell';
import { Avatar } from '../ui/Avatar';
import { Sun, Moon, Menu, Hospital, Search } from 'lucide-react';

export interface HeaderProps {
  onToggleSidebar?: () => void;
  title?: string;
}

export const Header: React.FC<HeaderProps> = ({ onToggleSidebar, title }) => {
  const { user } = useAuthStore();
  const { isDarkMode, toggleTheme } = useThemeStore();

  return (
    <header className="sticky top-0 z-30 bg-white/90 dark:bg-[#09090b]/90 backdrop-blur-md border-b border-slate-200/80 dark:border-[#27272a] px-4 lg:px-6 py-3 transition-colors">
      <div className="flex items-center justify-between gap-4 max-w-7xl mx-auto">
        {/* Left: Mobile Menu Trigger & App Title */}
        <div className="flex items-center gap-3">
          {onToggleSidebar && (
            <button
              onClick={onToggleSidebar}
              className="lg:hidden p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#18181b] rounded-xl"
              aria-label="Toggle Navigation"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}

          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold shadow-md shadow-blue-900/20">
              <Hospital className="w-5 h-5" />
            </div>
            <div>
              <span className="text-base font-extrabold tracking-tight text-slate-900 dark:text-white">
                Heal<span className="text-blue-600 dark:text-blue-400">Sync Pro</span>
              </span>
              {title && <span className="hidden md:inline text-xs font-semibold text-slate-400 ml-2.5 pl-2.5 border-l border-slate-300 dark:border-[#27272a]">{title}</span>}
            </div>
          </div>
        </div>

        {/* Middle / Right Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Demo Role Switcher */}
          <RoleSwitcher />

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#18181b] transition-colors cursor-pointer"
            aria-label="Toggle Theme"
          >
            {isDarkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-600" />}
          </button>

          {/* Notifications */}
          <NotificationBell />

          {/* User Avatar */}
          {user && (
            <div className="flex items-center gap-2.5 pl-2 border-l border-slate-200 dark:border-[#27272a]">
              <Avatar src={user.avatar} name={user.name} size="md" />
              <div className="hidden xl:block text-left">
                <p className="text-xs font-bold text-slate-800 dark:text-slate-100 leading-tight">{user.name}</p>
                <p className="text-[10px] font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider">{user.role}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
