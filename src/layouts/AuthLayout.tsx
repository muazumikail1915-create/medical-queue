import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Hospital, ShieldCheck } from 'lucide-react';
import { ToastContainer } from '../components/ui/ToastContainer';
import { RoleSwitcher } from '../components/common/RoleSwitcher';

export const AuthLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-emerald-50/50 via-slate-50 to-teal-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-emerald-950/20 p-4 relative overflow-hidden">
      {/* Top Header */}
      <div className="absolute top-4 right-4 z-20">
        <RoleSwitcher />
      </div>

      <div className="w-full max-w-md space-y-6 relative z-10">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2.5">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center shadow-md">
              <Hospital className="w-6 h-6" />
            </div>
            <span className="text-2xl font-black tracking-tight text-slate-900 dark:text-slate-100">
              Med<span className="text-emerald-600 dark:text-emerald-400">Queue</span>
            </span>
          </Link>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium flex items-center justify-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> Secure Healthcare Access Portal
          </p>
        </div>

        {/* Auth Box Outlet */}
        <Outlet />
      </div>

      <ToastContainer />
    </div>
  );
};
