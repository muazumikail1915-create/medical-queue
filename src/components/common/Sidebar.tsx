import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import {
  LayoutDashboard,
  Calendar,
  Clock,
  History,
  Bell,
  User,
  Settings,
  Users,
  Stethoscope,
  Building2,
  BarChart3,
  FileSpreadsheet,
  UserPlus,
  ClipboardList,
  LogOut,
} from 'lucide-react';

export interface SidebarProps {
  isOpen: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { role, logout } = useAuthStore();

  const getNavLinks = () => {
    switch (role) {
      case 'patient':
        return [
          { to: '/patient', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
          { to: '/patient/book-appointment', label: 'Book Appointment', icon: <Calendar className="w-4 h-4" /> },
          { to: '/patient/queue-status', label: 'Live Queue Status', icon: <Clock className="w-4 h-4" /> },
          { to: '/patient/upcoming-appointments', label: 'Upcoming', icon: <Calendar className="w-4 h-4" /> },
          { to: '/patient/appointment-history', label: 'History', icon: <History className="w-4 h-4" /> },
          { to: '/patient/notifications', label: 'Notifications', icon: <Bell className="w-4 h-4" /> },
          { to: '/patient/profile', label: 'Profile & Settings', icon: <User className="w-4 h-4" /> },
        ];
      case 'receptionist':
        return [
          { to: '/reception', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
          { to: '/reception/queue', label: 'Today Queue', icon: <Clock className="w-4 h-4" /> },
          { to: '/reception/walkin-register', label: 'Walk-In Registration', icon: <UserPlus className="w-4 h-4" /> },
          { to: '/reception/appointments', label: 'Appointments', icon: <Calendar className="w-4 h-4" /> },
          { to: '/reception/patients', label: 'Patient Directory', icon: <Users className="w-4 h-4" /> },
          { to: '/reception/doctors', label: 'Doctor Availability', icon: <Stethoscope className="w-4 h-4" /> },
        ];
      case 'doctor':
        return [
          { to: '/doctor', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
          { to: '/doctor/queue', label: 'Live Consultation Queue', icon: <Clock className="w-4 h-4" /> },
          { to: '/doctor/schedule', label: 'My Schedule', icon: <Calendar className="w-4 h-4" /> },
          { to: '/doctor/profile', label: 'My Profile & Status', icon: <User className="w-4 h-4" /> },
        ];
      case 'admin':
        return [
          { to: '/admin', label: 'Executive Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
          { to: '/admin/analytics', label: 'Analytics & Trends', icon: <BarChart3 className="w-4 h-4" /> },
          { to: '/admin/doctors', label: 'Manage Doctors', icon: <Stethoscope className="w-4 h-4" /> },
          { to: '/admin/patients', label: 'Manage Patients', icon: <Users className="w-4 h-4" /> },
          { to: '/admin/appointments', label: 'Appointments Log', icon: <ClipboardList className="w-4 h-4" /> },
          { to: '/admin/departments', label: 'Departments', icon: <Building2 className="w-4 h-4" /> },
          { to: '/admin/reports', label: 'Hospital Reports', icon: <FileSpreadsheet className="w-4 h-4" /> },
          { to: '/admin/settings', label: 'System Settings', icon: <Settings className="w-4 h-4" /> },
        ];
      default:
        return [];
    }
  };

  const links = getNavLinks();

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs lg:hidden transition-opacity"
        />
      )}

      <aside
        className={`fixed top-16 bottom-0 left-0 z-40 w-64 bg-white dark:bg-[#09090b] border-r border-slate-200/80 dark:border-[#27272a] transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        } flex flex-col justify-between p-4`}
      >
        <div className="space-y-6">
          <div className="px-3 py-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              {role} portal
            </span>
          </div>

          <nav className="space-y-1">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/patient' || link.to === '/reception' || link.to === '/doctor' || link.to === '/admin'}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 text-sm font-medium rounded-xl transition-all ${
                    isActive
                      ? 'bg-blue-600/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 font-semibold'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#18181b] hover:text-slate-900 dark:hover:text-slate-100'
                  }`
                }
              >
                {link.icon}
                <span>{link.label}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Footer Logout */}
        <div className="pt-4 border-t border-slate-100 dark:border-[#27272a]">
          <button
            onClick={() => {
              logout();
              if (onClose) onClose();
            }}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 text-sm font-medium text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-xl transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};
