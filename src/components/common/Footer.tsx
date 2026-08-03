import React from 'react';
import { Hospital, Shield, Heart, Globe } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white dark:bg-slate-900 border-t border-slate-200/80 dark:border-slate-800 py-8 px-4 mt-auto text-slate-500 dark:text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
            <Hospital className="w-3.5 h-3.5" />
          </div>
          <span className="font-bold text-slate-800 dark:text-slate-200">MedQueue Smart Healthcare System</span>
        </div>

        <div className="flex items-center gap-6">
          <span className="flex items-center gap-1">
            <Shield className="w-3.5 h-3.5 text-emerald-500" /> HIPAA Compliant
          </span>
          <span className="flex items-center gap-1">
            <Globe className="w-3.5 h-3.5 text-emerald-500" /> Real-time Sync
          </span>
          <span className="flex items-center gap-1">
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> Patient Care First
          </span>
        </div>

        <p>© 2026 City Care Healthcare Systems. All rights reserved.</p>
      </div>
    </footer>
  );
};
