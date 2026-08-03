import React from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { UserRole } from '../../types';
import { User, Stethoscope, ClipboardList, ShieldCheck } from 'lucide-react';

export const RoleSwitcher: React.FC = () => {
  const { role, switchRole } = useAuthStore();

  const roles: { id: UserRole; label: string; icon: React.ReactNode }[] = [
    { id: 'patient', label: 'Patient', icon: <User className="w-3.5 h-3.5" /> },
    { id: 'receptionist', label: 'Reception', icon: <ClipboardList className="w-3.5 h-3.5" /> },
    { id: 'doctor', label: 'Doctor', icon: <Stethoscope className="w-3.5 h-3.5" /> },
    { id: 'admin', label: 'Admin', icon: <ShieldCheck className="w-3.5 h-3.5" /> },
  ];

  return (
    <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200/80 dark:border-slate-700">
      {roles.map((r) => {
        const isActive = role === r.id;
        return (
          <button
            key={r.id}
            onClick={() => switchRole(r.id)}
            className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              isActive
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
            title={`Switch view to ${r.label}`}
          >
            {r.icon}
            <span className="hidden sm:inline">{r.label}</span>
          </button>
        );
      })}
    </div>
  );
};
